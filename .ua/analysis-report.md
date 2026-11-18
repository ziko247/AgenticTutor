# AgenticTutor: requirements and documentation review

Date: 2026-11-16. Read-only source review of README.md, AGENTS.md and all 25 sections of CAHIER_DES_CHARGES_AGENTICTUTOR.md. No tests were rerun in this review. Existing test source is evidence of coverage, not a fresh passing result.

## Architecture observed

Next.js App Router renders the landing, auth forms, diagnostic and dashboard. Auth Server Actions call Supabase Auth. HttpOnly session cookies are configured in frontend/src/lib/supabase/server.ts:15; frontend/src/proxy.ts:27 refreshes identity and disables shared caching. The dashboard checks getUser() before profile loading (frontend/src/app/dashboard/page.tsx:16). Next.js sends the session bearer to FastAPI. FastAPI validates it against the configured Auth /user endpoint (backend/app/api/profile.py:27), then performs parameterized profile SQL in a transaction with the verified UUID. RLS is defined in supabase/migrations/20261115000100_backend_foundation.sql:148. The diagnostic remains a separate browser-local flow.

## Concrete documentation drift

1. README.md:8 leaves account creation/sign-in/sign-out unchecked, while README.md:95 marks the same feature implemented. Auth actions exist at frontend/src/features/auth/actions.ts:8 and protection/profile bootstrap at frontend/src/app/dashboard/page.tsx:16. Reconcile the two trackers; keep the separate student/manager permission requirement open.
2. AGENTS.md:28 says the backend provides only foundations and health probes, then immediately acknowledges Auth/profile. Actual GET/PUT/PATCH profile endpoints are at backend/app/api/profile.py:59, :73 and :103.
3. AGENTS.md:54 still proposes a future browser-to-Auth exception from decision 0002. The current architecture uses server-side Next.js Auth with HttpOnly cookies; decision 0003 explicitly supersedes that proposal. AGENTS.md:104 describes the current design correctly.
4. CAHIER_DES_CHARGES_AGENTICTUTOR.md:14 says no development has begun. This is accurate only as the dated initial proposal (version 1.0, 9 November at :8). Mark it as a historical specification or add a dated status reference; do not present it as current project progress.
5. The initial cahier specifies a 10–15-question diagnostic (:97), per-notion estimates (:134, :194), and an account-first first-use path (:157). Current onboarding has six profile questions plus ten scored questions, a single score /20, and no account requirement. See frontend/src/features/diagnostic/onboarding.tsx:38, :77 and :171. This is a deliberate interim implementation, but the difference needs an explicit decision/acceptance before milestone 3.
6. README.md:154 calls its tree existing but omits supabase/, root package tooling, backend tools and dependency files; README.md:232 lists deploy/README.md, which is absent. AGENTS.md:92 correctly identifies the real migration source under supabase/migrations/. The tree should distinguish reserved folders from implemented components.
7. AGENTS.md:92 says transaction_for requires a future verified identity even though profile.py:27 now supplies one. AGENTS.md:100 retains a future Auth-connection instruction inside a historical prototype paragraph. These should remain clearly historical or be removed from current guidance.
8. AGENTS.md:51 prescribes routes -> services -> repositories, while profile.py:65 directly issues SQL. This is an architecture convention not yet implemented, rather than a runtime failure.

## Requirement coverage

| Requirements | State in current source | Evidence / remaining work |
|---|---|---|
| F01 accounts | Implemented local Auth and owner isolation; manager permissions not implemented | actions.ts:8, profile.py:27, migration :148; no manager route/role model observed |
| F02 introduction and entry | Implemented landing and local diagnostic entry; full learning-path resume planned | README.md:94, onboarding.tsx:38 |
| F03 diagnostic | Partial | 10 language banks, local answers and aggregate /20; no server attempt API, per-notion estimate or validated diagnostic |
| F04 mastery profile | Planned | Current persisted profile is display_name/preferred_language/revision, not mastery observations; profile.py:17 |
| F05–F07 grounded explanations, adaptation, next activity | Planned | backend/app/rag/, pedagogy/, orchestration/ and llm/ contain .gitkeep only |
| F08–F10 exercises, hints and correction | Partial demonstration only | Landing examples and diagnostic multiple-choice scoring exist; 50 validated adaptive exercises and rubric-based correction do not |
| F11 mastery updates | Planned | No mastery tables or pedagogical update logic |
| F12 session continuity | Partial | Local diagnostic draft resume exists; learning session/attempt persistence across accounts/devices is absent |
| F13 progression | Planned | Dashboard explicitly says future activities/progression, frontend/src/app/dashboard/page.tsx:87 |
| F14 content administration | Partial database foundation | Immutable published questionnaire/version constraints exist; no manager publication UI/API or authorized corpus workflow |
| F15 pedagogical decision tracing | Planned | No orchestration or decision journal implementation |
| F16 reporting | Planned | No reporting endpoint/UI/table observed |
| F17 data consultation/deletion | Partial | Own basic profile is readable/editable; no account export/deletion flow; SQL cascades alone do not satisfy user-facing deletion requirements |
| F18–F20 variants, spaced revision, group view | Planned extensions | No implementation observed |

## Verified in source, not freshly executed

- Auth registration, password login, local-scope sign-out, recovery request and password update are implemented (frontend/src/features/auth/actions.ts).
- Real Auth/profile integration test checks missing/forged bearer, profile creation, replay/conflict and revision conflict (backend/tests/integration/test_profile_api.py).
- Browser tests contain registration, profile edit/reload, HttpOnly-cookie checks, logout/protected-route behavior and mailbox-based recovery (frontend/tests/flows.spec.ts:20).
- RLS and real-role database tests exist; the schemas alone do not mean diagnostic persistence is connected.
- Supabase email confirmation is disabled in the committed local configuration (supabase/config.toml:229).

## Unverified or future acceptance

The historical 19-backend/12-browser pass reports were not rerun here. Mandatory email confirmation, expiry-driven refresh, second-machine setup, hosted SMTP/deployment, restoration procedure, pedagogical validity and learning gains remain unverified. The nonfunctional targets (cahier :342–353) and evaluation thresholds (:412–420) are proposals, not measured results. Evaluation dataset directories and content/exercises currently contain placeholders.

## Recommended next step

Before milestone 3, reconcile the trackers and record the intended diagnostic contract: guest versus account entry, 16-question composition, per-notion estimates versus aggregate score, and post-result editing semantics. Then connect versioned server questionnaires/attempts and deterministic scoring while preserving browser drafts that cannot safely be imported.

## Graph delivery

128 source/document/configuration files mapped into 212 nodes, 356 edges, eight layers and an eight-step guided tour. Deterministic reference, file-coverage, layer and tour checks passed; fingerprint baseline covers all 128 files. Detailed lessons and fresh delegated assembly review were interrupted by agent usage limits and are not claimed complete. No new runtime tests were run.
