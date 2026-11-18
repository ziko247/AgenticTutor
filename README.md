# AgenticTutor

AgenticTutor est un projet de fin d'année : un tuteur pédagogique destiné à adapter ses explications et ses exercices au niveau de l'étudiant.

Python est le domaine pilote du tutorat. Le diagnostic propose aussi C, C++, C#, Java, HTML, CSS, JavaScript, Go et Rust. Les exemples de la landing sont prédéfinis ; le tuteur IA reste à développer.
### Accès et prise en main — MVP

- [ ] **F01** — Créer un compte, se connecter et se déconnecter.
- [ ] **F01** — Séparer les permissions étudiant et gestionnaire.
- [ ] **F02** — Présenter les objectifs, le fonctionnement et les limites du tuteur.
- [ ] **F02** — Commencer un diagnostic ou reprendre un parcours existant.

### Diagnostic et profil — MVP

- [ ] **F03** — Proposer un diagnostic initial couvrant les cinq notions.
- [ ] **F03** — Calculer une première estimation de maîtrise par notion.
- [ ] **F04** — Afficher la maîtrise, les observations et la date de mise à jour.
- [ ] **F04** — Distinguer une notion non évaluée d'une notion en difficulté.
- [ ] **F11** — Actualiser le profil après une activité évaluée de manière fiable.
- [ ] **F11** — Conserver les observations qui justifient les mises à jour.

### Explications et conversation — MVP

- [ ] **F05** — Rechercher les passages utiles dans le corpus validé.
- [ ] **F05** — Fournir des explications avec des références consultables.
- [ ] **F05** — Signaler lorsqu'une question dépasse les ressources disponibles.
- [ ] **F06** — Reformuler une explication sur demande.
- [ ] **F06** — Proposer un exemple ou une explication plus détaillée.
- [ ] **F06** — Tenir compte de la notion travaillée et du contexte de la séance.

### Exercices et corrections — MVP

- [ ] **F08** — Constituer une banque d'au moins 50 exercices validés.
- [ ] **F08** — Associer chaque exercice à une notion, une difficulté et une correction.
- [ ] **F08** — Couvrir les QCM, réponses encadrées, lectures de code et questions courtes.
- [ ] **F09** — Fournir des indices graduels avant la correction complète.
- [ ] **F10** — Corriger les réponses déterministes sans dépendre du modèle génératif.
- [ ] **F10** — Encadrer les corrections ouvertes avec une grille de référence.
- [ ] **F10** — Distinguer réponse correcte, partielle, incorrecte et non évaluable.
- [ ] **F10** — Expliquer les erreurs et demander une précision en cas d'ambiguïté.

### Adaptation et orchestration — MVP

- [ ] **F07** — Représenter les notions et leurs prérequis.
- [ ] **F07** — Définir et versionner les règles d'adaptation.
- [ ] **F07** — Choisir l'activité selon les acquis et les résultats récents.
- [ ] **F07** — Revenir à un prérequis après des difficultés répétées.
- [ ] **F07** — Augmenter la difficulté après des réussites suffisamment étayées.
- [ ] **F07** — Permettre à l'étudiant de choisir une autre notion accessible.
- [ ] **F15** — Enregistrer les actions, résultats et justifications synthétiques.
- [ ] **F15** — Borner les appels au modèle et les étapes de chaque interaction.

### Progression et continuité — MVP

- [ ] **F12** — Sauvegarder les séances et les tentatives terminées.
- [ ] **F12** — Reprendre une séance après reconnexion.
- [ ] **F13** — Afficher les notions travaillées et l'évolution de la progression.
- [ ] **F13** — Présenter les prochaines étapes recommandées.

### Gestion des contenus et retours — MVP

- [ ] **F14** — Ajouter, modifier et retirer des ressources et exercices.
- [ ] **F14** — Séparer les brouillons des contenus validés et publiés.
- [ ] **F14** — Conserver la provenance et les versions des contenus.
- [ ] **F14** — Exclure les ressources retirées des nouvelles recherches.
- [ ] **F16** — Permettre le signalement d'une réponse ou correction problématique.
- [ ] **F16** — Consulter les signalements depuis l'espace gestionnaire.
- [ ] **F17** — Permettre de consulter ses données et de demander leur suppression.

