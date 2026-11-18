# Fondation backend : FastAPI et Supabase

> Mise à jour jalon 2 : la proposition SDK navigateur ci-dessous est remplacée par [0003, sessions côté serveur Next.js](../decisions/0003-server-auth-sessions.md). Auth et profils sont implémentés ; voir le guide du jalon 2.


Date : 15 novembre 2026. Statut : jalon 1 implémenté et vérifié localement ; modalités Auth et choix produit ci-dessous encore proposés. FastAPI live/ready, conteneurs Supabase, schéma privé, migration et tests sont disponibles. Aucun projet hébergé ni intégration Auth frontend. Commandes dans le [guide backend](../../backend/README.md).

## État vérifié

Le frontend Next.js propose dix choix : Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go et Rust. Le diagnostic contient six questions de profil non notées et dix questions techniques à choix unique. Une bonne réponse vaut deux points ; la note vaut donc 2 × bonnes réponses sur 20, sans certification du niveau. Les banques sont statiques et restent à relire pédagogiquement.

Sources du contrat actuel : frontend/src/lib/languages.ts ; frontend/src/features/diagnostic/{questions,banks,storage,onboarding}. Le format local v2 conserve language, answers, step, review et completed sous agentictutor.onboarding.v2. Les choix sont des indices numériques. Il n'y a ni identifiant de tentative ni version de contenu. Les brouillons v1 sont séparés. Les formulaires auth-form.tsx ne font aucun appel réseau.

## Direction et responsabilités

| Composant | Responsabilité cible |
|---|---|
| Next.js | Interface existante, état du parcours, client Auth et client HTTP FastAPI |
| Supabase Auth | Identités, vérification d'e-mail, mots de passe, renouvellement et récupération |
| FastAPI | Identité vérifiée, autorisations, validation, profil, tentatives, calcul serveur et futurs outils du tuteur |
| PostgreSQL Supabase | Intégrité, historique versionné et transactions |
| Supabase CLI + Docker local | Environnement local reproductible avec PostgreSQL et Auth |
| Supabase hébergé | PostgreSQL et Auth pour le déploiement, dans un projet distinct du développement |

Un backend modulaire unique suffit. API → services → repositories ; les règles de score sont dans app/pedagogy/. Pas d'orchestrateur ni de fournisseur IA dans le premier jalon. Le jalon 1 utilise directement Psycopg synchrone avec pool ; les versions sont verrouillées dans backend/uv.lock. Aucun ORM n’est nécessaire pour les probes et transactions de cette tranche. Un accès SQL bloquant devra être utilisé dans des handlers synchrones ou déporté hors de la boucle asynchrone.

## Frontière du navigateur : proposition explicite

La règle actuelle « le navigateur appelle uniquement l'API applicative » serait assouplie pour une seule exception : l'identité via Supabase Auth. Les données métier restent exclusivement accessibles via FastAPI. Aucune requête navigateur vers les tables Supabase, Storage ou les fournisseurs IA.

Option retenue dans cette conception : SDK Supabase côté navigateur pour Auth, puis jeton Bearer vers FastAPI. Elle réutilise les mécanismes du fournisseur et évite de créer un proxy de mots de passe et de refresh tokens. Elle introduit une dépendance Auth publique et exige de protéger le navigateur contre les injections de scripts.

L'autre option conserve la règle stricte : FastAPI ou un BFF gère Auth, les cookies HttpOnly et leur renouvellement. Elle impose davantage de gestion des sessions et de protection CSRF. Ce surcoût n'est pas nécessaire pour le premier prototype. L'exception Auth reste à valider avant connexion des formulaires ; le code actuel n'est pas modifié.

## Flux local proposé

~~~mermaid
flowchart LR
  N["Next.js : navigateur, port 3000"] -->|"Connexion et renouvellement"| A["Supabase Auth local, conteneur"]
  A -->|"Session utilisateur"| N
  N -->|"Authorization: Bearer jeton"| F["FastAPI local, port 8000"]
  F -->|"Vérification JWT / clés publiques"| A
  F -->|"SQL, rôle applicatif limité"| P["PostgreSQL local, conteneur"]
~~~

FastAPI tourne d'abord dans un environnement Python sur l'hôte. Il utilise les adresses locales publiées par la CLI ; il ne suppose pas que le nom réseau d'un conteneur est résolu depuis l'hôte. La configuration locale fixe Auth/API à 58421, PostgreSQL à 58422, Studio à 58423 et les mails à 58424 ; disponibilité vérifiée sur ce poste.

## Flux déployé proposé

~~~mermaid
flowchart LR
  N["Next.js HTTPS"] -->|"Auth uniquement"| A["Supabase Auth hébergé"]
  N -->|"Bearer, HTTPS"| F["FastAPI hébergé"]
  F -->|"Clés publiques de confiance"| A
  F -->|"Connexion PostgreSQL chiffrée"| P["Supabase PostgreSQL hébergé"]
~~~

Pour un service FastAPI persistant : connexion directe si le réseau le permet ; pooler en mode session en réseau IPv4 seul. La connexion de migration est distincte. Le mode transaction demande de vérifier les limites du pilote et les états de session ; il n'est pas le défaut de cette conception. Dimensionner le pool par worker pour rester sous la limite du projet. Ce choix suit les [modes de connexion Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Authentification proposée

