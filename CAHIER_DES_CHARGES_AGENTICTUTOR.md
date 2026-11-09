# Cahier des charges — AgenticTutor

**Titre complet :** AgenticTutor : tuteur pédagogique intelligent qui adapte ses explications et exercices au niveau de l'étudiant.

| Élément | Valeur |
|---|---|
| Nature du projet | Projet de fin d'année (PFA) — Data Science et Intelligence artificielle |
| Version | 1.0 — Proposition initiale à valider avec l'encadrant |
| Date | 9 novembre 2026 |
| Porteur du projet | À compléter |
| Établissement et filière | À compléter |
| Encadrant | À compléter |
| Durée prévisionnelle | 16 semaines, à adapter au calendrier officiel |
| Statut | Document de cadrage proposé ; aucun développement engagé |

> Ce document décrit une proposition complète de projet. Les technologies, le domaine pédagogique, les volumes, les objectifs chiffrés et le calendrier constituent des hypothèses de travail, et non des contraintes déjà imposées par l'établissement.

## 1. Contexte et justification

Les étudiants d'un même cursus présentent des niveaux, des prérequis et des rythmes d'apprentissage différents. Une explication identique ou une série d'exercices uniforme peut être trop simple pour certains et trop difficile pour d'autres.

Un assistant conversationnel peut répondre à des questions, mais une réponse ponctuelle ne suffit pas à organiser un apprentissage : il faut identifier les lacunes, choisir une activité pertinente, évaluer la compréhension et ajuster la suite du parcours.

AgenticTutor vise à proposer un accompagnement pédagogique personnalisé, fondé sur des ressources validées et sur l'historique des réponses de l'étudiant. Le système assiste l'apprentissage ; les décisions pédagogiques importantes et la validation des contenus restent sous la responsabilité humaine.

## 2. Problématique

**Comment concevoir un tuteur pédagogique capable d'estimer le niveau d'un étudiant, d'adapter ses explications et ses exercices, puis de réviser son accompagnement à partir des résultats observés, tout en maîtrisant la fiabilité des réponses et le coût de fonctionnement ?**

Le projet devra traiter les difficultés suivantes :

- Estimer le niveau par notion avec peu de réponses initiales.
- Distinguer une erreur ponctuelle d'une lacune sur un prérequis.
- Adapter la difficulté sans enfermer l'étudiant dans un niveau fixe.
- Produire des explications cohérentes avec les ressources du cours.
- Évaluer les réponses sans considérer le modèle génératif comme une source infaillible.
- Vérifier l'intérêt de l'adaptation par rapport à un parcours fixe.

## 3. Objectifs

### 3.1 Objectif général

Concevoir et évaluer une application web de tutorat intelligent qui personnalise l'accompagnement d'un étudiant dans un domaine pédagogique limité et clairement défini.

### 3.2 Objectifs spécifiques

1. Établir un diagnostic initial par notion.
2. Maintenir un profil de progression compréhensible et actualisable.
3. Fournir des explications de différents niveaux de détail et des exemples adaptés.
4. Sélectionner des exercices selon les prérequis, les difficultés et les résultats récents.
5. Proposer des indices graduels et une correction expliquée.
6. Organiser une boucle de décision pédagogique traçable.
7. Appuyer les explications sur un corpus de cours validé.
8. Mesurer la qualité pédagogique, la fiabilité, la latence et le coût du système.

### 3.3 Résultats attendus

- Un prototype fonctionnel démontrable de bout en bout.
- Un corpus pédagogique versionné et une banque d'exercices corrigés.
- Une politique d'adaptation explicite et testable.
- Une comparaison expérimentale avec un parcours non adaptatif.
- Une documentation permettant de reproduire les principales expériences.

## 4. Hypothèses et décisions de cadrage

| Sujet | Proposition de départ | Validation nécessaire |
|---|---|---|
| Public cible | Étudiants débutants du supérieur en informatique | Confirmer le niveau exact |
| Domaine pilote | Algorithmique et bases de Python | Valider avec l'encadrant |
| Notions | Variables, conditions, boucles, fonctions, listes | Ajuster au programme retenu |
| Langue | Interface et accompagnement en français | Confirmer les besoins linguistiques |
| Support | Application web utilisable sur ordinateur et mobile | Valider les contraintes de démonstration |
| Organisation | Un étudiant ou une petite équipe, sur 16 semaines | Adapter à l'effectif réel |
| Modèle d'IA | Modèle existant, accessible par API ou hébergé localement | Choisir après comparaison de qualité, coût et confidentialité |
| Données | Corpus autorisé et données de test synthétiques, puis volontaires si possible | Vérifier la disponibilité des ressources |

Ces hypothèses limitent la complexité et permettent de mesurer la qualité sur un périmètre maîtrisé. Le projet n'exige pas l'entraînement d'un grand modèle de langage depuis zéro.

## 5. Parties prenantes et rôles

