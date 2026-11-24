from collections.abc import Iterator
from contextlib import contextmanager
from uuid import UUID

from psycopg import Connection
from psycopg_pool import ConnectionPool

from app.core.config import Settings

SCHEMA_VERSION = 3


class Database:
    def __init__(self, settings: Settings):
        self.timeout = settings.database_timeout
        self.pool = ConnectionPool(
            conninfo=settings.database_url.get_secret_value(),
            min_size=0,
            max_size=settings.database_pool_size,
            timeout=self.timeout,
            open=False,
            kwargs={
                "autocommit": True,
                "connect_timeout": 2,
                "options": "-c statement_timeout=1500 -c lock_timeout=1000",
            },
        )

    def open(self) -> None:
        self.pool.open(wait=False)

    def close(self) -> None:
        self.pool.close()

    @staticmethod
    def check_role(connection: Connection) -> None:
        role = connection.execute(
            """SELECT current_user, rolsuper, rolbypassrls,
                      pg_has_role(current_user, 'app_owner', 'MEMBER')
               FROM pg_roles WHERE rolname = current_user"""
        ).fetchone()
        if role != ("app_runtime", False, False, False):
            raise RuntimeError("Unsafe application database role")

    def check_ready(self) -> None:
        with self.pool.connection(timeout=self.timeout) as connection:
            self.check_role(connection)
            marker = connection.execute(
                "SELECT version FROM app_private.schema_version WHERE singleton"
            ).fetchone()
            if marker != (SCHEMA_VERSION,):
                raise RuntimeError("Incompatible database schema")

    @contextmanager
    def transaction_for(self, user_id: UUID) -> Iterator[Connection]:
        if not isinstance(user_id, UUID):
            raise TypeError("A verified UUID identity is required")
        with self.pool.connection(timeout=self.timeout) as connection:
            self.check_role(connection)
            with connection.transaction():
                connection.execute("SELECT set_config('app.user_id', %s, true)", (str(user_id),))
                yield connection
