# AgenticTutor — Guide pour les agents de développement

## Lire avant de modifier

1. `README.md` : état réel, fonctionnalités prévues et progression.
2. `CAHIER_DES_CHARGES_AGENTICTUTOR.md` : exigences F01–F20, priorités et recette.
3. `docs/architecture/README.md` : frontières entre composants et flux.
4. Le README du composant concerné, puis les décisions dans `docs/decisions/`.

## État du projet

Le frontend utilise désormais Next.js App Router, TypeScript et Tailwind CSS. Lire frontend/README.md pour les commandes, routes et frontières. Landing, Auth et profil connectés, dashboard protégé et diagnostic local sont implémentés. Le jalon 1 backend est implémenté (FastAPI live/ready, Supabase local, migration et tests RLS). Comptes et profil connectés en local au jalon 2 ; tutorat IA encore à développer. La direction backend retenue est FastAPI + Supabase PostgreSQL et Supabase CLI/Docker en local. La conception figure dans docs/architecture/README.md et docs/decisions/0002-backend-fastapi-supabase.md ; Auth côté serveur Next.js est retenu et implémenté dans la décision 0003.


Le diagnostic propose désormais 10 langages/technologies, avec choix initial unique et note sur 20. Les brouillons v2 sont séparés des anciens v1. Le tuteur connecté reste à développer.

La landing décrit désormais le produit cible au présent à la demande explicite du porteur. Conserver ce positionnement éditorial, mais ne pas cocher les fonctions métier ni annoncer des routes métier opérationnelles dans les formulaires. Le diagnostic est multilangage et local.

## Reprise de la tranche actuelle

- Première priorité convenue : landing, authentification et onboarding pour apprendre Python.
- La landing enrichie utilise `frontend/src/app/page.tsx` et les styles en fin de `frontend/src/styles/globals.css` : surfaces menthe/vert/citron, cinq notions, exemple de boucle, profils et FAQ.
- La démo de boucle interactive est prédéfinie dans `frontend/src/features/tutor/lesson-preview.tsx` ; elle ne représente pas un tuteur IA connecté.
- `/sign-in` et `/sign-up` utilisent `frontend/src/features/auth/auth-form.tsx`. Validation puis Server Actions Supabase Auth, cookies HttpOnly ; /dashboard exige une session validée.
- `/dashboard` : page serveur dans frontend/src/app/dashboard/page.tsx, styles dans frontend/src/styles/dashboard.css. Dashboard protégé avec profil privé ; maintenir la présentation simple et les emplacements des futures activités. Garder ce périmètre simple jusqu’à validation de l’encadrant ; ne pas simuler de session, de compte créé ou de progression.
- `/onboarding` utilise les fichiers `questions.ts`, `storage.ts` et `onboarding.tsx` dans `frontend/src/features/diagnostic/`. Les réponses et l'avancement restent dans localStorage sous `agentictutor.onboarding.v2` ; la note sur 20 est indicative et non certifiante.
- Les captures et sept tests Playwright ont servi à vérifier la tranche précédente ; relancer les contrôles adaptés après toute modification. Consulter `frontend/README.md` pour les commandes et `CHROME_PATH`.
- Le backend fournit uniquement le socle local et les probes de santé. Auth, récupération et profil sont implémentés au jalon 2. Diagnostic persistant, IA, exercices adaptatifs et métriques pédagogiques restent à développer.
- Préserver le bloc Next.js généré dans `frontend/AGENTS.md` et lire la documentation locale de Next avant de modifier le frontend.
- Les changements frontend peuvent être non commités : inspecter `git status` avant toute opération Git et préserver le travail existant.

## Où travailler

