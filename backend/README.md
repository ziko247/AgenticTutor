# Backend — FastAPI et Supabase local

**Jalon 1 implémenté et vérifié le 15 novembre 2026.** FastAPI fournit les probes de santé ; PostgreSQL local contient le schéma privé, les rôles limités et un instantané versionné des diagnostics. L'authentification de l'application, les routes de profil/diagnostic et le tuteur IA restent à développer. Le frontend fonctionne toujours sans ce backend.

## Prérequis

- Node.js 20.9+ et npm ; la CLI Supabase 3.1.0 est verrouillée dans le package racine.
- Docker Desktop installé, avec son moteur démarré.
- Python 3.12 et [uv](https://docs.astral.sh/uv/getting-started/installation/). Les dépendances Python sont verrouillées dans `uv.lock`.

Aucun compte Supabase hébergé ni clé IA n'est nécessaire. La première exécution télécharge les images Docker et les dépendances.

## Premier lancement

Depuis la **racine du dépôt**, dans PowerShell :

~~~powershell
npm.cmd ci
docker desktop start
npm.cmd run db:start
cd backend
uv sync --frozen --python 3.12
uv run python -m tools.setup_local
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

Si Docker tourne déjà, sa commande de démarrage est inutile. Sur les autres shells, `npm` remplace `npm.cmd`. FastAPI tourne sur l'hôte ; la CLI orchestre les conteneurs Supabase sans deuxième fichier Compose.

Le premier `db:start` applique les migrations et le seed sur la base neuve. `tools.setup_local` vérifie la cible locale, crée un mot de passe aléatoire pour `app_runtime` et écrit `backend/.env`, ignoré par Git. Ne pas copier le mot de passe de remplacement de `.env.example` : ce fichier documente les variables. Une configuration existante visant une autre base est refusée. Ne jamais placer la connexion administrateur dans le serveur HTTP.

Pour les lancements suivants : `npm.cmd run db:start` à la racine, puis les deux commandes `uv run` depuis `backend/`. Le script de configuration conserve le mot de passe existant et le réapplique après une reconstruction de la base.

### Cas vérifié sur ce poste Windows : Python du venv bloqué

Application Control bloque ici `.venv/Scripts/python.exe`. Les tests et le serveur ont été exécutés avec le Python installé et les dépendances isolées du projet, sans changer les règles Windows. Après installation des dépendances, depuis `backend/` :

~~~powershell
$backendPython = uv python find --system 3.12
$env:PYTHONPATH = (Join-Path (Get-Location).Path '.venv\Lib\site-packages') + ';' + (Get-Location).Path
& $backendPython -m tools.setup_local
& $backendPython -m uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

Dans ce même terminal, remplacer ensuite `uv run pytest` par `& $backendPython -m pytest`, et `uv run ruff` par `& $backendPython -m ruff`. Si la politique bloque aussi l'installation ou le Python de base, faire résoudre ce blocage par l'administrateur ; ne pas désactiver les protections.

## Adresses et probes

| Service | Adresse |
|---|---|
| API FastAPI | http://127.0.0.1:8000 |
| OpenAPI interactif | http://127.0.0.1:8000/docs |
| Supabase API/Auth local | http://127.0.0.1:58421 |
| PostgreSQL local | 127.0.0.1:58422 |
| Studio local | http://127.0.0.1:58423 |
| Boîte de mails locale | http://127.0.0.1:58424 |

~~~powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health/live
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health/ready
~~~

- `live` : HTTP 200, `{"status":"ok"}`, sans accès réseau.
- `ready` : HTTP 200, `{"status":"ready"}`, après vérification de la connexion, du rôle limité et de la version du schéma.
- Sans configuration DB, en cas de panne ou de rôle/schéma incompatible : `ready` renvoie HTTP 503 avec un message générique ; `live` reste disponible.

Les probes sont les seules routes applicatives implémentées. Le serveur ne vérifie pas encore de jeton Auth.

## Configuration

Le serveur lit `backend/.env` et les variables du processus ; ces dernières ont priorité.

| Variable | Valeur par défaut / usage |
|---|---|
| DATABASE_URL | Absente : live disponible, ready à 503 ; connexion de app_runtime uniquement |
| DATABASE_POOL_SIZE | 4, entre 1 et 20, par processus |
| DATABASE_TIMEOUT | 2 secondes pour acquérir une connexion |
| CORS_ORIGINS | `["http://127.0.0.1:3000"]` ; pas de wildcard ni cookies |

Les requêtes SQL ont un délai de 1,5 seconde et les verrous de 1 seconde. Le pool utilise des transactions explicites ; `transaction_for(UUID)` initialise `app.user_id` pour la transaction seulement. **L'appelant futur devra fournir le UUID d'une identité vérifiée côté serveur**, jamais un identifiant envoyé librement par le navigateur. RLS ne remplace pas cette authentification.

## Migrations et données locales

Source unique : `../supabase/migrations/`. Aucun historique Alembic ni création automatique de tables au démarrage. Le rôle sans connexion `app_owner` possède les objets ; la CLI applique le DDL avec l'administrateur local. `app_runtime` ne possède pas les tables et n'a ni privilège superutilisateur ni bypass RLS.

Le schéma `app_private` n'est pas exposé à la Data API. Il contient langues, profils, questionnaires, questions/options/corrections, tentatives, réponses et suivi d'import. Les profils, tentatives et imports sont isolés par utilisateur ; les réponses héritent du propriétaire de la tentative. Les scores ne sont pas modifiables par les écritures ordinaires du runtime. Le futur calcul de résultat devra recevoir un chemin d'écriture dédié et testé au jalon 3.

`../supabase/seed.sql` fige la version 1 des dix banques existantes : 160 questions, dont 100 techniques et 100 clés de correction. Texte, options et règles viennent du frontend au 15 novembre 2026 ; aucune validation pédagogique supplémentaire n'est revendiquée. Les versions publiées sont immuables : créer une nouvelle version pour changer le contenu. Les brouillons localStorage v2 ne sont pas importés.

Pour **effacer et reconstruire uniquement la base locale**, vérifier la cible `agentictutor-local` et l'absence de données à conserver, arrêter FastAPI, puis depuis la racine :

~~~powershell
npm.cmd run db:reset
cd backend
uv run python -m tools.setup_local
~~~

Le reset détruit les données locales. Ne pas utiliser de cible distante/partagée. Pour arrêter les services en conservant leurs volumes : `npm.cmd run db:stop` depuis la racine. Arrêter FastAPI avec `Ctrl+C`.

## Vérifications

Depuis `backend/` après configuration :

~~~powershell
uv run ruff check app tools tests
uv run ruff format --check app tools tests
uv run pytest -q
uv run pytest --run-integration -q
~~~

Par défaut, seuls les tests unitaires tournent ; les tests d'intégration sont explicitement ignorés. Le dernier appel exige la pile locale dédiée et crée deux identités synthétiques via Auth, puis les supprime. Il teste avec le vrai rôle runtime : isolation A/B, contexte absent et réutilisation du pool après commit/rollback, droits SQL, clés étrangères, publication, réponses terminées et nettoyage en cascade. Ne pas lancer cette suite en parallèle sur une base partagée : un test modifie temporairement le marqueur de version avant de le restaurer.

Résultats sur ce poste : **18 tests réussis**, lint et format réussis, reconstruction propre puis seed réussis, probes HTTP live/ready vérifiées. Un avertissement de dépréciation upstream signale l'utilisation de httpx par TestClient ; il ne fait pas échouer les tests. Le démarrage sur un second ordinateur n'est pas encore vérifié.

## Fichiers et suite

| Emplacement | Rôle actuel |
|---|---|
| app/main.py | Fabrique FastAPI, durée de vie du pool, CORS et probes |
| app/core/config.py | Configuration typée |
| app/core/database.py | Pool Psycopg synchrone, contrôle du rôle et transactions utilisateur |
| tools/ | Configuration locale et garde de cible des tests |
| tests/unit/ et tests/integration/ | Tests isolés et accès réel à Supabase |
| ../supabase/ | Configuration CLI, migrations SQL et seed |
| app/api/, models/, schemas/, repositories/, services/ | Dossiers réservés aux prochaines routes métier |
| app/pedagogy/, orchestration/, rag/, llm/, prompts/ | Dossiers réservés au futur tutorat |
| migrations/ | Réservé ; ne pas y créer un second historique SQL |

Les handlers HTTP sont synchrones pour l'accès SQL bloquant. Psycopg suffit pour cette tranche ; aucun ORM n'est ajouté. Lire le [plan](../docs/architecture/backend-roadmap.md), le [contrat cible](../docs/architecture/backend-api-contract.md) et la [décision 0002](../docs/decisions/0002-backend-fastapi-supabase.md). Prochaine tranche : authentification et profil, après clarification de la frontière navigateur/Auth.
