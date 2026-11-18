"""Configure only the dedicated local stack. Never print keys."""

import secrets

from dotenv import dotenv_values

from app.core.config import BACKEND_DIR
from tools.local_stack import ROOT, local_status


def main():
    status = local_status()
    key = status.get("PUBLISHABLE_KEY") or status.get("ANON_KEY")
    if not key:
        raise RuntimeError("Local publishable key unavailable")
    configs = {
        BACKEND_DIR / ".env": {"SUPABASE_URL": status["API_URL"], "SUPABASE_PUBLISHABLE_KEY": key},
        ROOT / "frontend/.env.local": {
            "SUPABASE_URL": status["API_URL"],
            "SUPABASE_PUBLISHABLE_KEY": key,
            "API_BASE_URL": "http://127.0.0.1:8000",
            "AUTH_RECOVERY_SECRET": secrets.token_urlsafe(32),
            "APP_ORIGIN": "http://127.0.0.1:3000",
        },
    }
    for path, values in configs.items():
        existing = dotenv_values(path)
        if existing.get("SUPABASE_URL") not in (None, status["API_URL"]):
            raise RuntimeError("Refusing to replace another Auth environment")
        with path.open("a", encoding="utf-8") as output:
            for name, value in values.items():
                if name not in existing:
                    output.write(f'\n{name}="{value}"\n')
    print("Local auth configured; environment files ignored, no keys printed.")


if __name__ == "__main__":
    main()
