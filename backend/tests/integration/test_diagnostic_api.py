from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.api.profile import identity
from app.main import create_app

pytestmark = pytest.mark.integration


def test_attempt_lifecycle_and_isolation(database, students, admin):
    app = create_app()
    app.state.database = database
    app.dependency_overrides[identity] = lambda: students[0]
    client = TestClient(app)
    assert client.get("/api/v1/diagnostic/current").json() is None
    request_id = str(uuid4())
    response = client.post(
        "/api/v1/diagnostic/attempts", json={"language": "python", "request_id": request_id}
    )
    assert response.status_code == 200, response.text
    attempt = response.json()
    assert len(attempt["questions"]) == 16
    assert (
        client.post(
            "/api/v1/diagnostic/attempts", json={"language": "python", "request_id": request_id}
        ).json()["id"]
        == attempt["id"]
    )
    answers = {q["id"]: i % len(q["options"]) for i, q in enumerate(attempt["questions"])}
    payload = {
        "revision": attempt["revision"],
        "step": 15,
        "review": True,
        "answers": answers,
        "complete": False,
    }
    saved = client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=payload)
    assert saved.status_code == 200, saved.text
    attempt = saved.json()
    assert attempt["answers"] == answers
    assert (
        client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=payload).status_code == 409
    )

    def answer_timestamps():
        return admin.execute(
            "SELECT question_id, answered_at FROM app_private.diagnostic_answers "
            "WHERE attempt_id=%s ORDER BY question_id",
            (attempt["id"],),
        ).fetchall()

    partial = dict(list(answers.items())[:2])
    partial[next(iter(partial))] = 1
    for selection in (partial, {}, answers):
        update = {**payload, "revision": attempt["revision"], "review": False, "answers": selection}
        response = client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=update)
        assert response.status_code == 200, response.text
        attempt = response.json()
        assert attempt["answers"] == selection

    before = answer_timestamps()
    payload.update(revision=attempt["revision"], review=False, step=14)
    moved = client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=payload)
    assert moved.status_code == 200
    assert answer_timestamps() == before
    attempt = moved.json()
    payload.update(revision=attempt["revision"], complete=True)
    done = client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=payload)
    assert done.status_code == 200, done.text
    result = done.json()
    assert result["completed"] and result["score"] == 2 * result["correct_count"]
    app.dependency_overrides[identity] = lambda: students[1]
    assert client.get("/api/v1/diagnostic/current").json() is None
    assert (
        client.put("/api/v1/diagnostic/attempts/" + attempt["id"], json=payload).status_code == 404
    )
    app.dependency_overrides[identity] = lambda: students[0]
    payload.update(revision=result["revision"], complete=False, review=True)
    edited = client.put("/api/v1/diagnostic/attempts/" + result["id"], json=payload)
    assert edited.status_code == 200, edited.text
    assert edited.json()["id"] != result["id"]
    assert (
        client.post(
            "/api/v1/diagnostic/reset",
            json={"attempt_id": edited.json()["id"], "revision": edited.json()["revision"]},
        ).status_code
        == 200
    )
    assert client.get("/api/v1/diagnostic/current").json() is None