| Acteur | Responsabilités et besoins |
|---|---|
| Étudiant utilisateur | Suivre un parcours, poser des questions, s'exercer et comprendre ses erreurs |
| Enseignant ou référent pédagogique | Valider les notions, ressources, exercices et critères d'évaluation |
| Administrateur | Gérer l'accès, publier les contenus validés et superviser les incidents techniques |
| Équipe projet | Concevoir, développer, tester, documenter et évaluer le prototype |
| Encadrant du PFA | Valider le périmètre, suivre les jalons et examiner les résultats |

Pour le MVP, les fonctions de référent pédagogique et d'administrateur peuvent être regroupées dans un seul rôle de gestionnaire.

## 6. Périmètre

### 6.1 Version minimale attendue — MVP

- Authentification et séparation des accès étudiant/gestionnaire.
- Un seul domaine pédagogique, organisé en cinq notions et leurs prérequis.
- Diagnostic initial de 10 à 15 questions couvrant les notions du domaine.
- Profil de maîtrise par notion et historique des activités.
- Conversation pédagogique contextualisée par le cours et la progression.
- Banque d'au moins 50 exercices relus, avec corrections et métadonnées.
- Sélection adaptative d'exercices et d'indices.
- Correction des réponses fermées et des réponses courtes encadrées.
- Tableau de bord de progression pour l'étudiant.
- Consultation des sessions et gestion simple des contenus par le gestionnaire.
- Journal des décisions du tuteur et mesures de qualité/coût.

### 6.2 Extensions possibles après validation du MVP

- Génération de variantes d'exercices avec validation avant publication.
- Révision espacée et rappels de notions.
- Tableau de bord enseignant par groupe.
- Exécution de code étudiant dans un environnement isolé.
- Support d'un second domaine ou d'une seconde langue.
- Adaptation de l'accessibilité et interactions vocales.

### 6.3 Hors périmètre initial

- Couverture de toutes les disciplines et de tous les niveaux scolaires.
- Entraînement d'un grand modèle de langage à partir de zéro.
- Attribution autonome de notes officielles ou décisions d'orientation.
- Diagnostic psychologique, détection des émotions ou profilage sensible.
- Exécution libre de code ou navigation autonome sur Internet par le tuteur.
- Application mobile native et intégration complète à un ENT/LMS.
- Garantie d'efficacité pédagogique à grande échelle à partir d'un simple test pilote.

## 7. Exigences fonctionnelles

**Priorités :** P0 = indispensable au MVP ; P1 = souhaitable si le MVP est validé ; P2 = extension.

| ID | Exigence | Priorité | Critère de recette |
|---|---|---|---|
| F01 | Créer un compte, se connecter et se déconnecter | P0 | Une session valide donne accès aux seules données autorisées |
| F02 | Présenter les objectifs du domaine et le fonctionnement du tuteur | P0 | L'étudiant peut commencer un diagnostic ou reprendre son parcours |
| F03 | Faire passer un diagnostic initial | P0 | Les réponses produisent une première estimation pour chaque notion couverte |
| F04 | Afficher un profil par notion | P0 | Niveau estimé, nombre d'observations et date de mise à jour sont consultables |
| F05 | Répondre aux questions à partir du corpus validé | P0 | Les explications fondées sur le cours indiquent leurs ressources d'appui |
| F06 | Adapter la forme des explications | P0 | L'étudiant peut demander une reformulation, un exemple ou une explication plus détaillée |
| F07 | Sélectionner l'activité suivante | P0 | Le choix tient compte des prérequis, de la maîtrise estimée et des résultats récents |
| F08 | Présenter des exercices de difficulté progressive | P0 | Chaque exercice possède une notion, une difficulté et une correction de référence |
| F09 | Fournir des indices graduels | P0 | Les indices peuvent être demandés avant l'affichage de la correction complète |
| F10 | Corriger et expliquer une réponse | P0 | Le résultat distingue réponse correcte, partielle, incorrecte ou non évaluable |
| F11 | Actualiser le profil après une activité | P0 | La mise à jour et ses observations justificatives sont enregistrées |
| F12 | Sauvegarder et reprendre une session | P0 | Les activités terminées restent disponibles après reconnexion |
| F13 | Afficher la progression | P0 | L'étudiant visualise les notions travaillées et les prochaines étapes proposées |
| F14 | Administrer le corpus et la banque d'exercices | P0 | Un gestionnaire peut ajouter, modifier, valider et retirer un contenu |
| F15 | Tracer les décisions pédagogiques | P0 | Chaque décision conserve l'action, sa justification courte et les données utiles |
| F16 | Signaler une réponse problématique | P0 | Un signalement est lié à la réponse concernée et visible du gestionnaire |
| F17 | Consulter ou demander la suppression de ses données | P0 | Le parcours prévu est accessible et vérifiable sur un compte de test |
| F18 | Générer des variantes d'exercices | P1 | Une variante est vérifiée puis validée avant d'entrer dans la banque publiée |
| F19 | Proposer une révision espacée | P1 | Une notion peut être réévaluée après un délai défini |
| F20 | Donner une vue de groupe au référent | P2 | Seuls les groupes autorisés sont consultables |

