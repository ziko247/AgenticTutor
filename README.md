# AgenticTutor

**Tuteur pédagogique intelligent qui adapte ses explications et exercices au niveau de l'étudiant.**

Projet de fin d'année en Data Science et Intelligence artificielle. AgenticTutor vise à accompagner l'étudiant dans un cycle continu : identifier ses acquis, expliquer une notion, proposer une activité, analyser sa réponse et adapter la suite du parcours.

> **État actuel : cadrage et documentation.** L'application n'est pas encore développée. Toutes les fonctionnalités ci-dessous sont prévues, sauf mention contraire. Le domaine pilote, les technologies et le calendrier restent à valider avec l'encadrant.

## Navigation

- [Vision et périmètre](#vision-et-périmètre)
- [Fonctionnement prévu](#fonctionnement-prévu)
- [Checklist des fonctionnalités](#checklist-des-fonctionnalités)
- [Étapes du projet](#étapes-du-projet)
- [Architecture envisagée](#architecture-envisagée)
- [Données et évaluation](#données-et-évaluation)
- [Installation et utilisation](#installation-et-utilisation)
- [Organisation et suivi](#organisation-et-suivi)
- [Documentation et licence](#documentation-et-licence)

## Vision et périmètre

Le tuteur doit aider l'étudiant à comprendre ses erreurs et à progresser à son rythme. Son profil de maîtrise sera une estimation révisable, construite à partir de ses réponses, des difficultés rencontrées et de l'aide demandée.

| Élément | Proposition de départ |
|---|---|
| Public cible | Étudiants débutants du supérieur en informatique |
| Domaine pilote | Algorithmique et bases de Python |
| Notions | Variables, conditions, boucles, fonctions et listes |
| Langue | Français |
| Support | Application web adaptée aux ordinateurs et aux mobiles |
| Objectif MVP | Un parcours complet, du diagnostic au suivi de progression |
| Contenu initial | 10 à 15 questions de diagnostic et au moins 50 exercices relus |
| Planning indicatif | 16 semaines, à ajuster au calendrier du PFA |

Le [cahier des charges](CAHIER_DES_CHARGES_AGENTICTUTOR.md) est la référence détaillée pour le périmètre, les exigences et les critères de recette.

## Fonctionnement prévu

1. **Diagnostiquer** les acquis par notion avec quelques questions ciblées.
2. **Planifier** une activité selon les prérequis et les observations disponibles.
3. **Expliquer** à partir des ressources pédagogiques validées, avec des sources consultables.
4. **Entraîner** avec un exercice adapté et des indices graduels.
5. **Évaluer** la réponse avec une correction de référence et signaler l'incertitude.
6. **Adapter** le profil et la prochaine activité, puis sauvegarder la progression.

La dimension **agentique** vient de cette boucle de décision contrôlée. Un orchestrateur choisira parmi des actions autorisées : expliquer, vérifier un prérequis, proposer un exercice, consolider ou réévaluer. Les règles, outils et budgets seront bornés, et les décisions seront traçables. Des modules spécialisés ne nécessitent pas chacun un agent autonome.

**Exemple de parcours attendu :** un étudiant échoue à plusieurs exercices de boucles. Le tuteur vérifie un prérequis, propose une explication plus simple et un exercice guidé, puis réévalue la notion avant d'augmenter la difficulté.

## Checklist des fonctionnalités

**Lecture :** `[x]` = réalisé et vérifié ; `[ ]` = reste à faire. Une case est cochée lorsque le critère du cahier des charges est satisfait. Les identifiants `Fxx` renvoient à sa section 7. Les extensions restent distinctes du MVP et ne conditionnent pas sa livraison.

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

### Hors périmètre initial

Le MVP ne prévoit pas l'entraînement d'un grand modèle depuis zéro, la notation officielle autonome, le diagnostic émotionnel, l'exécution libre de code, la navigation autonome sur Internet ou une application mobile native.

## Étapes du projet

Les documents créés sont cochés comme rédigés ; cela ne signifie pas qu'ils sont validés par l'encadrant.

### 1. Cadrage — semaines 1–2

- [x] Rédiger une proposition complète de cahier des charges.
- [x] Créer le README et les checklists de progression.
- [ ] Faire valider le public, le domaine pilote et les notions.
- [ ] Confirmer l'équipe, les dates et les livrables scolaires.
- [ ] Identifier les ressources autorisées et le référent pédagogique.
- [ ] Fixer le budget et les critères de réussite.

### 2. Conception — semaines 3–4

- [ ] Réaliser les maquettes des parcours étudiant et gestionnaire.
- [ ] Définir le modèle de données et le graphe des prérequis.
- [ ] Définir la politique de maîtrise et les règles d'adaptation.
- [ ] Comparer les modèles sur la qualité, la latence, le coût et la confidentialité.
- [ ] Valider la stack et l'architecture.
- [ ] Préparer un premier lot de ressources et d'exercices relus.

### 3. Socle applicatif — semaines 5–6

- [ ] Mettre en place l'interface, l'API et la base de données.
- [ ] Implémenter les comptes, rôles et contrôles d'accès.
- [ ] Livrer le parcours diagnostic → profil.
- [ ] Implémenter les tentatives et les corrections déterministes.

### 4. Tutoriel contextualisé — semaines 7–8

- [ ] Préparer et indexer les ressources validées.
- [ ] Livrer les explications avec sources et la reformulation.
- [ ] Gérer les questions hors corpus et les défaillances du fournisseur.

### 5. MVP adaptatif — semaines 9–10

- [ ] Intégrer la sélection d'activités, les indices et l'actualisation du profil.
- [ ] Intégrer les journaux de décision et le tableau de progression.
- [ ] Finaliser la gestion des contenus et des signalements.
- [ ] Finaliser la banque d'au moins 50 exercices.
- [ ] Démontrer un parcours complet avant de commencer les extensions.

### 6. Validation — semaines 11–14

- [ ] Figer les jeux d'évaluation distincts des données de développement.
- [ ] Exécuter les tests fonctionnels, de sécurité et de reprise.
- [ ] Mesurer la qualité des sources, des corrections et de l'adaptation.
- [ ] Mesurer les latences et le coût de séances représentatives.
- [ ] Comparer au parcours fixe avec les mêmes ressources.
- [ ] Réaliser un pilote avec volontaires si les conditions le permettent.
- [ ] Analyser les résultats et documenter les limites.

### 7. Livraison — semaines 15–16

- [ ] Corriger les anomalies bloquantes.
- [ ] Documenter l'installation, l'utilisation et la gestion des contenus.
- [ ] Préparer les comptes et données de démonstration.
- [ ] Finaliser le rapport, les diapositives et la vidéo si demandée.
- [ ] Vérifier la reproductibilité et préparer la version finale.

## Architecture envisagée

```text
Interface web
    |
    v
API applicative — authentification et autorisations
    |
    v
Orchestrateur pédagogique
    |-- Diagnostic et profil de maîtrise
    |-- Planification et règles d'adaptation
    |-- Recherche dans le corpus validé
    |-- Explications via un modèle de langage
    |-- Sélection d'exercices et correction
    `-- Journalisation, quotas et mesures
    |
    |-- Base relationnelle : comptes, progression, tentatives
    `-- Corpus et index documentaire
```

| Composant | Technologie proposée | Statut |
|---|---|---|
| Interface | React et TypeScript | À valider |
| API | Python et FastAPI | À valider |
| Données | PostgreSQL | À valider |
| Recherche documentaire | Recherche textuelle et/ou vectorielle | À comparer |
| Orchestration | Machine à états explicite | À concevoir |
| Modèle de langage | Modèle existant, API ou hébergement local | À comparer |
| Déploiement | Services conteneurisés | À valider |

Les appels au modèle et les secrets resteront côté serveur. Les règles d'autorisation ne seront jamais confiées au modèle. Le choix d'un fournisseur et les versions des dépendances seront documentés lors de la conception.

## Données et évaluation

Le corpus devra être autorisé, relu et versionné. Les exercices disposeront d'une solution de référence, de métadonnées et d'indices graduels. Le développement commencera avec des données synthétiques. Les conditions de collecte, de conservation et d'utilisation de données réelles seront définies avec l'établissement avant un pilote.

| Lot prévu | Volume minimal proposé | Finalité |
|---|---|---|
| Questions documentaires | 60 | Pertinence de la recherche, exactitude et abstention |
| Réponses d'exercices annotées | 100 | Fiabilité des corrections, par catégorie de réponse |
| Scénarios d'adaptation | 20 | Cohérence des décisions et respect des prérequis |
| Pilote utilisateur, si possible | 10 à 20 volontaires | Utilisabilité et tendances d'apprentissage |

Objectifs proposés : au moins 85 % d'explications correctes et étayées, 90 % d'accord sur les corrections encadrées et 90 % d'actions d'adaptation compatibles avec les scénarios de référence. Ces seuils restent à valider avant l'évaluation finale ; **ils ne sont pas des résultats obtenus**.

Le parcours adaptatif sera comparé à un parcours fixe avec les mêmes ressources. Sans expérimentation auprès d'étudiants, aucun gain réel d'apprentissage ne sera revendiqué. Les métriques détaillées et les scénarios de recette figurent aux sections 15 et 16 du cahier des charges.

## Installation et utilisation

Le dépôt contient actuellement la documentation du projet. Il n'y a pas encore d'application à lancer, de dépendances à installer ou de démonstration en ligne.

Pour récupérer les documents une fois le dépôt GitHub créé :

```bash
git clone https://github.com/ziko247/AgenticTutor.git
cd AgenticTutor
```

Les commandes d'installation, variables d'environnement et instructions de lancement seront ajoutées lorsque la stack aura été validée et que le premier parcours fonctionnera. Les clés privées, fichiers `.env` et données personnelles ne doivent pas être committés.

## Organisation et suivi

Fichiers présents à l'initialisation :

```text
AgenticTutor/
├── README.md
├── CAHIER_DES_CHARGES_AGENTICTUTOR.md
├── .gitignore
└── .gitattributes
```

Pour suivre le travail :

1. Choisir une tâche non cochée et créer une issue GitHub avec son identifiant, par exemple `F03 — Diagnostic initial`.
2. Décrire le comportement attendu et le critère de recette de cette tâche.
3. Travailler sur une branche dédiée, par exemple `feat/F03-diagnostic`.
4. Vérifier le comportement et conserver une preuve utile : test, capture ou mesure.
5. Cocher la case correspondante après intégration et validation, puis fermer l'issue associée.

Les checklists sont mises à jour manuellement. Les identifiants `Fxx` assurent la correspondance avec le cahier des charges. Une nouvelle idée est d'abord discutée et classée dans le MVP ou les extensions avant d'être ajoutée au périmètre.

**Définition de terminé :** comportement implémenté, critère de recette satisfait, contrôles pertinents effectués, documentation mise à jour et aucun secret ajouté au dépôt. La livraison du MVP exige toutes les fonctions P0, les scénarios critiques validés et un rapport d'évaluation ; les écarts doivent être documentés et examinés avec l'encadrant.

## Documentation et licence

- [Cahier des charges complet](CAHIER_DES_CHARGES_AGENTICTUTOR.md) : exigences, périmètre, architecture, évaluation, risques, budget et livrables.
- Conception détaillée, guide utilisateur et rapport d'évaluation : à rédiger.
- **Auteur / mainteneur :** [ziko247](https://github.com/ziko247).
- **Encadrant et établissement :** à compléter après confirmation.
- **Licence :** à définir avant toute réutilisation ou distribution. Aucune licence de réutilisation n'est accordée par ce README. Les ressources pédagogiques conserveront leurs licences et attributions propres.

Pour proposer une correction ou discuter du projet, ouvrir une issue dans ce dépôt. Ne pas y publier de données d'étudiants ou de secrets.
