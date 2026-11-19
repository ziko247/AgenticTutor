# AgenticTutor

AgenticTutor est un projet de fin d’année. Le tuteur prévu adaptera ses explications et ses exercices aux acquis de l’étudiant, avec Python comme premier domaine. Aujourd’hui, on peut créer un compte, gérer son profil et passer un diagnostic. Les exemples de la page d’accueil sont prédéfinis.

## 1. Installer les prérequis sur Windows

1. Installez [Git](https://git-scm.com/download/win), [Node.js](https://nodejs.org/en/download) (20.9 ou plus récent, avec npm), [uv](https://docs.astral.sh/uv/getting-started/installation/) et [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).
2. Ouvrez Docker Desktop et attendez que le moteur soit démarré.
3. Ouvrez une nouvelle fenêtre PowerShell. Vérifiez les installations et laissez uv installer Python 3.12 si nécessaire.

~~~powershell
git --version
node --version
npm.cmd --version
uv --version
docker info --format '{{.ServerVersion}}'
uv python install 3.12
~~~

Utilisez `npm.cmd` dans PowerShell pour éviter le blocage de `npm.ps1` par la politique d’exécution de Windows. Les commandes du projet utilisent la version de Supabase CLI verrouillée dans le dépôt.

## 2. Premier lancement

### Terminal 1 · Supabase

Dans PowerShell, placez-vous dans le dossier où vous voulez ranger le projet. Si le dépôt est déjà sur votre ordinateur, ouvrez directement son dossier racine, celui qui contient ce README, `backend/` et `frontend/`. Sinon, récupérez-le avec ces commandes.

~~~powershell
git clone https://github.com/ziko247/AgenticTutor.git
cd AgenticTutor
~~~

Pour activer la connexion Google en local sur un nouveau poste, créez `supabase/.env.local` et ajoutez les deux variables ci-dessous avec les identifiants de votre client OAuth Google. Ce fichier est ignoré par Git. Configurez aussi le client Google avec `http://127.0.0.1:58421/auth/v1/callback` comme URI de redirection. Ne partagez pas le secret.

~~~text
GOOGLE_OAUTH_CLIENT_ID=votre-client-id
GOOGLE_OAUTH_CLIENT_SECRET=votre-secret
~~~

Depuis la racine, installez les outils du dépôt, démarrez Supabase et appliquez les migrations locales. Attendez la fin de chaque commande avant de passer à la suivante. Le premier démarrage télécharge les images Docker.

~~~powershell
npm.cmd ci
npm.cmd run db:start
npx.cmd --no-install supabase migration up --local
~~~

### Terminal 2 · FastAPI

Ouvrez un deuxième terminal PowerShell à la racine du dépôt. Les commandes installent les dépendances Python, configurent l’accès à la base et l’authentification, puis démarrent l’API.

~~~powershell
cd backend
uv sync --frozen --python 3.12
uv run python -m tools.setup_local
uv run python -m tools.configure_auth
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

`setup_local` et `configure_auth` préparent les fichiers locaux `backend/.env` et `frontend/.env.local`, dont la clé de récupération. Ces fichiers sont ignorés par Git. Si Windows bloque le Python de l’environnement virtuel, suivez les [commandes avec le Python de base](docs/guides/milestone-2-auth.md#démarrer-sur-un-nouveau-poste).

Laissez ce terminal ouvert. Ouvrez [la vérification de disponibilité](http://127.0.0.1:8000/api/v1/health/ready) dans le navigateur. Elle doit afficher `{"status":"ready"}`.

### Terminal 3 · Application web

Ouvrez un troisième terminal PowerShell à la racine du dépôt.

~~~powershell
cd frontend
npm.cmd ci
npm.cmd run dev
~~~

Laissez ce terminal ouvert. Allez sur [http://127.0.0.1:3000](http://127.0.0.1:3000), créez un compte, puis ouvrez le diagnostic depuis le tableau de bord. En local, la confirmation d’adresse e-mail est désactivée. Pour tester la récupération du mot de passe, ouvrez le lien reçu dans [Mailpit](http://127.0.0.1:58424) avec le même navigateur.

## 3. Lancements suivants

Démarrez Docker Desktop. Ouvrez trois terminaux à la racine du dépôt et lancez les commandes dans cet ordre.

**Terminal 1**

~~~powershell
npm.cmd run db:start
~~~

**Terminal 2**

~~~powershell
cd backend
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

**Terminal 3**

~~~powershell
cd frontend
npm.cmd run dev
~~~

Laissez les terminaux 2 et 3 ouverts, puis ouvrez [l’application](http://127.0.0.1:3000). Les commandes d’installation servent au premier lancement et après une mise à jour des dépendances. Relancez `npm.cmd ci` dans le dossier dont le fichier `package-lock.json` a changé, ou `uv sync --frozen --python 3.12` dans `backend/` si les dépendances Python ont changé.

Si une mise à jour ajoute des migrations, relancez `npx.cmd --no-install supabase migration up --local` depuis la racine après le démarrage de Supabase, avant de lancer FastAPI. Si vous aviez déjà configuré Auth avant l’ajout de la clé de récupération, relancez une fois `uv run python -m tools.configure_auth` depuis `backend/`.

Pour arrêter le projet, faites `Ctrl+C` dans les terminaux 2 et 3, puis exécutez `npm.cmd run db:stop` dans le terminal 1. Les comptes et diagnostics restent dans les volumes Docker. `npm.cmd run db:reset` efface et reconstruit la base locale.

## 4. Avancement du projet

Les cases cochées correspondent au parcours vérifié en local. Le détail des exigences et des critères de recette figure dans le [cahier des charges](CAHIER_DES_CHARGES_AGENTICTUTOR.md).

- [x] Poser le socle Next.js, FastAPI et Supabase PostgreSQL, avec migrations et tests d’isolation entre comptes.
- [x] Présenter le projet sur la page d’accueil et proposer des exemples de code interactifs prédéfinis (F02, partie livrée).
- [x] Créer un compte, se connecter, se déconnecter et récupérer son mot de passe en local. Protéger le tableau de bord et enregistrer le profil (F01, partie livrée).
- [x] Choisir un langage, répondre à 6 questions de profil et 10 questions techniques, reprendre le diagnostic et obtenir une note sur 20 calculée côté serveur (F02/F03, partie livrée).
- [ ] Faire valider les questions par l’encadrant. Cartographier les cinq notions Python et leurs prérequis, puis calculer une première estimation de maîtrise par notion (F03, F04).
- [ ] Valider le corpus et créer une banque d’au moins 50 exercices avec difficulté, indices et correction. Prévoir la publication et la provenance des contenus (F08 à F10, F14).
- [ ] Construire le tuteur Python. Rechercher dans le corpus, citer les ressources, reformuler et adapter les activités au niveau de l’étudiant (F05 à F07).
- [ ] Enregistrer les séances et les observations, afficher les progrès et proposer la suite. Borner les appels au modèle et mesurer les erreurs, la latence et les coûts (F11 à F13, F15).
- [ ] Ajouter les permissions de gestion, le signalement et les demandes d’accès ou de suppression des données. Vérifier la confirmation d’e-mail, les quotas, la résistance aux consignes malveillantes et la restauration avant déploiement (F01, F16, F17).
- [ ] Après le MVP, étudier les variantes d’exercices, la révision espacée, l’espace enseignant, l’exécution isolée de code, d’autres domaines et le vocal (F18 à F20 et extensions).

Le diagnostic couvre Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go et Rust. Les nouveaux diagnostics sont enregistrés sur le compte dans Supabase. Les anciens brouillons restent dans leur navigateur d’origine.

## Adresses locales

| Adresse | Utilisation |
|---|---|
| http://127.0.0.1:3000 | Application |
| http://127.0.0.1:3000/onboarding | Diagnostic, après connexion |
| http://127.0.0.1:8000/docs | Documentation de l’API |
| http://127.0.0.1:58423 | Supabase Studio |
| http://127.0.0.1:58424 | Mailpit |

## Organisation du dépôt

- `frontend/` contient l’interface Next.js et les tests navigateur. Le défilement Lenis respecte la préférence de réduction des animations. [Guide frontend](frontend/README.md)
- `backend/` contient l’API FastAPI, la configuration locale et les tests Python. [Guide backend](backend/README.md)
- `supabase/` contient la configuration de la base, les migrations et les questionnaires de départ.
- `content/`, `evaluation/` et `data/` regroupent les contenus, l’évaluation et les règles de gestion des données.
- `docs/` contient le [guide d’authentification](docs/guides/milestone-2-auth.md), l’[architecture](docs/architecture/README.md) et les [décisions techniques](docs/decisions/README.md). Pour reprendre le projet dans un autre IDE, ouvrez la racine et faites lire [AGENTS.md](AGENTS.md) à l’agent.

Mainteneur : [ziko247](https://github.com/ziko247). Licence à définir avant réutilisation ou distribution.