## 8. Parcours et cas d'utilisation

### 8.1 Première utilisation

1. L'étudiant se connecte et découvre les objectifs du domaine.
2. Il consulte l'information sur les données utilisées et les limites du tuteur.
3. Il répond au diagnostic initial.
4. Le système affiche une estimation par notion, en signalant les estimations encore fragiles.
5. Le tuteur propose une première activité avec une justification simple.

### 8.2 Séance d'apprentissage

1. L'étudiant choisit une notion ou accepte la recommandation du tuteur.
2. Le tuteur présente une explication appuyée sur les ressources du cours.
3. L'étudiant pose une question ou commence un exercice.
4. Il peut demander un ou plusieurs indices.
5. Le système évalue sa réponse selon la méthode prévue pour l'exercice.
6. Le tuteur explique l'erreur ou confirme le raisonnement correct.
7. Le profil est actualisé et l'activité suivante est proposée.
8. L'étudiant peut arrêter la séance et retrouver sa progression ultérieurement.

### 8.3 Difficulté persistante

Après plusieurs erreurs sur une notion, le tuteur recherche un prérequis possiblement non maîtrisé. Il propose une question de vérification ou une explication plus élémentaire. Une erreur unique ne suffit pas à conclure à une lacune durable.

### 8.4 Réponse non fiable ou hors périmètre

Si le corpus ne permet pas de répondre ou si la correction reste incertaine, le tuteur l'indique. Il demande une précision, propose une ressource disponible ou invite à consulter le référent. Il ne met pas à jour la maîtrise à partir d'une correction jugée non fiable.

### 8.5 Publication d'un contenu

Le gestionnaire importe ou rédige une ressource, renseigne ses métadonnées, vérifie son contenu puis la publie. Les ressources en brouillon ne sont pas utilisées par le tuteur.

## 9. Modèle pédagogique et adaptation

### 9.1 Représentation des connaissances

Le domaine est représenté par un ensemble de notions reliées par des prérequis. Exemple : variables → conditions → boucles ; variables et conditions → fonctions ; boucles → parcours de listes. Ce graphe doit être relu par le référent pédagogique.

Chaque notion comporte des objectifs observables, des ressources, des exercices et des erreurs fréquentes. Chaque exercice possède une correction de référence et, lorsque cela est pertinent, une grille de correction partielle.

### 9.2 Profil de l'étudiant

Le profil contient, par notion :

- Un score de maîtrise estimé entre 0 et 100.
- Une catégorie de lecture : à découvrir, en acquisition ou à consolider/maîtrisée selon les seuils retenus.
- Le nombre et la diversité des observations disponibles.
- Les réussites, erreurs récurrentes et recours aux indices.
- Les dates des dernières activités.

Une notion sans observation reste « non évaluée ». Le score représente une estimation du système, pas une mesure certaine des compétences.

### 9.3 Politique initiale d'adaptation

Pour le MVP, une politique explicite à règles sera privilégiée afin de pouvoir expliquer et tester les décisions :

| Observation | Action proposée |
|---|---|
| Aucune donnée sur une notion | Question diagnostique courte |
| Prérequis fragile | Vérification puis révision du prérequis |
| Erreurs répétées | Reformulation, exemple guidé et exercice plus simple |
| Réussite avec plusieurs indices | Exercice de consolidation comparable |
| Réussites répétées sans indice | Augmentation progressive de difficulté |
| Réussites sur plusieurs formes d'exercices | Validation provisoire puis réévaluation ultérieure |
| Réponse ambiguë ou correction incertaine | Demande de précision, sans mise à jour automatique du niveau |

Les seuils, pondérations et conditions exactes seront versionnés et fixés avant l'évaluation finale. Le temps de réponse pourra être observé, mais ne devra pas déterminer seul la maîtrise : un délai long peut avoir de nombreuses causes.

### 9.4 Choix du modèle de suivi

Le point de départ sera une mise à jour simple, bornée et documentée, tenant compte de la difficulté et de l'aide utilisée. Une méthode de suivi probabiliste pourra être comparée si les données et le calendrier le permettent. Le choix final devra être justifié par la stabilité, l'interprétabilité et les résultats mesurés.

## 10. Dimension agentique

### 10.1 Définition retenue

Le caractère agentique repose sur une boucle contrôlée : **observer → choisir une action pédagogique → utiliser un outil autorisé → évaluer le résultat → actualiser le parcours**.

Le système poursuit un objectif explicite : aider l'étudiant à atteindre un objectif d'apprentissage. Il choisit parmi un ensemble limité d'actions et révise son choix à partir des réponses obtenues.

### 10.2 Organisation proposée

Un orchestrateur pédagogique unique coordonne des modules spécialisés :