- `frontend/` : interface, composants, parcours et client HTTP.
- `backend/app/` : API, métier pédagogique, orchestration, intégrations et persistance.
- `content/` : ressources pédagogiques autorisées, exercices, programmes et futurs schémas de validation.
- `evaluation/` : jeux figés et outils d'évaluation scientifique/pédagogique.
- `data/` : documentation des données locales ; données privées et brutes ignorées.
- `docs/` : architecture, décisions, maquettes, guides et rapport.
- `scripts/` : automatisation de développement et préparation des contenus.
- `deploy/` : future configuration d'hébergement.
- Tests techniques : `backend/tests/`, `frontend/tests/` et `tests/e2e/`.

## Conventions et frontières

- Documentation et interface en français ; noms de fichiers et identifiants de code en anglais.
- Garder les noms Fxx dans les tâches et les changements pour retrouver les exigences.
- Les règles de maîtrise et de sélection vivent dans `backend/app/pedagogy/`, indépendamment du fournisseur de LLM.
- L'orchestrateur coordonne des services et des outils autorisés ; il ne décide pas des permissions.
- Les contrôles d'accès et la validation des entrées restent côté serveur.
- Les routes API délèguent aux services ; la persistance passe par les repositories.
- Les sorties du LLM sont non fiables jusqu'à validation. Prévoir l'abstention et les erreurs.
- Les prompts sont versionnés dans `backend/app/prompts/`, sans secrets ni données privées.
- Le frontend utilisera FastAPI pour le métier ; il n’accède directement ni aux tables ni aux fournisseurs d’IA. Une exception limitée à Supabase Auth est proposée dans la décision 0002, à confirmer avant le branchement des comptes.
- Séparer contenus d'apprentissage, fixtures de tests et lots finaux d'évaluation.
- Ne pas ajouter d'agents autonomes distincts pour chaque module sans besoin démontré.

## Pendant l’implémentation

- Réaliser une petite tranche fonctionnelle liée à un critère de recette.
- Documenter les décisions retenues et les commandes réellement exécutables.
- À chaque évolution du projet, vérifier si les instructions de lancement du README racine ou des guides concernés doivent changer ; les maintenir exactes et à jour, y compris prérequis, services, variables, ports et commandes.
- Choisir et verrouiller les versions des dépendances lors de l'initialisation du composant.
- Ajouter les tests utiles au comportement, à la sécurité et à l'intégration modifiés.
- Consulter frontend/README.md et package.json pour les runners configurés.
- Signaler clairement ce qui n'a pas été exécuté ou mesuré.
- Mettre à jour les chemins, README et checklists après les changements.
- Cocher une fonctionnalité seulement après implémentation et vérification ; un dossier vide ne satisfait pas une exigence.
- Conserver les originaux et les modifications utilisateur existantes.

## Données et secrets

Ne jamais committer de clés, fichiers `.env` réels, conversations d'étudiants, exports personnels ou documents non autorisés. Les exemples doivent être synthétiques. Utiliser `data/raw/` et `data/private/` localement selon `data/README.md`. Les index et résultats générés ne sont pas des sources de référence.

## Prochain travail proposé

Le domaine pilote est Python et la première stack frontend est actée dans docs/decisions/0001-first-frontend.md. La prochaine tranche est le diagnostic persistant (jalon 3). Les tâches restent non réalisées dans le README tant qu'elles ne sont pas vérifiées.

## Exemples multilangages de la landing

Les exemples et sélecteurs sont dans frontend/src/features/tutor/{examples,language-select,lesson-preview,worked-example}. La page importe deux composants clients ; les sélections sont indépendantes et réinitialisent les indices du hero. Contenus statiques, pas de runtime multilangage ni de backend ajouté.

## Diagnostic multilangage actuel

Le parcours commence par un choix unique parmi 10 langages et technologies. Il contient ensuite 6 questions de profil non notées et 10 questions techniques spécifiques : chaque bonne réponse vaut 2 points, soit une note sur 20. Les banques restent à valider pédagogiquement. Navigation, revue et reprise locale sont conservées. Le format v2 est enregistré sous agentictutor.onboarding.v2 ; les anciens brouillons v1 restent intacts mais ne sont pas repris dans les nouveaux tests. Changer de langage demande confirmation et réinitialise le diagnostic courant. Aucun backend n’est branché à ce parcours, ni authentification réelle. Les commandes frontend sont inchangées.

