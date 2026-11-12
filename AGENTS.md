# AgenticTutor — Guide pour les agents de développement

## Lire avant de modifier

1. `README.md` : état réel, fonctionnalités prévues et progression.
2. `CAHIER_DES_CHARGES_AGENTICTUTOR.md` : exigences F01–F20, priorités et recette.
3. `docs/architecture/README.md` : frontières entre composants et flux.
4. Le README du composant concerné, puis les décisions dans `docs/decisions/`.

## État du projet

Le frontend utilise désormais Next.js App Router, TypeScript et Tailwind CSS. Lire frontend/README.md pour les commandes, routes et frontières. Landing, authentification en aperçu et diagnostic local sont implémentés. Aucun backend, compte réel ou tutorat IA connecté. FastAPI et PostgreSQL restent des propositions.

## Reprise de la tranche actuelle

- Première priorité convenue : landing, authentification et onboarding pour apprendre Python.
- La landing enrichie utilise `frontend/src/app/page.tsx` et les styles en fin de `frontend/src/styles/globals.css` : surfaces menthe/vert/citron, cinq notions, exemple de boucle, profils et FAQ.
- La démo de boucle interactive est prédéfinie dans `frontend/src/features/tutor/lesson-preview.tsx` ; elle ne représente pas un tuteur IA connecté.
- `/sign-in` et `/sign-up` utilisent `frontend/src/features/auth/auth-form.tsx`. Validation locale uniquement : aucun compte, session ou envoi réseau.
- `/onboarding` utilise les fichiers `questions.ts`, `storage.ts` et `onboarding.tsx` dans `frontend/src/features/diagnostic/`. Les réponses et l'avancement restent dans localStorage sous `agentictutor.onboarding.v1` ; le score sur 14 questions est indicatif et non certifiant.
- Les captures et sept tests Playwright ont servi à vérifier la tranche précédente ; relancer les contrôles adaptés après toute modification. Consulter `frontend/README.md` pour les commandes et `CHROME_PATH`.
- Le backend reste un scaffold. Ne pas présenter la récupération du mot de passe, la persistance serveur, l'IA, les exercices adaptatifs ou les métriques pédagogiques comme réalisés.
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
- Le frontend utilisera l'API lorsqu'elle existera ; il n'accède directement ni à la base ni aux fournisseurs d'IA.
- Séparer contenus d'apprentissage, fixtures de tests et lots finaux d'évaluation.
- Ne pas ajouter d'agents autonomes distincts pour chaque module sans besoin démontré.

## Pendant l’implémentation

- Réaliser une petite tranche fonctionnelle liée à un critère de recette.
- Documenter les décisions retenues et les commandes réellement exécutables.
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

Le domaine pilote est Python et la première stack frontend est actée dans docs/decisions/0001-first-frontend.md. La prochaine tranche consiste à concevoir puis connecter les comptes et le profil au backend. Les tâches restent non réalisées dans le README tant qu'elles ne sont pas vérifiées.
