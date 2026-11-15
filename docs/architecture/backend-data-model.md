# Modèle de données initial

Statut : schéma initial appliqué et testé localement au jalon 1, le 15 novembre 2026 ; routes métier et complétion restent futures. Référence : [fondation](backend-foundation.md). Tous les identifiants nouveaux sont des UUID, sauf les codes de langage. Dates serveur en UTC (timestamptz). Les tables sont créées dans app_private par supabase/migrations/20261115000100_backend_foundation.sql ; auth.users appartient à Supabase.

## Tables et relations

| Table | Champs et contraintes proposés |
|---|---|
| auth.users | Identité gérée par Supabase ; aucun mot de passe dans les tables métier |
| profiles | user_id PK/FK auth.users ON DELETE CASCADE ; display_name de 1 à 80 caractères après trim ; preferred_language FK nullable ; revision entière positive ; created_at, updated_at |
| languages | code PK parmi python, c, cpp, csharp, java, html, css, javascript, go, rust ; label ; enabled |
| questionnaires | id PK ; language_code FK ; version entière ; status draft/published/retired ; content_hash ; score_rule_version ; published_at ; unique(language_code, version) |
| questions | id PK ; questionnaire_id FK ; source_key ; ordinal unique par questionnaire ; kind profile/technical ; prompt ; code nullable ; topic nullable ; unique(questionnaire_id, source_key) |
| answer_options | id PK ; question_id FK ; ordinal ; label ; unique(question_id, ordinal) et unique(question_id, id) |
| answer_keys | question_id PK/FK ; correct_option_id ; FK composite vers answer_options(question_id,id) ; points = 2 |
| diagnostic_attempts | id PK ; user_id FK profiles ON DELETE CASCADE ; questionnaire_id FK ; state in_progress/completed ; cursor_question_id nullable ; revision ; score nullable ; correct_count nullable ; created_at, updated_at, completed_at |
| diagnostic_answers | attempt_id + question_id PK ; questionnaire_id ; option_id ; answered_at ; FK composite vérifiant l'appartenance de la question et de l'option |
| diagnostic_imports | user_id + client_import_id PK ; attempt_id FK CASCADE ; payload_hash ; created_at |

Les résultats sont dans diagnostic_attempts : pas de table séparée qui dupliquerait score et état. Le contexte de profil education, experience, subject, goal, difficulty et rhythm est conservé dans les réponses de la tentative versionnée. Un profil garde seulement le nom et la préférence courante ; il ne recopie pas toutes les réponses historiques.

Chaque version embarque les six questions de profil et les dix questions techniques. Les questions partagées sont copiées dans la version publiée pour figer leur texte et leurs options. Cette duplication limitée est volontaire : aucune modification d'une version publiée. La clé de correction n'est jamais incluse dans le DTO de questionnaire envoyé au navigateur.

## Intégrité attendue

- Publication atomique : exactement 16 questions ordonnées, dont six de profil et dix techniques ; chaque question a au moins deux options, une seule option correcte par question technique et aucune correction/point pour le profil. Au jalon 1, un trigger de publication vérifie ces invariants ; le rôle runtime ne peut pas publier. Le futur service de publication devra aussi les valider.
- Des FKs composites doivent garantir que réponses, question et tentative portent le même questionnaire, et que l'option appartient à la question. Prévoir les contraintes UNIQUE nécessaires sur questions et attempts pour ces références.
- cursor_question_id appartient à la version de la tentative. Il désigne la position de reprise, sans prétendre que toutes les questions précédentes sont déjà répondues.
- revision est incrémentée dans une écriture conditionnelle atomique. Une sauvegarde provenant d'un autre onglet sur une révision périmée échoue sans écraser les données.
- Une tentative completed a score entre 0 et 20, correct_count entre 0 et 10, completed_at non nul et score = 2 × correct_count. Une tentative in_progress n'a pas de note finale.
- Le langage d'une tentative est celui de son questionnaire. Il ne peut pas être modifié. Un autre langage correspond à une autre tentative ; la préférence du profil n'altère jamais l'historique.
- Plusieurs tentatives sont permises, y compris pour le même langage. Un doublon réseau n'est pas une nouvelle tentative : l'identifiant de création idempotent est unique par utilisateur et lié à l'empreinte de la requête.
- Indexer attempts(user_id, updated_at, id) pour la reprise et la pagination. Les clés uniques des réponses et imports fournissent leurs index. Pas d'index spéculatifs supplémentaires.

