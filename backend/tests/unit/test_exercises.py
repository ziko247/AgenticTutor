from typing import get_args

from fastapi.testclient import TestClient

from app.api.profile import Language
from app.main import create_app


def test_every_language_has_ten_complete_exercises():
    client = TestClient(create_app())
    for language in get_args(Language):
        response = client.get(f"/api/v1/exercises/{language}")
        assert response.status_code == 200
        rows = response.json()
        assert len(rows) == len({row["id"] for row in rows}) == 10
        for row in rows:
            assert all(
                row[key].strip()
                for key in ("title", "prompt", "code", "hint", "answer", "brief", "steps", "image")
            )
            assert len({row["brief"], row["steps"], row["image"]}) == 3
    assert client.get("/api/v1/exercises/unknown").status_code == 422
