import hashlib
from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg.rows import dict_row
from pydantic import BaseModel, ConfigDict, Field, StrictInt

from app.api.profile import Language, db, identity

router = APIRouter(prefix="/api/v1/diagnostic")
Identity = Annotated[UUID, Depends(identity)]


class StartInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    language: Language
    request_id: UUID


class SaveInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    revision: int = Field(gt=0)
    step: int = Field(ge=0, le=15)
    review: bool = False
    answers: dict[str, StrictInt]
    complete: bool = False


def questionnaire(cursor, questionnaire_id):
    rows = cursor.execute(
        """SELECT q.id, q.source_key, q.prompt, q.code, q.kind, q.ordinal,
                  array_agg(o.label ORDER BY o.ordinal) AS options
           FROM app_private.questions q
           JOIN app_private.answer_options o ON o.question_id=q.id
           WHERE q.questionnaire_id=%s
           GROUP BY q.id ORDER BY q.ordinal""",
        (questionnaire_id,),
    ).fetchall()
    return [
        {
            "id": row["source_key"],
            "title": row["prompt"],
            "code": row["code"],
            "options": row["options"],
            "kind": row["kind"],
        }
        for row in rows
    ]


def read_attempt(cursor, attempt_id):
    row = cursor.execute(
        """SELECT a.*, q.language_code, q.content_hash, q.version AS questionnaire_version,
                  r.ordinal AS cursor_ordinal
           FROM app_private.diagnostic_attempts a
           JOIN app_private.questionnaires q ON q.id=a.questionnaire_id
           LEFT JOIN app_private.questions r ON r.id=a.cursor_question_id
           WHERE a.id=%s""",
        (attempt_id,),
    ).fetchone()
    if row is None:
        raise HTTPException(404, "Attempt not found")
    answers = cursor.execute(
        """SELECT q.source_key, o.ordinal FROM app_private.diagnostic_answers a
           JOIN app_private.questions q ON q.id=a.question_id
           JOIN app_private.answer_options o ON o.id=a.option_id
           WHERE a.attempt_id=%s""",
        (attempt_id,),
    ).fetchall()
    return {
        "id": row["id"],
        "language": row["language_code"],
        "revision": row["revision"],
        "step": (row["cursor_ordinal"] or 1) - 1,
        "review": row["review"],
        "completed": row["state"] == "completed",
        "score": row["score"],
        "correct_count": row["correct_count"],
        "questionnaire_id": row["questionnaire_id"],
        "questionnaire_version": row["questionnaire_version"],
        "content_hash": row["content_hash"],
        "answers": {a["source_key"]: a["ordinal"] for a in answers},
        "questions": questionnaire(cursor, row["questionnaire_id"]),
    }


@router.get("/current")
def current(request: Request, user_id: Identity):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        row = cursor.execute(
            "SELECT id FROM app_private.diagnostic_attempts WHERE is_current ORDER BY created_at DESC, id DESC LIMIT 1"
        ).fetchone()
        return read_attempt(cursor, row["id"]) if row else None


def lock_profile(cursor, user_id):
    profile = cursor.execute(
        "SELECT user_id FROM app_private.profiles WHERE user_id=%s FOR UPDATE", (user_id,)
    ).fetchone()
    if profile is None:
        raise HTTPException(409, "Profile required")


@router.post("/attempts")
def start(body: StartInput, request: Request, user_id: Identity):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        lock_profile(cursor, user_id)
        existing = cursor.execute(
            "SELECT id,create_payload_hash FROM app_private.diagnostic_attempts WHERE user_id=%s AND client_request_id=%s",
            (user_id, body.request_id),
        ).fetchone()
        digest = hashlib.sha256(body.language.encode()).hexdigest()
        if existing:
            if existing["create_payload_hash"] != digest:
                raise HTTPException(409, "Request conflict")
            return read_attempt(cursor, existing["id"])
        cursor.execute(
            "UPDATE app_private.diagnostic_attempts SET is_current=false WHERE user_id=%s AND is_current",
            (user_id,),
        )
        q = cursor.execute(
            """SELECT id FROM app_private.questionnaires WHERE language_code=%s AND status='published'
               ORDER BY version DESC LIMIT 1""",
            (body.language,),
        ).fetchone()
        if q is None:
            raise HTTPException(404, "Questionnaire unavailable")
        row = cursor.execute(
            """INSERT INTO app_private.diagnostic_attempts
               (user_id,questionnaire_id,client_request_id,create_payload_hash)
               VALUES (%s,%s,%s,%s) ON CONFLICT (user_id,client_request_id) DO NOTHING
               RETURNING id""",
            (user_id, q["id"], body.request_id, digest),
        ).fetchone()
        if row is None:
            row = cursor.execute(
                "SELECT id,create_payload_hash FROM app_private.diagnostic_attempts WHERE user_id=%s AND client_request_id=%s",
                (user_id, body.request_id),
            ).fetchone()
            if row["create_payload_hash"] != digest:
                raise HTTPException(409, "Request conflict")
        cursor.execute(
            """UPDATE app_private.profiles SET preferred_language=%s, revision=revision+1,
               updated_at=now() WHERE user_id=%s AND preferred_language IS DISTINCT FROM %s""",
            (body.language, user_id, body.language),
        )
        return read_attempt(cursor, row["id"])


