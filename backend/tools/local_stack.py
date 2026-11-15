import json
import shutil
import subprocess
import tomllib
from pathlib import Path

from psycopg.conninfo import conninfo_to_dict

ROOT = Path(__file__).resolve().parents[2]
PROJECT_ID = "agentictutor-local"


def local_status() -> dict:
    config = tomllib.loads((ROOT / "supabase/config.toml").read_text(encoding="utf-8-sig"))
    if config.get("project_id") != PROJECT_ID:
        raise RuntimeError("Unexpected local project; refusing access")
    result = subprocess.run(
        [
            shutil.which("node") or "node",
            str(ROOT / "node_modules/supabase/dist/supabase.js"),
            "status",
            "--output",
            "json",
        ],
        check=False,
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        timeout=30,
    )
    if result.returncode:
        raise RuntimeError("Local Supabase is unavailable; run npm.cmd run db:start")
    status = json.loads(result.stdout)
    params = conninfo_to_dict(status["DB_URL"])
    if (params.get("host"), params.get("port"), params.get("dbname")) != (
        "127.0.0.1",
        "58422",
        "postgres",
    ):
        raise RuntimeError("Refusing a database outside the dedicated local stack")
    if status["API_URL"] != "http://127.0.0.1:58421":
        raise RuntimeError("Unexpected local Auth endpoint")
    return status
