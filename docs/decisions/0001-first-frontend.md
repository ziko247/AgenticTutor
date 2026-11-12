# 0001 — Première interface Python

- Date : 12 novembre 2026
- Statut : accepté pour cette tranche frontend
- Exigences : F01–F03, interface et prévisualisation uniquement

## Contexte et décision

Le dépôt ne contenait aucun framework installé. À la demande de l'utilisateur, utiliser Next.js, TypeScript et Tailwind CSS. Le premier domaine est Python ; les premières pages sont la landing, l'authentification et l'onboarding.

Conserver les dossiers frontend existants. Utiliser App Router pour les routes, des composants serveur pour le contenu statique et des composants client pour les interactions. Les tokens Hallmark sont partagés entre marketing et formulaires.

## Limites

Aucun fournisseur d'authentification n'existait : les formulaires restent explicitement des aperçus sans réseau. Le diagnostic de 20 questions est local, sans API ni profil serveur. Le backend, PostgreSQL et le fournisseur de modèle restent à choisir/implémenter. Cette décision ne valide pas les seuils pédagogiques ni l'efficacité du tutorat.

