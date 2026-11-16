# 0002 : Fondation FastAPI, Supabase et Docker local

> Mise à jour jalon 2 : la proposition SDK navigateur ci-dessous est remplacée par [0003, sessions côté serveur Next.js](0003-server-auth-sessions.md). Auth et profils sont implémentés ; voir le guide du jalon 2.


- Date : 15 novembre 2026.
- Statut : direction technique retenue à la demande du porteur ; intégration Auth proposée, à confirmer avant implémentation.
- Exigences : F01–F04, F12, F17 ; isolation des comptes et reproductibilité.
- Relation : complète 0001 pour le backend ; ne réécrit pas son état frontend historique.

## Contexte

Le dépôt possède une interface Next.js, des formulaires sans réseau et un diagnostic multilangage local noté sur 20. Au moment de la conception, le backend ne contenait que des dossiers préparés. Le cahier des charges suggérait FastAPI et PostgreSQL, sans verrouiller l'hébergement ni Auth.

## Options examinées

| Option | Avantages | Contraintes |
|---|---|---|
| FastAPI + PostgreSQL seuls | Contrôle de l'hébergement et schéma portable | Exploiter Auth, e-mails, sauvegardes et environnement soi-même |
| FastAPI + Supabase PostgreSQL + Auth | Réutiliser PostgreSQL et l'identité du fournisseur ; environnement local et hébergé | Dépendance opérationnelle, budget et configuration de sécurité à suivre |
| Accès métier direct navigateur → Supabase | Moins de routes au départ | Distribue les règles métier et complique la future orchestration Python |

## Décision

La direction demandée est FastAPI pour le métier et les futures intégrations IA, Supabase pour PostgreSQL hébergé, et Supabase CLI avec un moteur Docker pour PostgreSQL et Auth en local. FastAPI tourne d'abord sur l'hôte. Il ne s'agit pas de choisir Supabase au lieu de PostgreSQL : Supabase fournit le PostgreSQL retenu.

Supabase Auth e-mail/mot de passe est proposé, avec SDK navigateur pour l'identité et bearer vers FastAPI pour le métier. Cette exception explicite à la règle API-only est détaillée dans la [fondation](../architecture/backend-foundation.md). Elle reste à confirmer avant branchement ; aucun accès direct aux tables métier depuis le frontend.

## Conséquences et validation

- Un schéma PostgreSQL métier privé, un rôle applicatif limité, des contrôles de propriété FastAPI et des tests RLS avec ce rôle.
- Migrations SQL uniques sous supabase/migrations/, sans historique parallèle dans backend/migrations/. Le jalon 1 livre et vérifie le schéma initial.
- Pas de seconde base de mots de passe FastAPI, de proxy Auth improvisé, de microservices ou d'agent par module.
- Versions et connectivité locale vérifiées au jalon 1 ; région, connexion hébergée et coût restent à vérifier avant déploiement.
- Compte-first/diagnostic-first, import des anciens brouillons et édition après note restent ouverts selon le [plan](../architecture/backend-roadmap.md).

Le jalon 1 implémente FastAPI live/ready, Supabase local et le schéma privé avec tests. Psycopg synchrone suffit à cette tranche, sans ORM. app_owner possède les objets sans connexion ; la CLI applique les migrations avec l’administrateur local, distinct de app_runtime. Aucune connexion à un service hébergé ni intégration Auth de l’application. Les sources techniques et limites sont liées dans le [dossier d'architecture](../architecture/backend-foundation.md).
