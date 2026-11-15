# Mise en œuvre proposée

Date : 15 novembre 2026. Jalon 1 implémenté et vérifié ; jalons 2–4 à réaliser. Lire la [fondation](backend-foundation.md) et le [contrat API](backend-api-contract.md). La rédaction de ces documents ne termine aucune fonction F01–F04 ou F12.

## Environnement local et reproduction

Le socle local est opérationnel : configuration CLI dans supabase/, dépendances verrouillées racine et backend/, FastAPI sur l’hôte. Voir le [guide backend](../../backend/README.md) pour les commandes, les ports et le cas Windows vérifié. Aucun projet hébergé n’est configuré.

Principes conservés pour la suite (les étapes d’initialisation ci-dessous ont été réalisées au jalon 1) :
1. Vérifier Python compatible avec les dépendances choisies, Node/npm, Supabase CLI et un moteur compatible Docker. Sous Windows, Docker Desktop avec sa virtualisation demande les prérequis de l'éditeur ; ne pas modifier le système sans accord. Verrouiller les versions de la CLI et des dépendances dans le dépôt.
2. Initialiser une seule racine supabase/ dans le dépôt. La CLI pilotera PostgreSQL, Auth, la passerelle, Studio et l'outil de mails local ; les autres services seront désactivés s'ils ne sont pas utilisés. Ne pas créer un second PostgreSQL avec un Compose concurrent.
3. Source unique des migrations SQL : supabase/migrations/. Le dossier backend/migrations/ restera documenté comme réservé, sans deuxième historique Alembic. Un ORM ne doit pas créer/modifier les tables automatiquement au démarrage.
4. Les seeds dans supabase/seed.sql contiendront uniquement langues, versions de diagnostic et données synthétiques. Les utilisateurs de test seront créés par une procédure Auth dédiée et locale, pas par insertion manuelle improvisée dans auth.users. Aucun contenu réel d'étudiant.
5. Le développeur clonera le dépôt, démarrera le moteur Docker et les services locaux, appliquera les migrations dans l'ordre, chargera les seeds puis préparera la configuration locale hors Git. Les URL publiées par la CLI seront reportées dans les environnements FastAPI et Next.js. Utiliser le même hôte navigateur pour éviter les changements d'origine de localStorage.
6. Démarrer FastAPI sur l'hôte dans son environnement Python, puis Next.js. À l'implémentation, les commandes exactes et leurs résultats devront être ajoutés aux README et vérifiés sur un second poste.

La configuration, le seed et les migrations mentionnés ci-dessus sont livrés ; les étapes Auth/Next.js restent futures. Les images, téléchargements initiaux, disque, RAM et virtualisation sont un coût du local ; les mesurer sur les ordinateurs disponibles, sans inventer de minimum. La persistance d'un volume ne remplace pas une sauvegarde. Voir [Supabase CLI local](https://supabase.com/docs/guides/local-development), [migrations](https://supabase.com/docs/guides/local-development/database-migrations) et [volumes Docker](https://docs.docker.com/engine/storage/volumes/).

Sans Docker : utiliser un projet Supabase de développement dédié, distinct de la démonstration/production. Il exige Internet et des identifiants propres ; ne jamais lancer des resets de tests contre un projet partagé. Le mode natif expérimental de la CLI n'est pas retenu comme prérequis Windows. Si l'authentification complète ne peut pas être testée localement, le signaler et utiliser une CI isolée ; les mocks ne prouvent pas l'intégration réelle.

FastAPI peut être conteneurisé plus tard pour l'hébergement ou une équipe qui souhaite une commande de démarrage commune. Cela imposera de traiter réseau, hostnames, secrets, probes et arrêt propre. Le premier jalon n'en a pas besoin.

## Jalons et critères de recette

| Jalon | Dépendances | Livrable et critère de recette | Capacité réelle de l'étudiant |
|---|---|---|---|
| 1. Socle local FastAPI + DB | Docker/CLI/Python ; décision 0002 | API démarrable ; live/ready ; migrations rejouables depuis une base vide ; rôle runtime limité et RLS vérifiés ; tests sans service distant | Interface actuelle inchangée ; toujours aucun compte réel ni sauvegarde serveur |
| 2. Auth et profil | Jalon 1 ; validation exception Auth ; réglages e-mail et redirections | Inscription, confirmation, connexion, refresh, déconnexion, récupération ; GET/PUT/PATCH profil ; deux identités isolées ; aucun secret dans le bundle | Créer un compte, se connecter et retrouver son profil |
| 3. Diagnostic persistant | Jalons 1–2 ; publication versionnée ; choix compte/diagnostic | Questions serveur, réponses, reprise, note et import validés ; gestion des conflits ; parcours invité préservé selon décision produit | Sauvegarder et retrouver un diagnostic sur son compte |
| 4. Première boucle tutorale | Jalon 3 ; corpus et exercice relus ; fournisseur et budget choisis | Une notion, explication sourcée, exercice déterministe, indices, correction et décision suivante bornée ; tests de défaillance et coût | Apprendre une notion avec un tutorat connecté limité au périmètre testé |

