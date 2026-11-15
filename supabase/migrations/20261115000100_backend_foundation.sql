BEGIN;
-- Local and hosted schema; runtime passwords are provisioned separately.
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_owner') THEN CREATE ROLE app_owner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime') THEN CREATE ROLE app_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS; END IF; END $$;
GRANT app_owner TO postgres;
CREATE SCHEMA app_private AUTHORIZATION app_owner;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated;
SET ROLE app_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_private REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_private REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

CREATE TABLE app_private.schema_version (
    singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
    version integer NOT NULL,
    project_id text NOT NULL
);

CREATE TABLE app_private.languages (
    code text PRIMARY KEY CHECK (code IN
        ('python','c','cpp','csharp','java','html','css','javascript','go','rust')),
    label text NOT NULL,
    enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE app_private.profiles (
    user_id uuid PRIMARY KEY,
    display_name text NOT NULL CHECK (
        display_name = btrim(display_name) AND length(display_name) BETWEEN 1 AND 80),
    preferred_language text REFERENCES app_private.languages(code),
    revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app_private.questionnaires (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code text NOT NULL REFERENCES app_private.languages(code),
    version integer NOT NULL CHECK (version > 0),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','retired')),
    content_hash text NOT NULL CHECK (length(content_hash) = 64),
    score_rule_version integer NOT NULL DEFAULT 1 CHECK (score_rule_version = 1),
    published_at timestamptz,
    UNIQUE (language_code, version),
    CHECK ((status = 'draft' AND published_at IS NULL) OR
           (status <> 'draft' AND published_at IS NOT NULL))
);
CREATE TABLE app_private.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id uuid NOT NULL REFERENCES app_private.questionnaires(id) ON DELETE RESTRICT,
    source_key text NOT NULL,
    ordinal integer NOT NULL CHECK (ordinal BETWEEN 1 AND 16),
    kind text NOT NULL CHECK (kind IN ('profile','technical')),
    prompt text NOT NULL,
    code text,
    topic text,
    UNIQUE (questionnaire_id, ordinal),
    UNIQUE (questionnaire_id, source_key),
    UNIQUE (questionnaire_id, id),
    UNIQUE (id, kind)
);
CREATE TABLE app_private.answer_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL REFERENCES app_private.questions(id) ON DELETE CASCADE,
    ordinal integer NOT NULL CHECK (ordinal >= 0),
    label text NOT NULL,
    UNIQUE (question_id, ordinal),
    UNIQUE (question_id, id)
);
CREATE TABLE app_private.answer_keys (
    question_id uuid PRIMARY KEY,
    kind text NOT NULL DEFAULT 'technical' CHECK (kind = 'technical'),
    correct_option_id uuid NOT NULL,
    points integer NOT NULL DEFAULT 2 CHECK (points = 2),
    FOREIGN KEY (question_id, kind) REFERENCES app_private.questions(id, kind) ON DELETE CASCADE,
    FOREIGN KEY (question_id, correct_option_id)
        REFERENCES app_private.answer_options(question_id, id) ON DELETE RESTRICT
);
CREATE TABLE app_private.diagnostic_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app_private.profiles(user_id) ON DELETE CASCADE,
    questionnaire_id uuid NOT NULL REFERENCES app_private.questionnaires(id) ON DELETE RESTRICT,
    state text NOT NULL DEFAULT 'in_progress' CHECK (state IN ('in_progress','completed')),
    cursor_question_id uuid,
    revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
    score integer,
    correct_count integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    client_request_id uuid NOT NULL,
    create_payload_hash text NOT NULL CHECK (length(create_payload_hash) = 64),
    supersedes_attempt_id uuid,
    UNIQUE (user_id, client_request_id),
    UNIQUE (id, questionnaire_id),
    UNIQUE (id, user_id),
    FOREIGN KEY (questionnaire_id, cursor_question_id)
        REFERENCES app_private.questions(questionnaire_id, id),
    FOREIGN KEY (supersedes_attempt_id, user_id)
        REFERENCES app_private.diagnostic_attempts(id, user_id),
    CHECK ((state = 'in_progress' AND score IS NULL AND correct_count IS NULL
            AND completed_at IS NULL) OR
           (state = 'completed' AND score IS NOT NULL AND correct_count IS NOT NULL
            AND score BETWEEN 0 AND 20 AND correct_count BETWEEN 0 AND 10
            AND score = 2 * correct_count AND completed_at IS NOT NULL))
);
CREATE INDEX attempts_resume_idx
    ON app_private.diagnostic_attempts(user_id, updated_at DESC, id);
