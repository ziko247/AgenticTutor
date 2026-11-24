BEGIN;
SET LOCAL ROLE app_owner;
CREATE TABLE app_private.exercise_activity (
    user_id uuid NOT NULL REFERENCES app_private.profiles(user_id) ON DELETE CASCADE,
    day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Africa/Casablanca')::date),
    exercise_id text NOT NULL,
    PRIMARY KEY (user_id, day, exercise_id)
);
ALTER TABLE app_private.exercise_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_activity ON app_private.exercise_activity TO app_runtime
    USING (user_id = app_private.current_user_id())
    WITH CHECK (user_id = app_private.current_user_id());
GRANT SELECT, INSERT (user_id, exercise_id) ON app_private.exercise_activity TO app_runtime;
RESET ROLE;
UPDATE app_private.schema_version SET version=3 WHERE singleton;
COMMIT;
