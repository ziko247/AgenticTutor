import secrets

import psycopg
from dotenv import dotenv_values
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict, make_conninfo

from app.core.config import BACKEND_DIR
from tools.local_stack import PROJECT_ID, local_status


def main() -> None:
    status = local_status()
    destination = BACKEND_DIR / ".env"
    existing = dotenv_values(destination).get("DATABASE_URL") if destination.exists() else None
    params = conninfo_to_dict(existing) if existing else {}
    if existing and (
        params.get("host"),
        params.get("port"),
        params.get("user"),
        params.get("dbname"),
    ) != (
        "127.0.0.1",
        "58422",
        "app_runtime",
        "postgres",
    ):
        raise RuntimeError("Existing backend .env targets another database; refusing to overwrite")
    if existing and not params.get("password"):
        raise RuntimeError(
            "Existing local DATABASE_URL has no password; configure it before retrying"
        )
    password = params.get("password") or secrets.token_urlsafe(32)
    with psycopg.connect(status["DB_URL"], connect_timeout=2) as connection:
        marker = connection.execute(
            "SELECT project_id FROM app_private.schema_version WHERE singleton"
        ).fetchone()
        if marker != (PROJECT_ID,):
            raise RuntimeError("Wrong database marker; refusing role configuration")
        connection.execute(
            sql.SQL("ALTER ROLE app_runtime PASSWORD {}").format(sql.Literal(password))
        )
    dsn = make_conninfo(
        host="127.0.0.1",
        port=58422,
        dbname="postgres",
        user="app_runtime",
        password=password,
    )
    # Only this tool provisions the local password; migrations never contain it.
    if not existing:
        with destination.open("a", encoding="utf-8") as output:
            output.write(f'\nDATABASE_URL="{dsn}"\n')
    print("Local runtime role configured; backend/.env is ignored by Git. No secrets printed.")


if __name__ == "__main__":
    main()
