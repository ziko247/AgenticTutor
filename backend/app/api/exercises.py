import json
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter

from app.api.profile import Language

router = APIRouter(prefix="/api/v1/exercises")
BANKS = Path(__file__).resolve().parents[3] / "content" / "exercises"


@router.get("/{language}")
@lru_cache(maxsize=10)
def exercises(language: Language):
    return json.loads((BANKS / f"{language}.json").read_text(encoding="utf-8"))
