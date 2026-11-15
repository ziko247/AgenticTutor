# Architecture du projet

Le frontend est implémenté et le jalon 1 backend est vérifié : FastAPI live/ready, PostgreSQL Supabase local, migrations et tests de droits/RLS. Voir le [guide backend](../../backend/README.md) pour lancer. Supabase Auth côté application, les routes métier et le tutorat restent à développer ; les documents ci-dessous décrivent aussi ces étapes futures.

## Dossier de conception backend

Documents du 15 novembre 2026 :
- [Fondation et flux](backend-foundation.md) : responsabilités, identité, connexions et RLS.
- [Modèle de données](backend-data-model.md) : profils, questionnaires versionnés, tentatives et résultats.
- [Contrat API](backend-api-contract.md) : accès, exemples JSON, erreurs et import local.
- [Mise en œuvre](backend-roadmap.md) : environnement Docker, sécurité, jalons et décisions ouvertes.
- [Décision 0002](../decisions/0002-backend-fastapi-supabase.md) : statut des choix et alternatives.

## Responsabilités

1. Le navigateur utilisera FastAPI pour les données métier. Une exception limitée à Supabase Auth est proposée pour l'identité ; elle doit être confirmée avant intégration.
2. L'API vérifie l'identité, les permissions, la propriété des données et les formats.
3. Les services exécutent les cas d'utilisation ; les repositories gèrent l'accès SQL et les transactions.
4. Le futur orchestrateur choisira une action dans une boucle bornée ; il ne décidera jamais des permissions.
5. Le module pédagogie calculera le diagnostic puis, plus tard, la maîtrise et la sélection d'activités.
6. Les futurs modules RAG et LLM fourniront les références et les explications sous contrôle serveur.

La base métier et le futur index ne sont pas accessibles directement au navigateur. Aucun secret de base ou fournisseur IA ne sera inclus dans le bundle frontend. Le choix compte avant/après diagnostic reste ouvert.

## Séparation des données

- content/ : matériaux d'apprentissage autorisés et validés.
- tests/fixtures/ : exemples synthétiques pour les tests techniques.
- evaluation/datasets/ : jeux de mesure distincts des contenus de développement.
- data/ : données locales, privées et générées ignorées par Git.

Les lots finaux d'évaluation ne doivent pas être indexés comme ressources pédagogiques. Les ressources retirées devront être exclues des recherches futures.

## Périmètre restant

Les documents décrivent le socle proposé, pas son implémentation. Les règles de maîtrise, le graphe de prérequis, le RAG, l'orchestration IA et l'hébergement FastAPI détaillé restent à concevoir. Le cahier des charges initial reste historique : les évolutions de choix sont suivies dans les décisions.
