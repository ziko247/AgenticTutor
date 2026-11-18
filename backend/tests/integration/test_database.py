from uuid import uuid4

import psycopg
import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr

from app.core.config import Settings
from app.main import create_app

pytestmark = pytest.mark.integration


def test_ready_with_actual_runtime_connection(database):
    database.check_ready()
    with TestClient(create_app(Settings())) as client:
        assert client.get("/api/v1/health/live").status_code == 200
        assert client.get("/api/v1/health/ready").status_code == 200


def test_privileged_connection_is_not_ready(stack):
    settings = Settings(database_url=SecretStr(stack["DB_URL"]))
    with TestClient(create_app(settings)) as client:
        assert client.get("/api/v1/health/ready").status_code == 503


def test_schema_version_mismatch_is_not_ready(admin, database):
    admin.execute("UPDATE app_private.schema_version SET version=999")
    try:
        with pytest.raises(RuntimeError, match="schema"):
            database.check_ready()
    finally:
        admin.execute("UPDATE app_private.schema_version SET version=1")


def test_profiles_are_isolated_and_context_does_not_leak(database, students):
    a, b = students
    with database.transaction_for(a) as connection:
        assert connection.execute("SELECT user_id FROM app_private.profiles").fetchall() == [(a,)]
        assert (
            connection.execute(
                "UPDATE app_private.profiles SET display_name='changed' WHERE user_id=%s RETURNING user_id",
                (b,),
            ).fetchall()
            == []
        )
    with database.transaction_for(b) as connection:
        assert connection.execute("SELECT user_id FROM app_private.profiles").fetchall() == [(b,)]
    with database.pool.connection() as connection:
        assert connection.execute("SELECT * FROM app_private.profiles").fetchall() == []
    with pytest.raises(RuntimeError, match="rollback"), database.transaction_for(a):
        raise RuntimeError("rollback")
    with database.pool.connection() as connection:
        assert connection.execute("SELECT * FROM app_private.profiles").fetchall() == []


def test_runtime_cannot_forge_profile_or_publish(database, students):
    a, _ = students
    with (
        pytest.raises(psycopg.errors.InsufficientPrivilege),
        database.transaction_for(a) as connection,
    ):
        connection.execute(
            "INSERT INTO app_private.profiles(user_id,display_name) VALUES (%s,'forged')",
            (uuid4(),),
        )
    for statement in [
        "CREATE TABLE app_private.unauthorized(id int)",
        "UPDATE app_private.schema_version SET version=999",
        "UPDATE app_private.questionnaires SET status='retired'",
    ]:
        with (
            pytest.raises(psycopg.errors.InsufficientPrivilege),
            database.transaction_for(a) as connection,
        ):
            connection.execute(statement)


def test_banks_are_complete_and_private(admin):
    counts = admin.execute(
        """SELECT q.language_code, count(DISTINCT r.id), count(DISTINCT k.question_id)
           FROM app_private.questionnaires q
           JOIN app_private.questions r ON r.questionnaire_id=q.id
           LEFT JOIN app_private.answer_keys k ON k.question_id=r.id
           WHERE q.status='published' GROUP BY q.language_code"""
    ).fetchall()
    assert len(counts) == 10
    assert all(questions == 16 and keys == 10 for _, questions, keys in counts)
    for role in ("anon", "authenticated"):
        assert not admin.execute(
            "SELECT has_schema_privilege(%s,'app_private','USAGE')", (role,)
        ).fetchone()[0]


def test_answer_foreign_keys_and_attempt_ownership(admin, database, students):
    a, b = students
    rows = admin.execute(
        """SELECT q.id, r.id, o.id FROM app_private.questionnaires q
           JOIN app_private.questions r ON r.questionnaire_id=q.id
           JOIN app_private.answer_options o ON o.question_id=r.id
           WHERE r.ordinal=7 AND o.ordinal=0 ORDER BY q.language_code LIMIT 2"""
    ).fetchall()
    questionnaire, question, option = rows[0]
    other_questionnaire, other_question, other_option = rows[1]
    attempt = uuid4()
    with database.transaction_for(a) as connection:
        connection.execute(
            """INSERT INTO app_private.diagnostic_attempts
               (id,user_id,questionnaire_id,client_request_id,create_payload_hash)
               VALUES (%s,%s,%s,%s,%s)""",
            (attempt, a, questionnaire, uuid4(), "0" * 64),
        )
        connection.execute(
            """INSERT INTO app_private.diagnostic_answers
               (attempt_id,questionnaire_id,question_id,option_id) VALUES (%s,%s,%s,%s)""",
            (attempt, questionnaire, question, option),
        )
    with database.transaction_for(b) as connection:
        assert (
            connection.execute(
                "SELECT * FROM app_private.diagnostic_attempts WHERE id=%s", (attempt,)
            ).fetchall()
            == []
        )
        assert (
            connection.execute(
                "SELECT * FROM app_private.diagnostic_answers WHERE attempt_id=%s", (attempt,)
            ).fetchall()
            == []
        )
    with (
        pytest.raises(psycopg.errors.ForeignKeyViolation),
        database.transaction_for(a) as connection,
    ):
        connection.execute(
            """INSERT INTO app_private.diagnostic_answers
               (attempt_id,questionnaire_id,question_id,option_id) VALUES (%s,%s,%s,%s)""",
            (attempt, other_questionnaire, other_question, other_option),
        )
    with (
        pytest.raises(psycopg.errors.ForeignKeyViolation),
        database.transaction_for(a) as connection,
    ):
        connection.execute(
            "UPDATE app_private.diagnostic_answers SET option_id=%s WHERE attempt_id=%s",
            (other_option, attempt),
        )
    with (
        pytest.raises(psycopg.errors.InsufficientPrivilege),
        database.transaction_for(a) as connection,
    ):
        connection.execute(
            "UPDATE app_private.diagnostic_attempts SET score=20 WHERE id=%s", (attempt,)
        )
    with database.transaction_for(a) as connection:
        connection.execute("DELETE FROM app_private.diagnostic_attempts WHERE id=%s", (attempt,))
        assert (
            connection.execute(
                "SELECT * FROM app_private.diagnostic_answers WHERE attempt_id=%s", (attempt,)
            ).fetchall()
            == []
        )


