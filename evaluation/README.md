# Évaluation pédagogique et qualité de l'IA

**Statut :** emplacements réservés ; aucun jeu ni résultat disponible.

| Dossier | Contenu prévu |
|---|---|
| `datasets/questions/` | Questions documentaires, références et cas hors corpus |
| `datasets/corrections/` | Réponses annotées et grilles de référence |
| `datasets/adaptation/` | Profils/scénarios et actions pédagogiques attendues |
| `datasets/security/` | Cas synthétiques d'injection et de résistance aux entrées malveillantes |
| `runners/` | Futurs outils d'exécution et de calcul des métriques |
| `results/` | Résultats générés locaux, ignorés par Git sauf le marqueur de dossier |

Les objectifs de volume et seuils proposés se trouvent dans les sections 15–16 du cahier des charges. Les jeux finaux doivent rester distincts des exemples utilisés pour ajuster les prompts et les règles. Ne pas exposer ces jeux finaux au tuteur en production.

Chaque expérience devra conserver la configuration, les versions des données/prompts/modèles/règles, la date, les effectifs et la méthode de calcul. Les résultats sélectionnés, anonymisés et relus pour le rapport iront dans `docs/report/`.

Les tests techniques de l'application vont dans les dossiers de tests des composants ; ce dossier mesure surtout la qualité des explications, corrections, décisions et comparaisons au parcours fixe.
