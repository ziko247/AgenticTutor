# Données locales et générées

Ce dossier documente les emplacements locaux. Les données brutes et privées ne sont pas versionnées.

| Chemin local à créer au besoin | Usage | Git |
|---|---|---|
| `data/raw/` | Imports sources avant autorisation, nettoyage et validation | Ignoré |
| `data/private/` | Exports et données personnelles d'expérimentation autorisées | Ignoré |
| `data/processed/` | Artefacts de préparation et index intermédiaires | Ignoré |

Ces sous-dossiers sont volontairement absents du dépôt initial. Les scripts futurs devront les créer au besoin. Les contenus publiables validés vont dans `content/`, les exemples de tests synthétiques dans `tests/fixtures/` et les jeux d'évaluation partageables dans `evaluation/datasets/`.

Ne jamais utiliser Git comme sauvegarde de données d'étudiants. Définir accès, consentement éventuel, conservation et suppression avant toute collecte réelle.