### Qualité, sécurité et exploitation — MVP

- [ ] Vérifier les autorisations côté serveur et l'isolation entre comptes.
- [ ] Protéger les mots de passe, secrets et clés d'API.
- [ ] Valider les entrées et les sorties structurées du modèle.
- [ ] Tester les instructions malveillantes présentes dans les documents.
- [ ] Limiter les requêtes et appliquer les quotas de consommation.
- [ ] Gérer les délais dépassés, sorties invalides et indisponibilités du modèle.
- [ ] Éviter les doubles tentatives lors des nouvelles tentatives réseau.
- [ ] Mesurer la latence, les erreurs, les appels et le coût par séance.
- [ ] Tester la navigation clavier, la lisibilité et l'affichage mobile.
- [ ] Tester la sauvegarde, la restauration et la procédure de suppression.
- [ ] Documenter l'installation et rendre la démonstration reproductible.

### Extensions après le MVP

- [ ] **F18 · P1** — Générer des variantes d'exercices validées avant publication.
- [ ] **F19 · P1** — Proposer une révision espacée des notions.
- [ ] **F20 · P2** — Ajouter un tableau de bord enseignant par groupe autorisé.
- [ ] **P2** — Exécuter du code dans un environnement isolé et limité.
- [ ] **P2** — Ajouter un second domaine ou une seconde langue.
- [ ] **P2** — Étudier les interactions vocales selon le temps disponible.
## Avancement

- [x] Landing et exemples de code multilangages.
- [x] Inscription, connexion, déconnexion et récupération de mot de passe avec Supabase Auth en local.
- [x] Tableau de bord protégé et profil enregistré en base.
- [x] Diagnostic lié au compte : choix d'un langage, 6 questions de profil et 10 questions techniques, avec note indicative sur 20.
- [x] API FastAPI, base PostgreSQL locale et tests d'accès aux données.
- [ ] Faire valider les questions du diagnostic par l'encadrant.
- [ ] Construire le tuteur IA, les exercices adaptatifs et le suivi de progression.
- [ ] Valider la confirmation obligatoire par e-mail et préparer le déploiement.

Le diagnostic est enregistré dans Supabase et nécessite une connexion. Les anciens brouillons locaux restent sur l'appareil et ne sont pas importés automatiquement. La confirmation d'e-mail est désactivée en local. La landing présente la vision du produit ; les fonctionnalités prévues ne sont pas toutes disponibles.

## Installation et lancement

Prérequis : Node.js 20.9 ou plus avec npm, Python 3.12, uv et Docker Desktop démarré. Les commandes ci-dessous utilisent PowerShell sous Windows.

Depuis la racine du dépôt, au premier lancement :

~~~powershell
npm.cmd ci
npm.cmd run db:start
cd backend
uv sync --frozen --python 3.12
uv run python -m tools.setup_local
uv run python -m tools.configure_auth
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
~~~

Laisser ce terminal ouvert. Dans un second terminal, depuis la racine :

~~~powershell
cd frontend
npm.cmd ci
npm.cmd run dev
~~~

Si la base locale existait avant cette mise à jour, appliquer les nouvelles migrations depuis la racine après `db:start` :

```powershell
npx.cmd --no-install supabase migration up --local
```

Depuis `backend/`, relancer `uv run python -m tools.configure_auth` pour ajouter la clé locale de récupération, puis redémarrer FastAPI et le frontend. Cette commande conserve les comptes et données ; ne pas utiliser `db:reset` pour cette mise à jour.

Ouvrir http://127.0.0.1:3000. Le premier démarrage télécharge les dépendances et les images Docker. Les fichiers de configuration locaux sont ignorés par Git.

Sur ce poste, si Windows bloque le Python de l'environnement virtuel, suivre les [commandes alternatives](docs/guides/milestone-2-auth.md#démarrer-sur-un-nouveau-poste). Le guide explique aussi la configuration et les tests de récupération de mot de passe.

Pour arrêter les serveurs frontend et backend, utiliser `Ctrl+C` dans chaque terminal. Depuis la racine du dépôt, démarrer ou arrêter Supabase avec :

```powershell
npm.cmd run db:start
npm.cmd run db:stop
```