def test_published_content_is_immutable(admin):
    with pytest.raises(psycopg.errors.RaiseException), admin.transaction():
        admin.execute("UPDATE app_private.questions SET prompt='unexpected'")


def test_invalid_publication_is_rejected(admin):
    with pytest.raises(psycopg.errors.RaiseException), admin.transaction():
        admin.execute(
            """INSERT INTO app_private.questionnaires
            (language_code,version,content_hash,status,published_at)
            VALUES (\'python\',999,%s,\'published\',now())""",
            ("0" * 64,),
        )
    with pytest.raises(psycopg.errors.RaiseException), admin.transaction():
        row = admin.execute(
            """INSERT INTO app_private.questionnaires
            (language_code,version,content_hash) VALUES (\'python\',999,%s) RETURNING id""",
            ("0" * 64,),
        ).fetchone()
        admin.execute(
            "UPDATE app_private.questionnaires SET status='published',published_at=now() WHERE id=%s",
            row,
        )


def test_context_is_required_for_writes(database):
    with (
        pytest.raises(psycopg.errors.InsufficientPrivilege),
        database.pool.connection() as connection,
    ):
        connection.execute(
            "INSERT INTO app_private.profiles(user_id,display_name) VALUES (%s,'anonymous')",
            (uuid4(),),
        )


def test_import_cannot_attach_another_students_attempt(admin, database, students):
    a, b = students
    questionnaire = admin.execute(
        "SELECT id FROM app_private.questionnaires ORDER BY language_code LIMIT 1"
    ).fetchone()[0]
    attempt = uuid4()
    with database.transaction_for(a) as connection:
        connection.execute(
            """INSERT INTO app_private.diagnostic_attempts
               (id,user_id,questionnaire_id,client_request_id,create_payload_hash)
               VALUES (%s,%s,%s,%s,%s)""",
            (attempt, a, questionnaire, uuid4(), "0" * 64),
        )
        connection.execute(
            """INSERT INTO app_private.diagnostic_imports
               (user_id,client_import_id,attempt_id,payload_hash) VALUES (%s,%s,%s,%s)""",
            (a, uuid4(), attempt, "0" * 64),
        )
    with database.transaction_for(b) as connection:
        assert connection.execute("SELECT * FROM app_private.diagnostic_imports").fetchall() == []
    with (
        pytest.raises(psycopg.errors.ForeignKeyViolation),
        database.transaction_for(b) as connection,
    ):
        connection.execute(
            """INSERT INTO app_private.diagnostic_imports
               (user_id,client_import_id,attempt_id,payload_hash) VALUES (%s,%s,%s,%s)""",
            (b, uuid4(), attempt, "0" * 64),
        )
    admin.execute("DELETE FROM app_private.diagnostic_attempts WHERE id=%s", (attempt,))
    assert (
        admin.execute(
            "SELECT * FROM app_private.diagnostic_imports WHERE attempt_id=%s", (attempt,)
        ).fetchall()
        == []
    )


def test_completed_attempt_cannot_receive_answers(admin, database, students):
    a, _ = students
    questionnaire, question, option = admin.execute(
        """SELECT q.id, r.id, o.id FROM app_private.questionnaires q
           JOIN app_private.questions r ON r.questionnaire_id=q.id
           JOIN app_private.answer_options o ON o.question_id=r.id LIMIT 1"""
    ).fetchone()
    attempt = uuid4()
    admin.execute(
        """INSERT INTO app_private.diagnostic_attempts
           (id,user_id,questionnaire_id,client_request_id,create_payload_hash,
            state,score,correct_count,completed_at)
           VALUES (%s,%s,%s,%s,%s,'completed',0,0,now())""",
        (attempt, a, questionnaire, uuid4(), "0" * 64),
    )
    try:
        with (
            pytest.raises(psycopg.errors.RaiseException),
            database.transaction_for(a) as connection,
        ):
            connection.execute(
                """INSERT INTO app_private.diagnostic_answers
                   (attempt_id,questionnaire_id,question_id,option_id) VALUES (%s,%s,%s,%s)""",
                (attempt, questionnaire, question, option),
            )
    finally:
        admin.execute("DELETE FROM app_private.diagnostic_attempts WHERE id=%s", (attempt,))
