import logging

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.main import create_app


class FakeDatabase:
    closed = False

    def __init__(self, settings):
        self.broken = False

    def open(self):
        pass

    def close(self):
        self.closed = True

    def check_ready(self):
        if self.broken:
            raise RuntimeError("secret-dsn-must-not-leak")


def test_live_does_not_need_database():
    with TestClient(create_app(Settings(_env_file=None))) as client:
        assert client.get("/api/v1/health/live").json() == {"status": "ok"}
        assert client.get("/api/v1/health/ready").status_code == 503


def test_readiness_recovers_and_closes_pool(caplog):
    settings = Settings(_env_file=None, database_url="postgresql://placeholder")
    with TestClient(create_app(settings, FakeDatabase)) as client:
        database = client.app.state.database
        assert client.get("/api/v1/health/ready").json() == {"status": "ready"}
        database.broken = True
        with caplog.at_level(logging.WARNING):
            response = client.get("/api/v1/health/ready")
        assert response.status_code == 503
        assert "secret-dsn" not in response.text + caplog.text
        assert client.get("/api/v1/health/live").status_code == 200
        database.broken = False
        assert client.get("/api/v1/health/ready").status_code == 200
    assert database.closed


def test_cors_is_explicit():
    with TestClient(create_app(Settings(_env_file=None))) as client:
        allowed = client.get("/api/v1/health/live", headers={"Origin": "http://127.0.0.1:3000"})
        denied = client.get("/api/v1/health/live", headers={"Origin": "https://untrusted.invalid"})
        assert allowed.headers["access-control-allow-origin"] == "http://127.0.0.1:3000"
        assert "access-control-allow-origin" not in denied.headers


@pytest.mark.parametrize("size", [0, 21])
def test_pool_size_is_bounded(size):
    with pytest.raises(ValidationError):
        Settings(_env_file=None, database_pool_size=size)


def test_secret_is_redacted():
    assert "private-password" not in repr(
        Settings(_env_file=None, database_url="postgresql://private-password")
    )