| Module | Responsabilité |
|---|---|
| Diagnostic | Exploiter les réponses initiales et identifier les observations manquantes |
| Planification | Choisir entre expliquer, vérifier un prérequis, entraîner, consolider ou réévaluer |
| Explication | Produire une explication fondée sur les ressources récupérées |
| Exercices | Sélectionner une activité compatible avec les objectifs et la difficulté |
| Évaluation | Corriger, qualifier l'incertitude et proposer un retour pédagogique |
| Profil et suivi | Mettre à jour les observations et préparer la prochaine décision |

Ces modules ne nécessitent pas chacun un agent autonome ou un appel au modèle. Une architecture multi-agent distincte reste une option expérimentale si elle apporte un bénéfice mesurable.

### 10.3 Outils et limites d'autonomie

- Outils autorisés : recherche dans le corpus, lecture du profil de l'étudiant connecté, sélection d'exercices publiés et enregistrement d'activités validées.
- Les autorisations sont contrôlées côté serveur ; elles ne sont pas décidées par le modèle.
- Une sortie du modèle doit respecter un schéma attendu avant toute action ou écriture.
- Le nombre d'étapes et d'appels par interaction est borné, avec arrêt sur erreur ou dépassement de budget.
- Le journal conserve les actions, résultats et justifications synthétiques utiles à l'audit ; il n'exige pas l'enregistrement d'un raisonnement interne détaillé.
- L'étudiant peut refuser une recommandation et choisir une autre notion accessible.

## 11. Corpus, exercices et données

### 11.1 Corpus pédagogique

Le corpus comprend des supports dont l'utilisation est autorisée : fiches rédigées pour le projet, cours fournis avec accord ou ressources sous licence compatible. Chaque ressource conserve un titre, une origine, une version, une notion associée et un statut de validation.

La préparation comprend la vérification du texte extrait, le découpage par unité pédagogique et l'indexation. Les ressources retirées doivent être exclues de la recherche. Les PDF numérisés nécessitant une reconnaissance optique de caractères pourront être exclus du MVP pour limiter la complexité.

### 11.2 Banque d'exercices

Objectif proposé : au moins 50 exercices, avec une couverture des cinq notions et de trois niveaux de difficulté. La distribution exacte sera validée avec le référent.

Métadonnées minimales : identifiant, notion, prérequis, difficulté, type de réponse, énoncé, solution, grille de correction, indices graduels, erreurs fréquentes, origine, version et statut de validation.

Pour le MVP, les activités porteront sur des QCM, des réponses numériques ou textuelles encadrées, de la lecture de code et des questions courtes. Les réponses déterministes utiliseront des vérifications déterministes. L'évaluation générative des réponses ouvertes restera encadrée par une grille et un mécanisme d'abstention.

### 11.3 Données d'utilisation

- Identité minimale du compte et rôle.
- Objectifs déclarés et progression par notion.
- Sessions, réponses, indices demandés et corrections.
- Versions des ressources, exercices et règles utilisées.
- Métadonnées techniques : durée, nombre d'appels, consommation et erreurs.
- Signalements des utilisateurs.

Les mots de passe sont stockés sous forme de condensats adaptés. Les secrets d'API ne sont jamais envoyés au navigateur. Les journaux techniques évitent le contenu personnel lorsqu'il n'est pas nécessaire.

### 11.4 Modèle de données conceptuel

| Entité | Relations principales |
|---|---|
| Utilisateur | Possède des sessions et des estimations de maîtrise |
| Notion | Possède des prérequis, ressources et exercices |
| Ressource | Est associée à des notions et à des versions indexées |
| Exercice | Possède une correction, des indices et des tentatives |
| Tentative | Relie un étudiant, un exercice versionné et une évaluation |
| Maîtrise | Relie un étudiant à une notion et aux observations justificatives |
| Session | Regroupe messages, activités et décisions pédagogiques |
| Décision | Conserve l'action choisie, les entrées utiles et le résultat |
| Signalement | Relie un utilisateur à un contenu ou une réponse problématique |

## 12. Architecture technique envisagée

### 12.1 Vue d'ensemble

**Interface web → API applicative → orchestrateur pédagogique → modules de recherche, d'évaluation et de suivi.**

L'API accède à une base relationnelle pour les comptes et la progression, à un index de recherche pour le corpus et à un fournisseur de modèle de langage. Les appels au modèle passent par le serveur afin de centraliser les limites, les contrôles et les mesures.

### 12.2 Technologies proposées

| Composant | Option de départ | Motif du choix |
|---|---|---|
| Interface | React avec TypeScript | Interface conversationnelle et tableaux de progression |
| API | Python avec FastAPI | Proximité avec les outils d'IA et validation des entrées |
| Base de données | PostgreSQL | Relations, historique et intégrité des données |
| Recherche documentaire | Recherche textuelle et/ou vectorielle, extension à déterminer | Retrouver les passages utiles du corpus |
| Orchestration | Machine à états explicite ; bibliothèque spécialisée si nécessaire | Contrôle des transitions et traçabilité |
| Modèle de langage | Modèle existant choisi après benchmark | Qualité en français, coût, latence et disponibilité |
| Déploiement | Conteneurs pour les services, environnement de démonstration dédié | Reproductibilité de l'installation |
| Tests | Outils de tests backend, frontend et scénarios de bout en bout | Vérification des parcours critiques |

