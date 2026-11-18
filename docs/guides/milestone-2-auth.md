# Jalon 2 — Comptes, sessions et profil

Implémenté en local le 15 novembre 2026. L’inscription crée une identité dans Supabase Auth ; la première visite authentifiée du dashboard initialise son profil dans app_private.profiles. Connexion, déconnexion locale, récupération du mot de passe et édition du profil sont connectées. Les diagnostics restent dans localStorage jusqu’au jalon 3.

## Démarrer sur un nouveau poste

Prérequis : Node/npm, Docker Desktop démarré, Python 3.12 et uv.

Depuis la racine :

~~~powershell
npm.cmd ci
npm.cmd run db:start
cd backend
uv sync --frozen --python 3.12
uv run python -m tools.setup_local
uv run python -m tools.configure_auth
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

Sur ce poste, Application Control bloque le Python du venv : après installation, depuis backend/ utiliser le Python de base :

~~~powershell
$backendPython = uv python find --system 3.12
$env:PYTHONPATH = (Join-Path (Get-Location).Path '.venv\Lib\site-packages') + ';' + (Get-Location).Path
& $backendPython -m tools.setup_local
& $backendPython -m tools.configure_auth
& $backendPython -m uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

Dans un second terminal depuis la racine :

~~~powershell
cd frontend
npm.cmd ci
npm.cmd run dev
~~~

Le script configure_auth lit uniquement la pile locale dédiée et écrit les paramètres manquants dans backend/.env et frontend/.env.local sans afficher de clé. Les deux fichiers sont ignorés par Git. Redémarrer FastAPI et Next.js après configuration. Une URL Auth existante différente est refusée. Les valeurs déjà présentes ne sont pas remplacées.

Adresses : frontend http://127.0.0.1:3000 ; FastAPI http://127.0.0.1:8000 ; Supabase http://127.0.0.1:58421 ; Studio http://127.0.0.1:58423 ; mails http://127.0.0.1:58424. Conserver 127.0.0.1 pour le navigateur et les callbacks.

## Parcours

1. /sign-up : créer un compte avec des données de test locales.
2. /dashboard : profil enregistré, prénom et langue éditables, diagnostic et déconnexion.
3. /sign-in : retrouver son profil après déconnexion.
4. /forgot-password : demander un lien ; consulter les mails locaux, puis ouvrir le lien dans le même navigateur.
5. /reset-password : choisir un nouveau mot de passe puis se reconnecter.

La configuration locale désactive la confirmation d’e-mail : l’inscription fournit immédiatement une session. Si le fournisseur impose une confirmation, le formulaire affiche la demande de consultation de la boîte e-mail au lieu de prétendre être connecté. Le callback PKCE est /auth/callback ; la récupération utilise flow=recovery. Le test de confirmation obligatoire reste à réaliser avec cette option activée.

## Frontières et sécurité

Les Server Actions Next.js parlent à Supabase Auth, sans stocker les mots de passe. Les sessions sont dans des cookies HttpOnly, SameSite=Lax, Secure en production ; proxy.ts renouvelle la session et interdit la mise en cache partagée des pages concernées. Aucun SDK Auth dans le navigateur et aucun token en localStorage. Une perte des cookies PKCE ou un autre navigateur peut rendre un lien inutilisable : demander un nouveau lien.

Le dashboard vérifie l’utilisateur côté serveur avant de charger des données. Next.js appelle FastAPI avec le bearer de cette session. FastAPI vérifie ce bearer auprès du endpoint /auth/v1/user configuré, avec timeout, puis utilise le UUID retourné dans sa transaction RLS. Aucun user_id client accepté. Les clés d’administration ne sont utilisées ni par Next.js ni par les routes FastAPI.

GET/PUT/PATCH /api/v1/me/profile : profil propriétaire, création idempotente, conflit de révision 409 et validation stricte des champs. Les erreurs actuelles utilisent le format detail de FastAPI ; le format global proposé dans le contrat reste à normaliser avant de multiplier les routes.

La validation Auth dépend de la disponibilité de Supabase. La déconnexion révoque la session de rafraîchissement courante ; un access token déjà émis peut rester valable jusqu’à son expiration. Le renouvellement est fourni par le SDK SSR ; l’expiration réelle après une heure n’a pas été attendue dans les tests.

## Vérifications et limites

Backend : pytest --run-integration, ruff check et ruff format --check depuis backend/. Frontend : npm.cmd run lint, npm.cmd run typecheck, npm.cmd run build ; tests navigateur avec le frontend et FastAPI démarrés :

~~~powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm.cmd run test:e2e
~~~

La suite navigateur utilise de vrais comptes synthétiques e2e-* sur la pile locale, et la boîte de mails locale pour la récupération. Ces comptes restent disponibles pour inspection ; les tests API suppriment leur identité synthétique à la fin. Ne pas utiliser un projet partagé ou des comptes réels. Les autres tests DB vérifient déjà deux identités isolées, les contextes absents et les cascades.

Aucun projet Supabase hébergé n’a été configuré. Avant un hébergement : HTTPS, APP_ORIGIN exact, variables privées, redirections autorisées, SMTP, confirmation d’e-mail et limites fournisseur à configurer/tester. Les diagnostics persistants, le tutorat et les exercices adaptatifs restent au programme des jalons suivants.

Sources : [SSR Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [validation utilisateur](https://supabase.com/docs/reference/javascript/auth-getuser), [récupération](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

Résultat vérifié : 19 tests backend réussis, 12 tests Playwright réussis, lint/typecheck/build frontend et Ruff backend réussis. Les parcours navigateur incluent inscription réelle, édition/rechargement du profil, cookies HttpOnly, connexion, déconnexion, route protégée, e-mail local de récupération, lien PKCE, modification du mot de passe et reconnexion avec le nouveau mot de passe. Audit npm des dépendances runtime : aucune vulnérabilité signalée ; l’audit complet indique sept avis modérés de développement, non traités par une mise à jour forcée dans cette tranche. Avertissements connus : racine workspace Next avec deux lockfiles ; dépréciation upstream TestClient/httpx.
