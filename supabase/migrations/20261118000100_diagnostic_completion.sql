BEGIN;
SET ROLE app_owner;
ALTER TABLE app_private.diagnostic_attempts ADD COLUMN review boolean NOT NULL DEFAULT false;
ALTER TABLE app_private.diagnostic_attempts ADD COLUMN is_current boolean NOT NULL DEFAULT true;
GRANT UPDATE (review, is_current) ON app_private.diagnostic_attempts TO app_runtime;

-- Only this function can set a score. Identity comes from the transaction context.
CREATE FUNCTION app_private.complete_diagnostic(target uuid, expected_revision integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE selected app_private.diagnostic_attempts%ROWTYPE; correct integer;
BEGIN
    SELECT * INTO selected FROM app_private.diagnostic_attempts
    WHERE id = target AND user_id = app_private.current_user_id() FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
    IF selected.state = 'completed' THEN RETURN; END IF;
    IF selected.revision <> expected_revision THEN RAISE EXCEPTION 'Stale revision'; END IF;
    IF (SELECT count(*) FROM app_private.diagnostic_answers WHERE attempt_id = target) <> 16 THEN
        RAISE EXCEPTION 'Incomplete attempt';
    END IF;
    SELECT count(*) INTO correct FROM app_private.diagnostic_answers a
    JOIN app_private.answer_keys k ON k.question_id = a.question_id
    WHERE a.attempt_id = target AND a.option_id = k.correct_option_id;
    UPDATE app_private.diagnostic_attempts SET state='completed', correct_count=correct,
        score=correct*2, completed_at=now(), updated_at=now(), revision=revision+1, review=false
    WHERE id=target;
END $$;
REVOKE ALL ON FUNCTION app_private.complete_diagnostic(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.complete_diagnostic(uuid, integer) TO app_runtime;
RESET ROLE;
COMMIT;
