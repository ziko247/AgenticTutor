from types import SimpleNamespace
from unittest.mock import Mock

import httpx
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.api.profile import identity
from tools import setup_local


@pytest.mark.parametrize(("upstream", "expected"), [(401, 401), (429, 503), (500, 503)])
def test_identity_distinguishes_invalid_tokens_from_provider_errors(
    monkeypatch, upstream, expected
):
    response = Mock(status_code=upstream)
    monkeypatch.setattr(httpx, "get", lambda *args, **kwargs: response)
    request = SimpleNamespace(
        app=SimpleNamespace(
            state=SimpleNamespace(
                settings=SimpleNamespace(
                    supabase_url="http://localhost", supabase_publishable_key="public"
                )
            )
        )
    )
    with pytest.raises(HTTPException) as exc:
        identity(request, HTTPAuthorizationCredentials(scheme="Bearer", credentials="test"))
    assert exc.value.status_code == expected


def test_setup_rejects_existing_url_without_password(monkeypatch, tmp_path):
    (tmp_path / ".env").write_text(
        'DATABASE_URL="host=127.0.0.1 port=58422 user=app_runtime dbname=postgres"\n'
    )
    monkeypatch.setattr(setup_local, "BACKEND_DIR", tmp_path)
    monkeypatch.setattr(setup_local, "local_status", dict)
    with pytest.raises(RuntimeError, match="no password"):
        setup_local.main()