## Simplification interne du frontend

Les identifiants, libellés et l’ordre des langages sont centralisés dans frontend/src/lib/languages.ts. Le diagnostic est uniquement à choix unique ; ses banques utilisent des tuples de quatre chaînes et une couverture typée de tous les langages. Questions, ordre des options, score et format de brouillon v2 sont inchangés. Le favicon est passé de 83 540 à 80 524 octets ; comparaison des pixels identique à 16, 32, 64, 128 et 2048 pixels. Les commandes de lancement sont inchangées.
## Fondation backend : jalon 1 livré

Lire docs/architecture/backend-foundation.md, backend-data-model.md, backend-api-contract.md et backend-roadmap.md dans le même dossier. Le contrat actuel reste 6 profils + 10 techniques, note sur 20. Le format local v2 ne versionne pas les questions : ne pas importer des indices sans preuve de correspondance. Historique SQL unique sous supabase/migrations/, configuration dans supabase/config.toml, instantané des dix banques dans supabase/seed.sql. API dans backend/app/main.py ; accès Psycopg et configuration dans app/core/. Rôle app_owner sans LOGIN, runtime limité app_runtime, schéma app_private non exposé à la Data API. transaction_for(UUID) exige une future identité vérifiée, jamais un user_id libre fourni par HTTP. Le runtime ordinaire ne peut pas écrire les résultats ; prévoir le chemin de complétion dédié au jalon 3.

Lire backend/README.md pour npm.cmd ci/db:start à la racine, uv sync --frozen et tools.setup_local depuis backend/, puis uvicorn. La CLI 3.1.0 et les dépendances Python sont verrouillées. Sur ce Windows, le Python du venv est bloqué par Application Control ; le guide donne la commande vérifiée avec le Python de base et PYTHONPATH, sans modification de sécurité.

Vérifications du 15 novembre 2026 : 18 tests passent (dont intégration réelle), Ruff lint/format, reset local et seed propres, live/ready via HTTP. Tests DB opt-in avec pytest --run-integration : cible locale dédiée uniquement, identités synthétiques supprimées, pas d’exécution parallèle sur une base partagée. Aucun secret à afficher ; backend/.env et l’état CLI restent ignorés. Préserver le frontend. Prochaine tranche : diagnostic persistant ; compte-first/diagnostic-first et édition après résultat restent ouverts. Auth et profil implémentés au jalon 2 ; aucun tuteur IA connecté.

## Tableau de bord provisoire : validation du 15 novembre 2026

État historique du prototype, remplacé par le jalon 2 ci-dessous. Lint, typecheck, build et 12 tests navigateur passent, incluant dashboard responsive et clavier. Hallmark rendu : 0 FAIL/REFLEX/WARN, captures desktop/mobile inspectées ; prototype simple, sans nouvelle dépendance. Le prochain branchement Auth devra protéger les vraies données et remplacer la navigation d’aperçu par une transition après inscription/session confirmée.

## Jalon 2 : comptes et profil connectés

L’inscription et la connexion utilisent maintenant Supabase Auth via des Server Actions Next.js et des cookies HttpOnly. /dashboard est protégé ; le profil est enregistré par FastAPI, éditable et isolé par RLS. Déconnexion et récupération de mot de passe sont connectées. Cette tranche remplace les aperçus d’authentification décrits dans les sections historiques. Le diagnostic reste local jusqu’au jalon 3.

Lire docs/guides/milestone-2-auth.md pour les commandes. Après démarrage de Supabase, exécuter python -m tools.configure_auth depuis backend/ avec son environnement, puis redémarrer FastAPI et Next.js. Les instructions Windows utilisant le Python de base restent valables. Décision : docs/decisions/0003-server-auth-sessions.md.