Ces choix devront être vérifiés au démarrage : compatibilité, licences, versions maintenues, hébergement et budget. Une solution plus simple pourra être retenue si elle satisfait les mêmes critères.

### 12.3 Réponses fondées sur les documents

La recherche documentaire récupère des passages pertinents avant la génération de l'explication. La réponse indique les ressources utilisées. En l'absence de passages suffisants, le système signale la limite plutôt que d'inventer une référence.

La pertinence de la recherche et la fidélité de l'explication seront évaluées séparément. Une citation affichée ne constitue pas, à elle seule, une preuve que la réponse est correcte.

### 12.4 Gestion des défaillances

- Indisponibilité du modèle : message explicite et accès maintenu aux ressources et exercices disponibles.
- Dépassement du délai : arrêt contrôlé et possibilité de réessayer sans dupliquer une tentative.
- Sortie invalide : validation, tentative de réparation bornée ou abandon de l'action.
- Échec de sauvegarde : aucune confirmation de progression tant que l'écriture n'est pas validée.
- Contexte trop long : sélection des informations pertinentes et résumé contrôlé des sessions précédentes.

## 13. Exigences non fonctionnelles

Les seuils suivants sont des objectifs de recette proposés, à confirmer après une première mesure sur l'environnement retenu.

| ID | Exigence | Objectif de validation |
|---|---|---|
| NF01 | Réactivité des opérations sans IA | 95 % des réponses en moins de 1 seconde sous 10 sessions simultanées sur l'environnement documenté |
| NF02 | Délai des réponses avec IA | 95 % des réponses complètes en moins de 15 secondes sur un lot représentatif, fournisseur et charge précisés |
| NF03 | Reprise des activités | Aucune tentative validée perdue dans les scénarios de reconnexion et de redémarrage testés |
| NF04 | Contrôle d'accès | Tous les tests d'accès croisé entre comptes sont refusés |
| NF05 | Utilisabilité | Les parcours principaux sont réalisables sans assistance lors du test utilisateur |
| NF06 | Accessibilité | Navigation clavier, libellés explicites, contraste lisible et absence d'information portée uniquement par la couleur |
| NF07 | Compatibilité | Parcours principal validé sur deux navigateurs récents et une largeur mobile |
| NF08 | Maintenabilité | Séparation des règles pédagogiques, accès aux données, interface et appels au modèle |
| NF09 | Reproductibilité | Installation et scénario de démonstration reproductibles à partir de la documentation |
| NF10 | Observabilité | Latence, erreurs, appels et consommation mesurés par interaction |
| NF11 | Maîtrise des coûts | Quotas par session, plafond global configurable et comportement explicite quand le plafond est atteint |
| NF12 | Traçabilité | Chaque évaluation retrouve la version de l'exercice, la grille et la politique d'adaptation utilisées |

## 14. Sécurité, confidentialité et limites pédagogiques

### 14.1 Contrôles techniques

- Vérification des rôles et de la propriété des données à chaque accès serveur.
- Validation des entrées, limitation des requêtes et restriction des formats importés.
- Affichage sécurisé du contenu produit par le modèle et du contenu utilisateur.
- Protection des secrets par configuration serveur et exclusion des dépôts de sources.
- Sauvegardes et procédure de restauration testée sur des données de démonstration.
- Traitement des ressources et messages comme des données non fiables : une instruction présente dans un document ne doit pas modifier les autorisations du tuteur.
- Aucun outil d'exécution de code dans le MVP ; une extension éventuelle exigera une isolation et des limites de ressources dédiées.

### 14.2 Gestion des données personnelles

Le projet privilégie des données synthétiques pendant le développement. Avant tout test avec des étudiants réels, les modalités de participation, l'information fournie, la durée de conservation, les accès et les éventuels transferts à un fournisseur externe devront être définis avec l'établissement.

Les extractions utilisées pour le rapport seront anonymisées autant que possible. Une durée de conservation sera fixée avant la collecte. La suppression devra couvrir la base active et prévoir le traitement des sauvegardes selon leur cycle de rotation documenté.

### 14.3 Précautions pédagogiques

- Présenter le niveau comme une estimation révisable.
- Encourager la réflexion et proposer des indices avant la solution complète.
- Ne pas inférer une intelligence générale, une capacité définitive ou un état émotionnel.
- Permettre de signaler une correction et de consulter les ressources originales.
- Afficher les limites du tuteur et maintenir la possibilité de recourir à un enseignant.

## 15. Évaluation et protocole expérimental

