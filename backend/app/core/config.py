from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env", extra="ignore", env_file_encoding="utf-8"
    )
    database_url: SecretStr | None = None
    database_pool_size: int = Field(default=4, ge=1, le=20)
    database_timeout: float = Field(default=2.0, gt=0, le=10)
    cors_origins: list[str] = ["http://127.0.0.1:3000"]

    supabase_url: str | None = None
    supabase_publishable_key: str | None = None