Ajouter aux tentatives un client_request_id et un create_payload_hash pour l'idempotence de création. La table diagnostic_imports ne couvre que l'import de données locales, avec une clé indépendante.

## Calcul de la note

À la complétion, verrouiller la tentative dans une transaction, vérifier le propriétaire puis les 16 réponses. Charger la clé de sa version, comparer les dix options techniques et enregistrer correct_count, score et completed_at ensemble. Résultats attendus : 0 bonne réponse = 0/20 ; 1 = 2/20 ; 10 = 20/20. Aucun arrondi ni LLM.

La réponse « Je ne sais pas encore » est une option valide mais incorrecte sur les questions techniques. Les réponses de profil restent obligatoires pour terminer et valent zéro point. La note n'est ni un niveau de maîtrise par notion ni une note scolaire officielle.

Cible du jalon 3, non implémentée : un second appel de complétion retourne le même résultat. Une réponse ne peut plus être modifiée après complétion ; le frontend pourra proposer une nouvelle tentative. Cela diffère de l'édition locale actuelle après résultat : au jalon d'intégration, garder l'édition visible mais enregistrer la correction comme une nouvelle tentative liée (supersedes_attempt_id nullable), avec nouveau résultat. Faire valider cette sémantique avant de connecter l'écran ; aucune interface n'est modifiée ici.

## Versionnement et suppression

Une publication crée une version immuable ; toute correction produit une nouvelle version. Les tentatives en cours continuent avec leur version initiale. Une version retired ne permet plus de démarrer, mais reste disponible à son propriétaire pour reprise et historique. Si une version doit être bloquée pour un motif de sécurité, rendre une erreur explicite et proposer une nouvelle tentative ; ne jamais changer silencieusement les questions.

Les questionnaires publiés et leurs options ne sont pas supprimés s'ils sont référencés (RESTRICT). Les versions brouillon sans tentative peuvent être retirées par l'outil de publication. Supprimer une identité Auth doit supprimer le profil, les tentatives, les réponses et les imports associés en cascade. Ne pas supprimer les contenus partagés. Le traitement des sauvegardes et le délai de conservation restent à valider avec l'établissement.

## RLS et contrôles d'accès

Les profils, tentatives et imports sont limités à app.user_id ; les réponses le sont via la tentative. Le rôle applicatif peut lire les questionnaires publiés/retirés nécessaires et leurs clés uniquement côté serveur, mais ne peut pas publier de contenu. Les droits de colonnes/procédures et les services limitent l'écriture des champs de résultat. Les permissions SQL et politiques sont testées avec les rôles réels, selon la [fondation](backend-foundation.md).

## Correspondance avec le frontend

| Valeur actuelle | Représentation serveur cible |
|---|---|
| language, code du registre | languages.code |
| Question de profil, ex. education | source_key dans une version donnée |
| Question technique, ex. python-0 | source_key ; ne suffit pas sans version |
| Indice numérique d'option | answer_options.id, converti avec une version connue |
| step | cursor_question_id via l'ordre figé |
| review | État d'interface, pas un résultat serveur |
| completed | Demande de complétion ; le serveur vérifie lui-même |
| Note calculée dans le navigateur | Ignorée, recalcul serveur |

Le format de stockage v2 n'est pas une version de contenu. Les banques actuelles n'ont pas de manifeste attestant leur version. La procédure d'import doit gérer cette limite explicitement.

Messages de conversation, tentatives d'exercices, estimation de maîtrise, graphe de prérequis et décisions du tuteur sont des évolutions futures ; aucune table spéculative n'est nécessaire pour cette première fondation.
