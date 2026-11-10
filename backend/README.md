# Backend — API et tutorat

**Statut :** dossiers réservés, aucun service exécutable. Python/FastAPI est proposé.

| Dossier | Responsabilité prévue |
|---|---|
| `app/api/` | Routes HTTP, dépendances d'authentification et validation des accès |
| `app/core/` | Configuration, sécurité, erreurs et journalisation techniques |
| `app/models/` | Modèles de persistance |
| `app/schemas/` | Contrats de requêtes/réponses et sorties structurées validées |
| `app/repositories/` | Accès à la base et transactions |
| `app/services/` | Cas d'utilisation : comptes, sessions, tentatives, contenus et signalements |
| `app/pedagogy/` | Diagnostic, maîtrise, prérequis, sélection d'activités et correction déterministe |
| `app/orchestration/` | Boucle du tuteur, transitions, outils permis et limites d'étapes |
| `app/rag/` | Préparation documentaire, recherche, contexte et références |
| `app/llm/` | Adaptateurs de fournisseurs, délais, quotas et validation des réponses |
| `app/prompts/` | Consignes et modèles de prompts versionnés |
| `migrations/` | Futures migrations de schéma, après choix de l'outil |
| `tests/unit/` | Tests des règles et composants isolés |
| `tests/integration/` | Tests API/base/index/fournisseurs simulés ou dédiés |

Flux prévu : API → services/orchestration → pédagogie, recherche et adaptateurs. Les services accèdent à la base via les repositories. Les décisions pédagogiques doivent pouvoir être testées sans appel à un LLM.

À l'initialisation : choisir les dépendances et leur verrouillage, créer le point d'entrée, documenter la configuration et ajouter les commandes vérifiées ici. Aucun `main.py`, fichier de dépendances ou outil de migration n'est fourni à ce stade.