CREATE TABLE app_private.diagnostic_answers (
    attempt_id uuid NOT NULL,
    questionnaire_id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_id uuid NOT NULL,
    answered_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (attempt_id, question_id),
    FOREIGN KEY (attempt_id, questionnaire_id)
        REFERENCES app_private.diagnostic_attempts(id, questionnaire_id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id, question_id)
        REFERENCES app_private.questions(questionnaire_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (question_id, option_id)
        REFERENCES app_private.answer_options(question_id, id) ON DELETE RESTRICT
);
CREATE TABLE app_private.diagnostic_imports (
    user_id uuid NOT NULL REFERENCES app_private.profiles(user_id) ON DELETE CASCADE,
    client_import_id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    payload_hash text NOT NULL CHECK (length(payload_hash) = 64),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, client_import_id),
    FOREIGN KEY (attempt_id, user_id)
        REFERENCES app_private.diagnostic_attempts(id, user_id) ON DELETE CASCADE
);

-- An application connection must set this within each user transaction.
CREATE FUNCTION app_private.current_user_id() RETURNS uuid
LANGUAGE sql STABLE SET search_path = '' AS
$$ SELECT nullif(current_setting('app.user_id', true), '')::uuid $$;
GRANT USAGE ON SCHEMA app_private TO app_runtime;
GRANT EXECUTE ON FUNCTION app_private.current_user_id() TO app_runtime;
GRANT SELECT ON ALL TABLES IN SCHEMA app_private TO app_runtime;
GRANT INSERT, UPDATE, DELETE ON app_private.profiles TO app_runtime;
GRANT INSERT (id,user_id,questionnaire_id,cursor_question_id,client_request_id,
              create_payload_hash,supersedes_attempt_id)
    ON app_private.diagnostic_attempts TO app_runtime;
GRANT UPDATE (cursor_question_id,revision,updated_at)
    ON app_private.diagnostic_attempts TO app_runtime;
GRANT DELETE ON app_private.diagnostic_attempts TO app_runtime;
GRANT INSERT, UPDATE, DELETE ON app_private.diagnostic_answers,
    app_private.diagnostic_imports TO app_runtime;

ALTER TABLE app_private.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.diagnostic_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.diagnostic_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.diagnostic_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON app_private.profiles TO app_runtime
    USING (user_id = app_private.current_user_id())
    WITH CHECK (user_id = app_private.current_user_id());
CREATE POLICY own_attempt ON app_private.diagnostic_attempts TO app_runtime
    USING (user_id = app_private.current_user_id())
    WITH CHECK (user_id = app_private.current_user_id());
CREATE POLICY own_answer ON app_private.diagnostic_answers TO app_runtime
    USING (EXISTS (SELECT 1 FROM app_private.diagnostic_attempts a
                   WHERE a.id = attempt_id AND a.user_id = app_private.current_user_id()))
    WITH CHECK (EXISTS (SELECT 1 FROM app_private.diagnostic_attempts a
                        WHERE a.id = attempt_id AND a.user_id = app_private.current_user_id()));
CREATE POLICY own_import ON app_private.diagnostic_imports TO app_runtime
    USING (user_id = app_private.current_user_id())
    WITH CHECK (user_id = app_private.current_user_id());

ALTER TABLE app_private.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_private.answer_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY readable_questionnaire ON app_private.questionnaires FOR SELECT TO app_runtime
    USING (status IN ('published','retired'));
CREATE POLICY readable_question ON app_private.questions FOR SELECT TO app_runtime
    USING (EXISTS (SELECT 1 FROM app_private.questionnaires q
                   WHERE q.id = questionnaire_id AND q.status IN ('published','retired')));
CREATE POLICY readable_option ON app_private.answer_options FOR SELECT TO app_runtime
    USING (EXISTS (SELECT 1 FROM app_private.questions q WHERE q.id = question_id));
CREATE POLICY readable_key ON app_private.answer_keys FOR SELECT TO app_runtime
    USING (EXISTS (SELECT 1 FROM app_private.questions q WHERE q.id = question_id));

