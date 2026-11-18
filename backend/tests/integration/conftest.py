from uuid import UUID, uuid4

import httpx
import psycopg
import pytest

from app.core.config import Settings
from app.core.database import Database
from tools.local_stack import PROJECT_ID, local_status


@pytest.fixture(scope="session")
def stack():
    # Not a mock or a production fallback: only the CLI's isolated local stack.
    return local_status()


@pytest.fixture(scope="session")
def admin(stack):
    with psycopg.connect(stack["DB_URL"], autocommit=True, connect_timeout=2) as connection:
        assert connection.execute(
            "SELECT project_id FROM app_private.schema_version WHERE singleton"
        ).fetchone() == (PROJECT_ID,)
        yield connection


@pytest.fixture(scope="session")
def database():
    settings = Settings(database_pool_size=1)
    assert settings.database_url, "Run uv run python -m tools.setup_local first"
    database = Database(settings)
    database.open()
    database.check_ready()
    yield database
    database.close()


@pytest.fixture(scope="session")
def students(stack, admin):
    key = stack.get("SERVICE_ROLE_KEY") or stack.get("SECRET_KEY")
    assert key, "Local Auth admin key unavailable"
    headers = {"apikey": key}
    if key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {key}"
    created = []
    with httpx.Client(base_url=stack["API_URL"], headers=headers, timeout=10) as client:
        try:
            for _ in range(2):
                response = client.post(
                    "/auth/v1/admin/users",
                    json={
                        "email": f"test-{uuid4()}@example.invalid",
                        "password": str(uuid4()) + "Test9!",
                        "email_confirm": True,
                    },
                )
                assert response.status_code in (200, 201), "Local Auth fixture creation failed"
                user_id = UUID(response.json()["id"])
                created.append(user_id)
                admin.execute(
                    "INSERT INTO app_private.profiles(user_id,display_name) VALUES (%s,%s)",
                    (user_id, "Test student"),
                )
            yield created
        finally:
            for user_id in reversed(created):
                response = client.delete(f"/auth/v1/admin/users/{user_id}")
                assert response.status_code in (200, 204), "Local Auth cleanup failed"
