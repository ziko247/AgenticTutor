# Supabase local

Configuration dédiée à AgenticTutor : projet `agentictutor-local`, PostgreSQL 17, ports 58420–58424. La CLI 3.1.0 est installée par le package racine. Aucun projet hébergé n'est lié.

- `config.toml` : services et ports locaux ; Realtime, Storage, Edge Runtime et Analytics désactivés.
- `migrations/` : historique SQL unique, exécuté dans l'ordre par la CLI.
- `seed.sql` : instantané figé des diagnostics du frontend, version 1 du 15 novembre 2026 ; aucune donnée étudiante ni identité.
- `.temp/` et `.branches/` : état local ignoré par Git.

La migration construit le schéma sous `app_owner` sans LOGIN. Le rôle `app_runtime` reste non propriétaire et soumis à RLS ; son mot de passe est provisionné hors Git par `backend/tools/setup_local.py`. Les tables privées ne sont pas exposées aux rôles Data API.

Les questionnaires sont publiés après vérification structurelle, puis immuables. Les UUID du seed sont déterministes ; ne pas réécrire une version déjà publiée. Les modifications futures nécessitent une nouvelle version et un nouvel historique de migration/seed adapté.

Pour démarrer, configurer le runtime, vérifier les probes ou reconstruire la base, suivre le [guide backend](../backend/README.md). `db:reset` efface les données locales ; les volumes ne sont pas une sauvegarde. Aucun reset distant n'est nécessaire au jalon 1.