1. Le SDK envoie l'e-mail et le mot de passe à Supabase Auth via HTTPS. FastAPI ne stocke ni mot de passe ni condensat.
2. Après une connexion valide, le client reçoit la session du fournisseur. La clé publiable du projet ne remplace jamais le jeton utilisateur.
3. Le client envoie uniquement l'access token dans Authorization: Bearer pour les appels FastAPI. Les refresh tokens restent gérés par le SDK.
4. Une dépendance FastAPI valide signature, algorithme autorisé, issuer exact configuré, audience attendue, expiration, nbf si présent et sub UUID. Le rôle attendu est celui d'un utilisateur authentifié ; le jeton d'une clé de service ne donne pas une identité étudiant.
5. Le sub vérifié est la seule origine de l'identifiant propriétaire. Le profil métier est créé par un PUT idempotent authentifié ; les routes qui en ont besoin renvoient profile_required avant sa création.

Utiliser une bibliothèque JWT maintenue, telle que PyJWT avec ses dépendances cryptographiques, plutôt qu'un décodeur maison. Le JWKS vient exclusivement de l'URL Auth configurée, jamais d'une URL fournie dans le jeton. Cache borné, rafraîchissement contrôlé sur kid inconnu et échec fermé si aucune clé de confiance n'est disponible. Pas d'acceptation automatique d'un algorithme lu dans le jeton. Si l'environnement local utilise une signature symétrique sans JWKS, utiliser la validation serveur Auth officiellement supportée ou configurer des clés asymétriques ; ne pas désactiver les contrôles pour les tests. Voir [Supabase JWT](https://supabase.com/docs/guides/auth/jwts) et [JWT dans FastAPI](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/).

Session navigateur proposée : persistance gérée par le SDK pour retrouver la session après rechargement. Les jetons accessibles à JavaScript restent exposés en cas de XSS ; ils ne sont pas HttpOnly. CSP, absence de HTML non fiable et limitation des scripts tiers sont nécessaires. La récupération et la confirmation d'e-mail utilisent des URLs autorisées et le flux PKCE lorsque pertinent. Aucun refresh token dans le brouillon du diagnostic.

| Action | Responsabilité prévue |
|---|---|
| Inscription | SDK → Auth ; e-mail à confirmer, puis profil créé après session valide |
| Connexion | SDK → Auth ; aucune seconde base de mots de passe FastAPI |
| Renouvellement | SDK ; une nouvelle tentative API après expiration, sans boucle infinie ni rejeu non idempotent |
| Déconnexion | Scope local explicitement choisi ; retrait de la session navigateur, brouillon diagnostique conservé sauf choix d'effacement |
| Mot de passe oublié | Réponse neutre, e-mail de récupération et page de retour contrôlée, puis mise à jour via Auth |

Ces actions ne sont pas implémentées. La révocation des refresh tokens ne rend pas immédiatement invalide un access token déjà émis : une vérification locale peut l'accepter jusqu'à son expiration. La suppression de compte exige en plus un contrôle actif du compte/session avant l'opération. Voir [déconnexion Supabase](https://supabase.com/docs/guides/auth/signout) et [récupération du mot de passe](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

## Accès SQL et RLS

Implémenté au jalon 1 : schéma métier app_private non exposé à la Data API, sans droits pour anon/authenticated. app_runtime est un rôle PostgreSQL dédié, non propriétaire, non superutilisateur et NOBYPASSRLS. app_owner possède les objets sans LOGIN ; la CLI utilise l’administrateur postgres pour les migrations locales, jamais pour les requêtes HTTP. Un identifiant de migration distant reste à configurer au déploiement. Les clés secrètes/service_role ne sont pas nécessaires au CRUD courant.

Chaque transaction utilisateur initialise un contexte local app.user_id depuis le sub vérifié. Les politiques RLS comparent ce contexte au propriétaire des profils et tentatives ; les réponses héritent du propriétaire de la tentative. Contexte absent = accès refusé. Les repositories ajoutent aussi un filtre propriétaire. Le contexte est transactionnel, initialisé avant chaque lecture/écriture et ne doit pas fuir dans une connexion réutilisée. Pas de dépendance implicite à auth.uid() : une connexion SQL directe n'injecte pas les claims JWT.

RLS ne protège pas une connexion postgres, un rôle BYPASSRLS ou, par défaut, le propriétaire des tables. Les tests doivent employer le rôle réel app_runtime. Une compromission du backend ou de ses identifiants reste hors de la garantie d'isolation RLS entre clients. Voir [RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Configuration : socle local et étapes futures

Le socle lit DATABASE_URL, DATABASE_POOL_SIZE, DATABASE_TIMEOUT et CORS_ORIGINS ; voir backend/.env.example. Les variables Auth/frontend et de déploiement ci-dessous restent futures.

| Public, dans le bundle | Serveur FastAPI uniquement | Opérations uniquement |
|---|---|---|
| NEXT_PUBLIC_API_BASE_URL | DATABASE_URL du rôle limité | MIGRATION_DATABASE_URL |
| NEXT_PUBLIC_SUPABASE_URL | AUTH_ISSUER, AUTH_AUDIENCE, AUTH_JWKS_URL | Identifiants administrateur, si nécessaires à la suppression |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Algorithmes autorisés, origines CORS, pool et délais | Accès aux sauvegardes et au projet hébergé |

Les URLs et clés publiables sont des identifiants de projet, pas des permissions métier. Ne pas préfixer un secret par NEXT_PUBLIC_. Les variables réelles restent hors Git ; de futurs exemples ne contiendront que des valeurs fictives.

Lire aussi le [modèle de données](backend-data-model.md), le [contrat API](backend-api-contract.md), le [plan de mise en œuvre](backend-roadmap.md) et la [décision 0002](../decisions/0002-backend-fastapi-supabase.md).
