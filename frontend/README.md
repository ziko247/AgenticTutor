# Frontend — Interface étudiant et gestionnaire

**Statut :** structure seule. React/TypeScript est proposé ; aucun outil de build installé.

| Dossier | Usage prévu |
|---|---|
| `public/` | Fichiers statiques publics, sans secrets |
| `src/app/` | Point d'entrée, navigation, fournisseurs de contexte et composition |
| `src/components/` | Composants partagés entre plusieurs parcours |
| `src/features/auth/` | Connexion et gestion de session (F01) |
| `src/features/diagnostic/` | Diagnostic initial (F02–F03) |
| `src/features/tutor/` | Conversation, sources et recommandations (F05–F07) |
| `src/features/exercises/` | Exercices, indices et corrections (F08–F10) |
| `src/features/progress/` | Profil, historique et reprise (F04, F11–F13) |
| `src/features/admin/` | Contenus, signalements et gestion des données (F14, F16–F17) |
| `src/lib/` | Client API et utilitaires communs |
| `src/types/` | Types partagés correspondant aux contrats API |
| `src/styles/` | Styles globaux et conventions visuelles |
| `tests/` | Tests techniques de l'interface |

Un composant propre à un parcours reste dans sa feature ; seuls les composants réutilisés vont dans `components/`. Les secrets, règles d'autorisation et appels aux fournisseurs de modèle restent côté serveur.

Le bootstrap, le routage et les commandes d'installation seront ajoutés après validation de la stack. Aucun `package.json` ou serveur frontend n'existe encore.
