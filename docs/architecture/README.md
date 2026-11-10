# Architecture de départ

Cette structure prépare une application web avec un backend modulaire unique. Elle ne crée pas de microservices et ne verrouille pas encore les technologies.

## Responsabilités

1. Le navigateur appelle uniquement l'API applicative.
2. L'API contrôle l'identité, les permissions et les formats.
3. Les services exécutent les cas d'utilisation et délèguent la persistance aux repositories.
4. L'orchestrateur choisit une action dans une boucle bornée.
5. Le module pédagogie calcule la maîtrise et applique les règles de sélection/correction.
6. Le module RAG récupère les passages autorisés et construit les références.
7. L'adaptateur LLM encapsule le fournisseur, les délais et la consommation.
8. Les sorties sont validées avant toute mise à jour de tentative ou de profil.

La base relationnelle et l'index seront des services d'infrastructure, pas des sources accessibles depuis le navigateur. Les ressources retirées ne devront plus apparaître dans les nouvelles recherches.

## Séparation des données

- `content/` : matériaux d'apprentissage validés et publiables.
- `tests/fixtures/` : petits exemples synthétiques pour les tests techniques.
- `evaluation/datasets/` : cas de mesure séparés de l'ajustement des prompts.
- `data/` : données locales brutes, privées et artefacts générés ignorés.

Les lots finaux d'évaluation ne doivent pas être indexés comme ressources pédagogiques.

## Conception restante

Modèle conceptuel détaillé, schéma de base, contrats API, états de l'orchestrateur, calcul de maîtrise et politique de déploiement restent à concevoir. Consigner les choix acceptés dans `docs/decisions/`, puis actualiser cette page et les README concernés.