Jalon 1 terminé localement : probes HTTP 200, configuration typée, migration et seed rejoués sur base propre, 18 tests réussis avec accès réel à Supabase, isolation A/B et rôle runtime vérifiés. Ruff lint/format passent. Un avertissement upstream TestClient/httpx reste visible. Le lancement sur un second poste reste à vérifier. Les contrats métier restent proposés ; aucune fonction F01–F04/F12 n’est cochée par ce socle seul.

## Tests nécessaires

- Unitaires : calcul 0/20, 2/20, 20/20 ; zéro point pour le profil ; mauvaise option ; champs inattendus ; six profils et dix techniques ; clés uniques et immutabilité de version.
- JWT : signature fausse, mauvais issuer/audience/algorithme, expiration, nbf, sub invalide, clé inconnue et rotation ; aucune dégradation vers un simple décodage.
- Intégration PostgreSQL : migrations sur base vide ; cascade de suppression ; FKs question/option/version ; contexte RLS absent ; compte A/B sur connexions réutilisées ; rôle runtime sans DDL ni bypass.
- Concurrence : deux onglets sauvegardent la même revision ; complete contre save ; double création et double import avec même clé ; même clé/contenu différent. Un seul état final valide.
- Auth local : confirmation et récupération par l'outil de mails ; refresh et déconnexion ; délai de validité des access tokens documenté ; suppression avec contrôle actif.
- Import : v1 laissé intact ; v2 sans preuve de version refusé sans suppression ; version compatible ; réponse incomplète ; panne après commit ; changement de compte ; aucune confiance dans la note locale.
- E2E : conserver les parcours responsive/clavier existants et ajouter le parcours compte → diagnostic → reconnexion. Ne pas remplacer les contrôles de non-connexion actuels par des succès simulés avant le vrai branchement.
- Performance : relever latence, erreurs, pool et coût sur la configuration réelle ; les objectifs du cahier des charges restent des objectifs, pas des résultats.

Les tests d'intégration utilisent une instance dédiée jetable et des comptes synthétiques. Les tests FastAPI isolés remplacent les dépendances externes ; une exécution réelle sur Supabase local reste nécessaire. Toute opération destructive exige de vérifier l'environnement et la cible.

## Sécurité et exploitation

CORS : liste explicite des origines Next.js de chaque environnement ; localhost et 127.0.0.1 ne sont pas la même origine. N'autoriser que les méthodes et en-têtes nécessaires, dont Authorization, Content-Type et Idempotency-Key. Pas de wildcard avec credentials. Le bearer n'est pas automatiquement envoyé comme un cookie ; si un futur BFF utilise des cookies, revoir CSRF et SameSite. Voir [CORS FastAPI](https://fastapi.tiangolo.com/tutorial/cors/).

Validation Pydantic stricte : codes autorisés, longueurs, UUID et limites de taille ; requêtes SQL paramétrées, ordre/colonnes de tri non arbitraires, objets de réponse explicitement sélectionnés. Un JWT authentifie une personne, pas une action : chaque service contrôle aussi propriété et état.

Limiter les tentatives Auth via le fournisseur et les écritures/imports via API/proxy, par utilisateur et IP lorsque pertinent. Les seuils seront mesurés au jalon concerné. En multi-worker, pas de compteur mémoire présenté comme global. Quotas, délais et taille de requête configurables ; 429 avec attente conseillée.

Journaux structurés : request_id, route modèle, code de statut, durée et catégorie d'erreur. Ne pas journaliser Authorization, refresh tokens, mots de passe, corps de réponses étudiantes ni DSN. Pas de données personnelles par défaut dans les traces.

Secrets : fichiers locaux ignorés, exemples fictifs futurs, coffre de secrets de l'hébergeur pour le déploiement. Rotation prévue lors d'une fuite. Le rôle de migration ne sera jamais celui du serveur HTTP.

Sauvegardes : relever les garanties réellement incluses dans le plan Supabase retenu, sans supposer qu'une restauration ponctuelle est gratuite ou activée. Prévoir un export chiffré si nécessaire et tester une restauration en environnement isolé avant pilote. Les volumes Docker ne sont pas une sauvegarde ; les données locales doivent être synthétiques. Durée de conservation et traitement des sauvegardes après suppression à fixer avec l'établissement.

## Décisions encore ouvertes

| Question | Recommandation | Validation requise |
|---|---|---|
| Compte avant ou après diagnostic ? | Diagnostic invité puis compte pour sauvegarder | Porteur + encadrant avant jalon 3 |
| Exception navigateur → Supabase Auth ? | Oui, pour Auth seulement | Porteur avant jalon 2 |
| Banques et note reflètent-elles le niveau ? | Relecture des dix banques ; garder la note indicative | Référent pédagogique |
| Édition après résultat | Nouvelle tentative liée, résultat antérieur conservé | Porteur avant jalon 3 |
| Anciens v2 sans version de contenu | Pas d'import automatique sans correspondance prouvée | Porteur ; prévoir conservation/export |
| Hébergement FastAPI et plan Supabase | Petit service persistant + projet hébergé distinct | Budget, région, confidentialité et connectivité |
| Conservation/suppression, mineurs éventuels | Données minimales ; règles institutionnelles explicites | Établissement avant données réelles |

Prochain travail recommandé : jalon 2, Auth et profil, après confirmation de la frontière navigateur/Auth. Aucun frontend à modifier tant que la frontière API et l'intégration Auth ne sont pas validées.
