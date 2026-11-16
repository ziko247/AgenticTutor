from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient

from app.main import create_app

pytestmark = pytest.mark.integration


def test_real_auth_profile_contract(stack):
    email = f"milestone2-{uuid4()}@example.invalid"
    password = "Test-only-pass9!"
    key = stack.get("PUBLISHABLE_KEY") or stack["ANON_KEY"]
    admin_key = stack.get("SERVICE_ROLE_KEY") or stack["SECRET_KEY"]
    user_id = None
    with httpx.Client(base_url=stack["API_URL"], headers={"apikey": key}, timeout=10) as auth:
        result = auth.post("/auth/v1/signup", json={"email": email, "password": password})
        assert result.status_code == 200
        user_id = result.json()["user"]["id"]
        try:
            login = auth.post(
                "/auth/v1/token?grant_type=password", json={"email": email, "password": password}
            )
            token = login.json()["access_token"]
            headers = {"Authorization": "Bearer " + token}
            with TestClient(create_app()) as client:
                assert client.get("/api/v1/me/profile").status_code == 401
                assert (
                    client.get(
                        "/api/v1/me/profile", headers={"Authorization": "Bearer forged"}
                    ).status_code
                    == 401
                )
                assert client.get("/api/v1/me/profile", headers=headers).status_code == 404
                body = {"display_name": "Student", "preferred_language": "python"}
                response = client.put("/api/v1/me/profile", headers=headers, json=body)
                assert response.status_code == 201
                assert response.json()["user_id"] == user_id
                assert (
                    client.put("/api/v1/me/profile", headers=headers, json=body).status_code == 200
                )
                assert (
                    client.put(
                        "/api/v1/me/profile",
                        headers=headers,
                        json={**body, "display_name": "Other"},
                    ).status_code
                    == 409
                )
                assert (
                    client.put(
                        "/api/v1/me/profile",
                        headers=headers,
                        json={**body, "user_id": str(uuid4())},
                    ).status_code
                    == 422
                )
                patch = {**body, "display_name": "Updated", "revision": 1}
                assert (
                    client.patch("/api/v1/me/profile", headers=headers, json=patch).json()[
                        "revision"
                    ]
                    == 2
                )
                assert (
                    client.patch("/api/v1/me/profile", headers=headers, json=patch).status_code
                    == 409
                )
                assert (
                    client.get("/api/v1/me/profile", headers=headers).json()["display_name"]
                    == "Updated"
                )
        finally:
            headers_admin = {"apikey": admin_key}
            if admin_key.startswith("eyJ"):
                headers_admin["Authorization"] = "Bearer " + admin_key
            deleted = auth.delete(f"/auth/v1/admin/users/{user_id}", headers=headers_admin)
            assert deleted.status_code in (200, 204)