### 15.1 Questions d'évaluation

1. Le système répond-il correctement à partir des ressources du cours ?
2. Les corrections concordent-elles avec une grille validée ?
3. Les recommandations correspondent-elles aux difficultés observées ?
4. Le parcours adaptatif améliore-t-il les résultats observés par rapport à un parcours fixe ?
5. Le temps de réponse et le coût restent-ils compatibles avec l'usage envisagé ?

### 15.2 Jeux d'évaluation

- Un lot d'au moins 60 questions documentaires, réparties entre notions, comprenant des questions sans réponse dans le corpus.
- Un lot d'au moins 100 réponses d'exercices annotées : correctes, partielles, incorrectes et ambiguës.
- Un lot d'au moins 20 scénarios d'adaptation avec action attendue et justification pédagogique.
- Des scénarios de sécurité : accès entre comptes, instructions malveillantes dans un document, entrée très longue et sorties invalides du modèle.

Les lots finaux sont séparés des exemples utilisés pour ajuster les consignes et les règles. Les annotations sont revues par le référent ; une partie est annotée par deux évaluateurs si possible. Les désaccords sont documentés et arbitrés.

### 15.3 Comparaison avec une référence

La référence est un parcours fixe utilisant les mêmes ressources, la même banque d'exercices et, lorsque pertinent, le même modèle. La principale différence porte sur le choix des activités et leur adaptation.

Un pilote avec 10 à 20 étudiants volontaires est souhaité si les conditions le permettent. Les participants passent un prétest et un post-test équivalents, distincts des exercices d'entraînement. La répartition entre conditions doit limiter les différences initiales de niveau. Le temps d'activité et l'aide disponible sont documentés.

Le gain brut prétest/post-test, les distributions, la taille des groupes et les limites sont rapportés. Un petit pilote permet d'identifier des tendances et des problèmes ; il ne suffit pas à démontrer une efficacité généralisable. Si aucun participant n'est disponible, les évaluations techniques et par scénarios restent réalisables, mais aucun gain réel d'apprentissage ne sera revendiqué.

### 15.4 Indicateurs et seuils proposés

| Axe | Mesure | Objectif proposé |
|---|---|---|
| Recherche | Présence du passage pertinent dans les 5 premiers résultats sur les questions répondables | Au moins 85 % |
| Explication | Réponses jugées correctes et étayées selon une grille humaine | Au moins 85 % du lot documentaire |
| Sources | Références affichées existantes et cohérentes avec la réponse | Au moins 95 % des références auditées |
| Abstention | Signalement d'insuffisance sur les questions sans réponse disponible | Au moins 90 % des cas dédiés |
| Correction | Accord avec la catégorie de référence sur les réponses encadrées | Au moins 90 %, avec détail par catégorie |
| Adaptation | Action compatible avec la règle attendue et les prérequis | Au moins 90 % des scénarios validés |
| Utilisabilité | Satisfaction globale après les tâches de test | Moyenne d'au moins 4/5, avec effectif et dispersion publiés |
| Apprentissage | Gain prétest/post-test et comparaison entre conditions | Résultat à mesurer, sans gain minimal promis |
| Performance et coût | Latences, appels et coût moyen par séance | Respect des seuils et plafonds validés au jalon de cadrage technique |

Chaque résultat doit préciser le nombre de cas, la configuration et la méthode de calcul. Les seuils sont fixés avant l'évaluation finale ; les échecs sont analysés et ne doivent pas être masqués par une moyenne globale.

## 16. Stratégie de tests et recette

### 16.1 Niveaux de vérification

- Tests unitaires sur les règles d'adaptation, mises à jour de maîtrise, grilles déterministes et contrôles d'autorisation.
- Tests d'intégration sur les échanges entre API, base, index documentaire et fournisseur de modèle.
- Tests de bout en bout sur l'inscription, le diagnostic, la séance, la reprise et la gestion des contenus.
- Évaluations des sorties d'IA sur les lots figés, avec conservation des versions et des paramètres.
- Tests utilisateurs sur la compréhension de l'interface et des retours pédagogiques.

### 16.2 Scénarios de recette prioritaires

| ID | Scénario | Résultat attendu |
|---|---|---|
| R01 | Nouvel étudiant réalisant le diagnostic | Profil initial sauvegardé et première activité justifiée |
| R02 | Étudiant en difficulté sur les boucles | Vérification d'un prérequis ou activité simplifiée selon les observations |
| R03 | Étudiant réussissant plusieurs exercices sans aide | Difficulté augmentée selon la politique validée |
| R04 | Demande d'explication puis de reformulation | Deux formulations cohérentes avec les mêmes ressources |
| R05 | Question absente du corpus | Limite signalée, sans référence inventée |
| R06 | Réponse ouverte ambiguë | Demande de précision ou abstention, sans mise à jour injustifiée |
| R07 | Déconnexion puis reconnexion | Progression et activités terminées retrouvées |
| R08 | Accès à la session d'un autre étudiant | Requête refusée sans divulgation |
| R09 | Indisponibilité du modèle ou quota atteint | Message explicite et aucune tentative enregistrée deux fois |
| R10 | Instruction malveillante dans une ressource | Aucune modification des permissions ou exécution d'action non autorisée |
| R11 | Retrait d'une ressource publiée | Ressource exclue des nouvelles recherches, historique versionné conservé |
| R12 | Suppression d'un compte de test | Données traitées selon la procédure documentée et accès révoqué |

