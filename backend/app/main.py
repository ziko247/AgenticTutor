import logging
from collections.abc import Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from psycopg import Error as DatabaseError

from app.core.config import Settings
from app.core.database import Database

logger = logging.getLogger(__name__)


def create_app(
    settings: Settings | None = None,
    database_factory: Callable = Database,
) -> FastAPI:
    settings = settings or Settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        database = database_factory(settings) if settings.database_url else None
        app.state.database = database
        if database:
            database.open()
        try:
            yield
        finally:
            if database:
                database.close()

    app = FastAPI(title="AgenticTutor API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.get("/api/v1/health/live")
    def live():
        return {"status": "ok"}

    @app.get("/api/v1/health/ready")
    def ready():
        database = app.state.database
        if database:
            try:
                database.check_ready()
                return {"status": "ready"}
            except (DatabaseError, RuntimeError) as error:
                logger.warning("Database readiness failed: %s", type(error).__name__)
        return JSONResponse(
            status_code=503,
            content={
                "error": {"code": "not_ready", "message": "Service temporairement indisponible."}
            },
        )

    return app


app = create_app()