-- Publishing is an operator action. Published question content stays frozen.
CREATE FUNCTION app_private.guard_questionnaire() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status <> 'draft' THEN RAISE EXCEPTION 'Create content as draft first'; END IF;
        RETURN NEW;
    END IF;
    IF TG_OP = 'DELETE' THEN
        IF OLD.status <> 'draft' THEN RAISE EXCEPTION 'Published content is immutable'; END IF;
        RETURN OLD;
    END IF;
    IF OLD.status = 'draft' AND NEW.status = 'retired' THEN
        RAISE EXCEPTION 'Publish content before retirement';
    END IF;
    IF OLD.status <> 'draft' AND NOT
        (OLD.status = 'published' AND NEW.status = 'retired'
         AND (to_jsonb(NEW) - 'status') = (to_jsonb(OLD) - 'status')) THEN
        RAISE EXCEPTION 'Published content is immutable';
    END IF;
    IF OLD.status = 'draft' AND NEW.status = 'published' THEN
        IF (SELECT count(*) FROM app_private.questions WHERE questionnaire_id = NEW.id) <> 16
           OR (SELECT count(*) FROM app_private.questions
               WHERE questionnaire_id = NEW.id AND kind = 'profile') <> 6
           OR (SELECT count(*) FROM app_private.answer_keys k
               JOIN app_private.questions q ON q.id = k.question_id
               WHERE q.questionnaire_id = NEW.id) <> 10
           OR EXISTS (SELECT 1 FROM app_private.questions q
                      WHERE q.questionnaire_id = NEW.id AND
                       (SELECT count(*) FROM app_private.answer_options o
                        WHERE o.question_id = q.id) < 2)
        THEN RAISE EXCEPTION 'Invalid diagnostic publication'; END IF;
    END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER protect_questionnaire BEFORE INSERT OR UPDATE OR DELETE ON app_private.questionnaires
    FOR EACH ROW EXECUTE FUNCTION app_private.guard_questionnaire();

CREATE FUNCTION app_private.guard_content() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE old_parent uuid; new_parent uuid;
BEGIN
    IF TG_TABLE_NAME = 'questions' THEN
        IF TG_OP <> 'INSERT' THEN old_parent := OLD.questionnaire_id; END IF;
        IF TG_OP <> 'DELETE' THEN new_parent := NEW.questionnaire_id; END IF;
    ELSE
        IF TG_OP <> 'INSERT' THEN
            SELECT questionnaire_id INTO old_parent FROM app_private.questions
            WHERE id = OLD.question_id;
        END IF;
        IF TG_OP <> 'DELETE' THEN
            SELECT questionnaire_id INTO new_parent FROM app_private.questions
            WHERE id = NEW.question_id;
        END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM app_private.questionnaires
               WHERE id IN (old_parent,new_parent) AND status <> 'draft') THEN
        RAISE EXCEPTION 'Published content is immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER protect_question BEFORE INSERT OR UPDATE OR DELETE ON app_private.questions
    FOR EACH ROW EXECUTE FUNCTION app_private.guard_content();
CREATE TRIGGER protect_option BEFORE INSERT OR UPDATE OR DELETE ON app_private.answer_options
    FOR EACH ROW EXECUTE FUNCTION app_private.guard_content();
CREATE TRIGGER protect_key BEFORE INSERT OR UPDATE OR DELETE ON app_private.answer_keys
    FOR EACH ROW EXECUTE FUNCTION app_private.guard_content();
CREATE FUNCTION app_private.guard_answer() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
    IF TG_OP <> 'INSERT' AND EXISTS (SELECT 1 FROM app_private.diagnostic_attempts
        WHERE id = OLD.attempt_id AND state = 'completed') THEN
        RAISE EXCEPTION 'Completed answers are immutable';
    END IF;
    IF TG_OP <> 'DELETE' AND EXISTS (SELECT 1 FROM app_private.diagnostic_attempts
        WHERE id = NEW.attempt_id AND state = 'completed') THEN
        RAISE EXCEPTION 'Completed answers are immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER protect_answer BEFORE INSERT OR UPDATE OR DELETE ON app_private.diagnostic_answers
    FOR EACH ROW EXECUTE FUNCTION app_private.guard_answer();
RESET ROLE;
-- auth is owned by Supabase, not app_owner.
ALTER TABLE app_private.profiles ADD CONSTRAINT profile_identity_fk
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

INSERT INTO app_private.schema_version VALUES (true, 1, 'agentictutor-local');
COMMIT;
