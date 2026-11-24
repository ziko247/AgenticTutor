from datetime import timedelta
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.exercises import exercises
from app.api.profile import Language, db, identity

router = APIRouter(prefix="/api/v1/me/activity")
Identity = Annotated[UUID, Depends(identity)]


@router.get("")
def activity(request: Request, user_id: Identity):
    with db(request).transaction_for(user_id) as conn:
        today = conn.execute("SELECT (now() AT TIME ZONE 'Africa/Casablanca')::date").fetchone()[0]
        rows = conn.execute(
            """SELECT day, count(*), array_agg(exercise_id ORDER BY exercise_id) FILTER (WHERE day=%s)
               FROM app_private.exercise_activity
               WHERE user_id=%s AND day BETWEEN %s AND %s GROUP BY day ORDER BY day""",
            (today, user_id, today - timedelta(days=364), today),
        ).fetchall()
    return {
        "today": today,
        "days": {str(day): count for day, count, _ in rows},
        "completed": next((ids for day, _, ids in rows if day == today), []),
    }


@router.put("/{language}/{exercise_id}")
def complete(language: Language, exercise_id: str, request: Request, user_id: Identity):
    if not any(item["id"] == exercise_id for item in exercises(language)):
        raise HTTPException(404, "Unknown exercise")
    with db(request).transaction_for(user_id) as conn:
        allowed = conn.execute(
            """SELECT 1 FROM app_private.profiles p
               JOIN app_private.diagnostic_attempts a ON a.user_id=p.user_id
               JOIN app_private.questionnaires q ON q.id=a.questionnaire_id
               WHERE p.user_id=%s AND a.is_current AND a.state='completed'
               AND coalesce(p.preferred_language,q.language_code)=%s""",
            (user_id, language),
        ).fetchone()
        if not allowed:
            raise HTTPException(409, "Complete the diagnostic for access to practice")
        conn.execute(
            """INSERT INTO app_private.exercise_activity(user_id, exercise_id)
               VALUES (%s,%s) ON CONFLICT DO NOTHING""",
            (user_id, exercise_id),
        )
    return {"ok": True}
