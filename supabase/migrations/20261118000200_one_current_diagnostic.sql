BEGIN;
SET ROLE app_owner;
-- Preserve every attempt while selecting only the newest existing attempt per student.
WITH ranked AS (
    SELECT id, row_number() OVER (PARTITION BY user_id ORDER BY created_at DESC, id DESC) AS position
    FROM app_private.diagnostic_attempts WHERE is_current
)
UPDATE app_private.diagnostic_attempts a SET is_current = false
FROM ranked r WHERE a.id = r.id AND r.position > 1;
CREATE UNIQUE INDEX diagnostic_attempts_one_current_per_user
    ON app_private.diagnostic_attempts(user_id) WHERE is_current;
RESET ROLE;
COMMIT;