Après l'arrêt, les conteneurs disparaissent de Docker Desktop et sont recréés au démarrage suivant. Les données restent dans les volumes Docker. `npm.cmd run db:reset` efface et reconstruit la base locale.

## Adresses utiles

| Adresse | Utilisation |
|---|---|
| http://127.0.0.1:3000 | Application |
| http://127.0.0.1:3000/onboarding | Diagnostic |
| http://127.0.0.1:8000/docs | Documentation de l'API |
| http://127.0.0.1:58423 | Supabase Studio |
| http://127.0.0.1:58424 | Boîte de mails locale |

## Organisation et suivi

Arborescence existante (les fichiers `.gitkeep` sont omis pour la lisibilité) :

```text
AgenticTutor/
├── README.md
├── AGENTS.md                       # Guide de reprise pour les agents
├── CAHIER_DES_CHARGES_AGENTICTUTOR.md
├── .gitignore
├── .gitattributes
├── frontend/
│   ├── README.md
│   ├── public/                      # Assets publics
│   ├── src/
│   │   ├── app/                     # Entrée, navigation et composition
│   │   ├── components/              # Composants réutilisables
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── diagnostic/
│   │   │   ├── tutor/
│   │   │   ├── exercises/
│   │   │   ├── progress/
│   │   │   └── admin/
│   │   ├── lib/                     # Client API et utilitaires
│   │   ├── types/
│   │   └── styles/
│   └── tests/
├── backend/
│   ├── README.md
│   ├── app/
│   │   ├── api/                     # Routes et contrôles d'accès
│   │   ├── core/                    # Configuration, sécurité, erreurs
│   │   ├── models/                  # Modèles de persistance
│   │   ├── schemas/                 # Contrats et validation
│   │   ├── repositories/            # Accès à la base
│   │   ├── services/                # Cas d'utilisation
│   │   ├── pedagogy/                # Maîtrise, prérequis, adaptation
│   │   ├── orchestration/           # Boucle du tuteur et outils permis
│   │   ├── rag/                     # Recherche et références
│   │   ├── llm/                     # Adaptateurs de fournisseurs
│   │   └── prompts/                 # Prompts versionnés
│   ├── migrations/
│   └── tests/
│       ├── unit/
│       └── integration/
├── content/
│   ├── README.md
│   ├── curricula/                   # Notions, objectifs et prérequis
│   ├── resources/                   # Ressources autorisées
│   ├── exercises/                   # Exercices, indices et solutions
│   └── schemas/                     # Formats de contenus à définir
├── evaluation/
│   ├── README.md
│   ├── datasets/
│   │   ├── questions/
│   │   ├── corrections/
│   │   ├── adaptation/
│   │   └── security/
│   ├── runners/                     # Outils de mesure à développer
│   └── results/                     # Sorties locales ignorées par Git
├── data/
│   └── README.md                    # Règles des données locales/privées
├── docs/
│   ├── README.md
│   ├── architecture/
│   │   └── README.md
│   ├── decisions/
│   │   ├── README.md
│   │   └── TEMPLATE.md              # Modèle de décision technique
│   ├── design/                      # Futures maquettes
│   ├── guides/                      # Futurs guides
│   └── report/                      # Rapport et résultats relus
├── tests/
│   ├── README.md
│   ├── e2e/                         # Parcours complets
│   └── fixtures/                    # Données synthétiques de test
├── scripts/
│   └── README.md
└── deploy/
    └── README.md
```

Pour reprendre le projet dans un autre IDE, ouvrir la racine et faire lire [AGENTS.md](AGENTS.md) à l'agent. Les dossiers préparés ne représentent pas des fonctionnalités terminées.

## Documentation

- [Cahier des charges](CAHIER_DES_CHARGES_AGENTICTUTOR.md) : exigences, périmètre et critères de recette.
- [Guide de lancement et d'authentification](docs/guides/milestone-2-auth.md).
- [Guide frontend](frontend/README.md) et [guide backend](backend/README.md) : commandes de test et détails techniques.
- [Architecture](docs/architecture/README.md) et [décisions techniques](docs/decisions/README.md).

Mainteneur : [ziko247](https://github.com/ziko247). La licence reste à définir avant toute réutilisation ou distribution.

Le frontend utilise Lenis pour le défilement. Il se désactive lorsque la réduction des animations est activée ; les commandes de lancement restent identiques.