@router.put("/attempts/{attempt_id}")
def save(attempt_id: UUID, body: SaveInput, request: Request, user_id: Identity):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        lock_profile(cursor, user_id)
        row = cursor.execute(
            "SELECT * FROM app_private.diagnostic_attempts WHERE id=%s FOR UPDATE", (attempt_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(404, "Attempt not found")
        if not row["is_current"]:
            raise HTTPException(409, "Attempt is no longer current")
        if row["revision"] != body.revision:
            raise HTTPException(409, "Attempt changed")
        if row["state"] == "completed":
            if body.complete:
                return read_attempt(cursor, attempt_id)
            # Editing a result creates a new linked attempt; the old score remains unchanged.
            cursor.execute(
                "UPDATE app_private.diagnostic_attempts SET is_current=false WHERE id=%s",
                (attempt_id,),
            )
            created = cursor.execute(
                """INSERT INTO app_private.diagnostic_attempts
                   (user_id,questionnaire_id,client_request_id,create_payload_hash,supersedes_attempt_id)
                   VALUES (%s,%s,%s,%s,%s) RETURNING id""",
                (
                    user_id,
                    row["questionnaire_id"],
                    uuid4(),
                    hashlib.sha256(str(attempt_id).encode()).hexdigest(),
                    attempt_id,
                ),
            ).fetchone()
            attempt_id = created["id"]
            row["revision"] = 1
        questions = cursor.execute(
            """SELECT q.id,q.source_key,q.ordinal, o.id AS option_id,o.ordinal AS option_ordinal
               FROM app_private.questions q JOIN app_private.answer_options o ON o.question_id=q.id
               WHERE q.questionnaire_id=%s ORDER BY q.ordinal,o.ordinal""",
            (row["questionnaire_id"],),
        ).fetchall()
        question_ids = {q["source_key"]: q["id"] for q in questions}
        options = {(q["source_key"], q["option_ordinal"]): q["option_id"] for q in questions}
        if any((key, value) not in options for key, value in body.answers.items()):
            raise HTTPException(422, "Invalid answer")
        if (body.complete or body.review) and len(body.answers) != len(question_ids):
            raise HTTPException(409, "Incomplete attempt")
        cursor_id = next((q["id"] for q in questions if q["ordinal"] == body.step + 1), None)
        kept_questions = [question_ids[key] for key in body.answers]
        cursor.execute(
            """DELETE FROM app_private.diagnostic_answers
               WHERE attempt_id=%s AND NOT (question_id = ANY(%s::uuid[]))""",
            (attempt_id, kept_questions),
        )
        if kept_questions:
            selected_options = [options[item] for item in body.answers.items()]
            cursor.execute(
                """INSERT INTO app_private.diagnostic_answers AS answer
                   (attempt_id,questionnaire_id,question_id,option_id)
                   SELECT %s, %s, question_id, option_id
                   FROM unnest(%s::uuid[], %s::uuid[]) AS selected(question_id, option_id)
                   ON CONFLICT (attempt_id,question_id) DO UPDATE
                   SET option_id=EXCLUDED.option_id, answered_at=now()
                   WHERE answer.option_id IS DISTINCT FROM EXCLUDED.option_id""",
                (attempt_id, row["questionnaire_id"], kept_questions, selected_options),
            )
        cursor.execute(
            """UPDATE app_private.diagnostic_attempts SET cursor_question_id=%s,review=%s,
               revision=revision+1,updated_at=now() WHERE id=%s""",
            (cursor_id, body.review, attempt_id),
        )
        if body.complete:
            cursor.execute(
                "SELECT app_private.complete_diagnostic(%s,%s)", (attempt_id, row["revision"] + 1)
            )
        return read_attempt(cursor, attempt_id)


class ResetInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    attempt_id: UUID
    revision: int = Field(gt=0)


@router.post("/reset")
def reset(body: ResetInput, request: Request, user_id: Identity):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        row = cursor.execute(
            "UPDATE app_private.diagnostic_attempts SET is_current=false WHERE id=%s AND is_current AND revision=%s RETURNING id",
            (body.attempt_id, body.revision),
        ).fetchone()
        if row is None:
            raise HTTPException(409, "Attempt changed")
    return {"ok": True}
