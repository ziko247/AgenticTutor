from typing import Annotated, Literal
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from psycopg.rows import dict_row
from pydantic import BaseModel, ConfigDict, Field

router = APIRouter(prefix="/api/v1/me")
bearer = HTTPBearer(auto_error=False)
Language = Literal[
    "python", "c", "cpp", "csharp", "java", "html", "css", "javascript", "go", "rust"
]


class ProfileInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    display_name: str = Field(min_length=1, max_length=80, pattern=r"^\S(?:.*\S)?$")
    preferred_language: Language | None = None


class ProfilePatch(ProfileInput):
    revision: int = Field(gt=0)


def identity(
    request: Request, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]
):
    if credentials is None:
        raise HTTPException(401, "Authentication required", headers={"WWW-Authenticate": "Bearer"})
    settings = request.app.state.settings
    if not settings.supabase_url or not settings.supabase_publishable_key:
        raise HTTPException(503, "Authentication unavailable")
    try:
        response = httpx.get(
            settings.supabase_url.rstrip("/") + "/auth/v1/user",
            headers={
                "apikey": settings.supabase_publishable_key,
                "Authorization": "Bearer " + credentials.credentials,
            },
            timeout=5,
        )
        if response.status_code == 200:
            return UUID(response.json()["id"])
        if response.status_code >= 500:
            raise HTTPException(503, "Authentication unavailable")
    except (httpx.RequestError, ValueError, KeyError):
        raise HTTPException(503, "Authentication unavailable") from None
    raise HTTPException(401, "Invalid session", headers={"WWW-Authenticate": "Bearer"})


def db(request):
    if request.app.state.database is None:
        raise HTTPException(503, "Database unavailable")
    return request.app.state.database


@router.get("/profile")
def get_profile(request: Request, user_id: Annotated[UUID, Depends(identity)]):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        row = cursor.execute(
            "SELECT * FROM app_private.profiles WHERE user_id=%s", (user_id,)
        ).fetchone()
    if row is None:
        raise HTTPException(404, "Profile not found")
    return row


@router.put("/profile")
def create_profile(
    body: ProfileInput, request: Request, user_id: Annotated[UUID, Depends(identity)]
):
    from fastapi.encoders import jsonable_encoder
    from fastapi.responses import JSONResponse

    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        row = cursor.execute(
            """INSERT INTO app_private.profiles
            (user_id,display_name,preferred_language) VALUES (%s,%s,%s)
            ON CONFLICT (user_id) DO NOTHING RETURNING *""",
            (user_id, body.display_name, body.preferred_language),
        ).fetchone()
        created = row is not None
        if row is None:
            row = cursor.execute(
                "SELECT * FROM app_private.profiles WHERE user_id=%s", (user_id,)
            ).fetchone()
            if (
                row["display_name"] != body.display_name
                or row["preferred_language"] != body.preferred_language
            ):
                raise HTTPException(409, "Profile already exists")
    return JSONResponse(jsonable_encoder(row), status_code=201 if created else 200)


@router.patch("/profile")
def update_profile(
    body: ProfilePatch, request: Request, user_id: Annotated[UUID, Depends(identity)]
):
    with (
        db(request).transaction_for(user_id) as connection,
        connection.cursor(row_factory=dict_row) as cursor,
    ):
        row = cursor.execute(
            """UPDATE app_private.profiles SET display_name=%s,
            preferred_language=%s,revision=revision+1,updated_at=now()
            WHERE user_id=%s AND revision=%s RETURNING *""",
            (body.display_name, body.preferred_language, user_id, body.revision),
        ).fetchone()
        if row is None:
            raise HTTPException(409, "Profile changed; reload and retry")
    return row