### 16.3 Conditions d'acceptation du MVP

Le MVP est considéré comme recevable si les fonctions P0 sont opérationnelles, les scénarios critiques passent, aucune anomalie bloquante de sécurité ou de perte de données n'est ouverte et le rapport d'évaluation est disponible. Les écarts aux objectifs de qualité doivent être explicités et acceptés par l'encadrant ; une fonctionnalité démontrable ne suffit pas à prouver sa qualité pédagogique.

## 17. Planification prévisionnelle

| Période | Travaux principaux | Livrable ou jalon |
|---|---|---|
| Semaines 1–2 | Validation du besoin, domaine, ressources, protocole et budget | Cahier des charges validé et périmètre figé |
| Semaines 3–4 | Maquettes, architecture, modèle de données, corpus et exercices initiaux | Conception validée et premier lot pédagogique relu |
| Semaines 5–6 | Comptes, diagnostic, profil et correction déterministe | Parcours diagnostic → profil fonctionnel |
| Semaines 7–8 | Recherche documentaire et explications avec sources | Assistant pédagogique contextualisé |
| Semaines 9–10 | Orchestration, adaptation, indices et gestion des contenus | MVP complet et banque d'exercices finalisée |
| Semaines 11–12 | Tests, évaluation figée, corrections et mesures de performance/coût | Version candidate et rapport technique intermédiaire |
| Semaines 13–14 | Pilote utilisateur si possible et comparaison au parcours fixe | Résultats analysés et limites documentées |
| Semaines 15–16 | Stabilisation, documentation, rapport, vidéo et soutenance | Version finale et démonstration reproductible |

La préparation du corpus commence tôt et se poursuit en parallèle. Le recrutement éventuel des volontaires est anticipé avant les semaines d'expérimentation. Les extensions ne commencent qu'après la validation du MVP.

## 18. Ressources et budget

### 18.1 Ressources humaines et matérielles

- Équipe projet : développement, préparation des données, tests et rédaction.
- Référent pédagogique : validation du corpus, des exercices et des annotations.
- Encadrant : revues aux principaux jalons.
- Ordinateur de développement ; capacité mémoire et GPU à déterminer selon le choix d'hébergement du modèle.
- Environnement de démonstration et stockage des données de test.

Un GPU dédié n'est pas une condition du projet si un service de modèle externe est retenu.

### 18.2 Postes budgétaires

| Poste | Mode d'estimation | Décision attendue |
|---|---|---|
| Modèle de langage | Nombre de séances × appels moyens × consommation moyenne × tarif du modèle | Plafond mensuel et plafond total |
| Embeddings/indexation | Volume de texte à indexer et fréquence des mises à jour | Modèle local ou service externe |
| Hébergement | Durée du déploiement et ressources nécessaires | Local, infrastructure de l'école ou hébergeur |
| Stockage et sauvegardes | Volume du corpus, journaux et sauvegardes | Quota et politique de rotation |
| Nom de domaine | Facultatif pour une démonstration académique | À décider selon le budget |

Les tarifs seront relevés au moment du choix des fournisseurs. Aucun montant n'est engagé par ce document. Un benchmark initial mesurera le coût de séances représentatives avant de fixer les quotas.

## 19. Risques et mesures de réduction

| Risque | Probabilité estimée | Impact | Mesure prévue |
|---|---|---|---|
| Explications erronées ou sources mal utilisées | Moyenne | Élevé | Corpus validé, citations vérifiées, évaluations humaines et abstention |
| Mauvaise estimation du niveau | Moyenne | Élevé | Plusieurs observations, statut non évalué et réévaluation régulière |
| Périmètre trop large | Élevée | Élevé | Un seul domaine, priorités P0 et extensions conditionnelles |
| Exercices ou ressources insuffisants | Moyenne | Élevé | Banque préparée tôt et validation pédagogique planifiée |
| Dépendance à une API ou dépassement du budget | Moyenne | Moyen à élevé | Quotas, suivi des consommations et accès dégradé aux activités existantes |
| Latence excessive | Moyenne | Moyen | Contexte limité, appels bornés et mesures sur parcours réels |
| Fuite de données ou accès non autorisé | Faible à moyenne | Élevé | Minimisation, contrôle serveur et tests d'isolation des comptes |
| Injection d'instructions dans les contenus | Moyenne | Élevé | Permissions indépendantes du modèle, outils restreints et validation des sorties |
| Absence de participants | Moyenne | Moyen | Anticiper le recrutement et conserver une évaluation technique autonome |
| Résultats pédagogiques non concluants | Moyenne | Moyen | Protocole transparent, analyse des limites et absence de promesse de gain |
| Retard de développement | Moyenne | Élevé | Jalons intermédiaires, réserve finale et suppression des extensions |

