# AgenticTutor — Guide pour les agents de développement

## Lire avant de modifier

1. `README.md` : état réel, fonctionnalités prévues et progression.
2. `CAHIER_DES_CHARGES_AGENTICTUTOR.md` : exigences F01–F20, priorités et recette.
3. `docs/architecture/README.md` : frontières entre composants et flux.
4. Le README du composant concerné, puis les décisions dans `docs/decisions/`.

## État du projet

Le dépôt contient la documentation et une arborescence de départ. Aucune application, migration, API, dépendance ou fonctionnalité métier n'est encore implémentée. Les fichiers `.gitkeep` servent uniquement à versionner les dossiers vides.

React/TypeScript, FastAPI/Python et PostgreSQL sont des propositions. Ne pas les présenter comme installés ou définitivement validés. L'utilisateur a demandé une structure ; commencer une implémentation seulement lorsqu'une demande ultérieure l'autorise.

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
- Le frontend utilise l'API ; il n'accède directement ni à la base ni aux fournisseurs d'IA.
- Séparer contenus d'apprentissage, fixtures de tests et lots finaux d'évaluation.
- Ne pas ajouter d'agents autonomes distincts pour chaque module sans besoin démontré.

## Quand l'implémentation commencera

- Réaliser une petite tranche fonctionnelle liée à un critère de recette.
- Documenter les décisions retenues et les commandes réellement exécutables.
- Choisir et verrouiller les versions des dépendances lors de l'initialisation du composant.
- Ajouter les tests utiles au comportement, à la sécurité et à l'intégration modifiés.
- Ne pas inventer de commande de test : il n'existe actuellement aucun runner configuré.
- Signaler clairement ce qui n'a pas été exécuté ou mesuré.
- Mettre à jour les chemins, README et checklists après les changements.
- Cocher une fonctionnalité seulement après implémentation et vérification ; un dossier vide ne satisfait pas une exigence.
- Conserver les originaux et les modifications utilisateur existantes.

## Données et secrets

Ne jamais committer de clés, fichiers `.env` réels, conversations d'étudiants, exports personnels ou documents non autorisés. Les exemples doivent être synthétiques. Utiliser `data/raw/` et `data/private/` localement selon `data/README.md`. Les index et résultats générés ne sont pas des sources de référence.

## Prochain travail proposé

Valider le domaine et la stack, documenter la première décision technique, puis concevoir le parcours diagnostic → profil et son modèle de données. Les tâches restent non réalisées dans le README tant qu'elles ne sont pas vérifiées.