## 20. Livrables attendus

1. Cahier des charges validé et historique des décisions de périmètre.
2. Dossier de conception : architecture, modèle de données, parcours et politique d'adaptation.
3. Maquettes des écrans principaux.
4. Code source versionné avec instructions d'installation et configuration d'exemple sans secrets.
5. Corpus autorisé, banque d'exercices et métadonnées de provenance.
6. Jeux d'évaluation distincts des données de développement, grilles et résultats.
7. Prototype déployé ou exécutable dans un environnement de démonstration reproductible.
8. Documentation utilisateur et guide de gestion des contenus.
9. Rapport final présentant les choix, résultats, coûts, limites et perspectives.
10. Support de soutenance et scénario de démonstration ; vidéo si demandée.

## 21. Gouvernance et suivi

- Revue hebdomadaire de l'avancement, des obstacles et des risques.
- Tableau de tâches priorisé avec critères d'acceptation.
- Démonstration à chaque jalon : diagnostic, recherche documentaire, adaptation et version candidate.
- Journal des décisions concernant le périmètre, les données et les technologies.
- Toute nouvelle demande est évaluée selon son intérêt, son effort et son effet sur la date finale avant d'être ajoutée au périmètre.
- Les anomalies bloquantes concernent notamment la sécurité, la perte de données et l'impossibilité de terminer le parcours principal.

## 22. Scénario proposé pour la soutenance

1. Présenter les objectifs pédagogiques et les ressources disponibles.
2. Faire passer un court diagnostic à un compte de démonstration.
3. Montrer le profil obtenu et la première recommandation.
4. Simuler une difficulté, demander un indice puis consulter la correction.
5. Montrer l'adaptation de l'activité suivante et sa justification.
6. Poser une question de cours et ouvrir la ressource citée.
7. Poser une question hors corpus pour montrer la gestion des limites.
8. Afficher la progression, le journal des décisions et les mesures techniques.
9. Présenter la comparaison avec le parcours fixe et les limites de l'étude.

La démonstration utilisera des comptes et données préparés pour cet usage. Une sauvegarde des résultats et une vidéo pourront compléter la présentation en cas d'indisponibilité du fournisseur de modèle.

## 23. Décisions à valider avant le développement

| Décision | Proposition | Statut |
|---|---|---|
| Public et domaine exacts | Débutants du supérieur, algorithmique et bases de Python | À valider |
| Notions et prérequis | Cinq notions décrites dans ce document | À valider par le référent |
| Composition de l'équipe et durée | Petite équipe ou travail individuel, 16 semaines | À confirmer |
| Corpus et droits d'utilisation | Ressources autorisées, relues et versionnées | À constituer |
| Banque d'exercices | Au moins 50 exercices validés | À confirmer |
| Modèle, fournisseur et hébergement | Choix après benchmark initial | À décider |
| Budget | Plafonds définis après estimation de consommation | À fixer |
| Modalités des tests avec volontaires | Pilote de 10 à 20 participants si possible | À organiser avec l'établissement |
| Seuils de recette et lots d'évaluation | Objectifs proposés dans les sections 13 et 15 | À valider avant l'évaluation finale |
| Calendrier officiel et livrables scolaires | Alignement sur les consignes du PFA | À confirmer |

## 24. Glossaire

| Terme | Définition dans ce projet |
|---|---|
| Agent pédagogique | Composant qui choisit une action d'apprentissage dans un cadre autorisé |
| Orchestrateur | Composant qui coordonne les étapes et contrôle les transitions |
| LLM | Modèle de langage utilisé pour produire ou analyser du texte |
| RAG | Génération de réponses appuyée sur des passages récupérés dans un corpus |
| Maîtrise estimée | Évaluation révisable d'une notion à partir d'observations |
| Prérequis | Notion nécessaire pour aborder une autre notion |
| MVP | Version minimale permettant de démontrer et d'évaluer le parcours principal |
| Parcours fixe | Référence expérimentale proposant une séquence prédéfinie d'activités |
| Abstention | Décision de ne pas donner une réponse ou une correction jugée insuffisamment fiable |
| Recette | Vérification que le système satisfait les critères d'acceptation convenus |

## 25. Validation du document

La validation confirme le périmètre retenu et les critères de réussite. Les points encore ouverts doivent être consignés avec un responsable et une échéance.

| Partie | Nom | Date | Validation ou réserves |
|---|---|---|---|
| Porteur / équipe projet | À compléter | À compléter | À compléter |
| Encadrant | À compléter | À compléter | À compléter |
| Référent pédagogique, si distinct | À compléter | À compléter | À compléter |
