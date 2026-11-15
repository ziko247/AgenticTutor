# Contrat API proposé

Date : 15 novembre 2026. Seuls GET /api/v1/health/live et GET /api/v1/health/ready sont implémentés et vérifiés. Les routes métier et conventions suivantes sont proposées pour les jalons 2–3. Préfixe /api/v1. JSON UTF-8. Identifiants UUID et dates UTC ISO 8601 ; les noms entre accolades dans les routes sont des paramètres. Les exemples abrégés indiquent le contenu utile, pas une implémentation OpenAPI.

Références : [fondation](backend-foundation.md), [données](backend-data-model.md), [jalons](backend-roadmap.md).

## Règles communes

Sauf /health/live, /health/ready et GET /questionnaires/{language}/current, toutes les routes ci-dessous exigent Authorization: Bearer suivi d'un access token Supabase valide. Absence, expiration ou jeton invalide : 401 avec WWW-Authenticate: Bearer. Si le profil n'est pas initialisé : 409 profile_required, sauf GET/PUT /me/profile. Aucun champ user_id, role, score ou correct_count accepté en écriture.

Pour une tentative appartenant à un autre compte, renvoyer 404 identique à une ressource inexistante. Vérifier propriétaire + identifiant à chaque accès ; l'UUID n'est pas une autorisation. 403 reste réservé à une action reconnue mais interdite, par exemple un rôle désactivé. Listes paginées (20 par défaut, maximum 100), ordonnées par updated_at puis id ; curseur opaque, validé et lié au filtre. Pas de fuite de correction dans les questionnaires.

Les écritures sont atomiques. revision contrôle les sauvegardes entre onglets. Les POST de création/import exigent Idempotency-Key UUID fourni par le client. Une même clé et une même empreinte normalisée rendent la ressource initiale ; la même clé avec un autre contenu rend 409 idempotency_conflict. La contrainte d'unicité est en base : aucun « vérifier puis insérer » non protégé. Une réponse 201 est renvoyée à la création ; 200 au rejeu.

Erreur uniforme proposée :

~~~json
{"error":{"code":"invalid_option","message":"Cette option ne correspond pas à la question.","details":[{"field":"answers[0].option_id"}],"request_id":"trace-id"}}
~~~

422 : contenu JSON valide mais schéma, langue, question, option ou format incorrect ; 413 : taille maximale dépassée ; 429 : quota avec Retry-After ; 503 : service indispensable indisponible ; 500 : erreur interne sans trace technique exposée. Un UUID mal formé rend 422. Les exceptions du framework doivent être normalisées au même contrat.

## Santé et profil

| Route | Requête | Réponse attendue | Accès et erreurs spécifiques |
|---|---|---|---|
| GET /health/live | Aucun corps | 200 : {"status":"ok"} | Public, sans secret ni dépendance réseau ; limitation des abus |
| GET /health/ready | Aucun corps | 200 : {"status":"ready"} ; sinon 503 | Public, vérifie DB et migrations compatibles avec délai borné ; pas de DSN exposé |
| GET /me/profile | Aucun corps | 200 : profil P ci-dessous | Propriétaire = sub ; 404 si aucun profil |
| PUT /me/profile | {"display_name":"Étudiant","preferred_language":"python"} | 201 première création, 200 rejeu identique : profil P | Identité Auth valide ; user_id injecté côté serveur ; sans remise à zéro d'un profil existant ; 409 profile_exists si contenu différent sur un profil déjà créé |
| PATCH /me/profile | {"display_name":"Étudiant","preferred_language":"rust","revision":1} | 200 : profil P avec revision 2 | Seuls ces champs sont autorisés ; 409 revision_conflict ; null autorisé pour preferred_language, pas display_name |

Profil P, exemple synthétique :

~~~json
{"user_id":"11111111-1111-4111-8111-111111111111","display_name":"Étudiant","preferred_language":"python","revision":1,"created_at":"2026-11-15T10:00:00Z","updated_at":"2026-11-15T10:00:00Z"}
~~~

PUT établit le profil après connexion. L'adresse e-mail reste dans Auth, sans copie obligatoire dans profiles. Une modification de langue préférée ne modifie jamais une tentative existante.

## Questionnaire et tentatives

| Route | Requête/exemple | Réponse attendue | Accès et erreurs spécifiques |
|---|---|---|---|
| GET /questionnaires/{language}/current | Aucun corps ; language = python, c, cpp, csharp, java, html, css, javascript, go ou rust | 200 : Q ci-dessous, avec les 16 questions | Public pour permettre un diagnostic invité ; 404 langue désactivée ou aucune version publiée ; 422 code invalide |
| POST /diagnostic-attempts | {"questionnaire_id":"22222222-2222-4222-8222-222222222222"} + Idempotency-Key | 201/200 : A ci-dessous, answers vide | Auth + profil ; propriétaire injecté ; 409 questionnaire_retired si nouveaux départs fermés ; 404 version absente |
| GET /diagnostic-attempts?language=python&state=in_progress&limit=20 | Aucun corps ; filtres facultatifs | 200 : {"items":[A],"next_cursor":null} | Filtrage propriétaire systématique ; 422 filtres/curseur invalides |
| GET /diagnostic-attempts/{attempt_id} | Aucun corps | 200 : A, réponses et questionnaire de la version figée sans clé | Propriétaire seulement ; reprise après reconnexion ; 404 sinon |
| PUT /diagnostic-attempts/{attempt_id}/answers | S ci-dessous, revision obligatoire | 200 : A, revision incrémentée | Propriétaire ; 422 question/option étrangère ou dupliquée ; 409 stale_revision ou attempt_completed |
| POST /diagnostic-attempts/{attempt_id}/complete | {"revision":3} | 200 : R ci-dessous | Propriétaire ; 409 incomplete_attempt avec questions manquantes ; 409 stale_revision avant première complétion ; 200 même R si déjà completed |
| GET /diagnostic-attempts/{attempt_id}/result | Aucun corps | 200 : R ci-dessous | Propriétaire ; 409 attempt_not_completed ; 404 sinon |

Exemple Q (questions abrégées ici ; la réponse réelle contient les 16 et leurs options, sans correct, points cachés ni answer_keys) :

~~~json
{"id":"22222222-2222-4222-8222-222222222222","language":"python","version":1,"content_hash":"empreinte-du-contenu","technical_count":10,"profile_count":6,"max_score":20,"questions":[{"id":"33333333-3333-4333-8333-333333333333","source_key":"python-0","ordinal":7,"kind":"technical","prompt":"Quel mot définit une fonction ?","options":[{"id":"44444444-4444-4444-8444-444444444444","ordinal":0,"label":"def"}]}]}
~~~

Exemple A (une réponse déjà sauvegardée) :

~~~json
{"id":"55555555-5555-4555-8555-555555555555","language":"python","questionnaire_id":"22222222-2222-4222-8222-222222222222","questionnaire_version":1,"state":"in_progress","revision":3,"cursor_question_id":"33333333-3333-4333-8333-333333333333","answers":[{"question_id":"33333333-3333-4333-8333-333333333333","option_id":"44444444-4444-4444-8444-444444444444"}],"updated_at":"2026-11-15T10:05:00Z"}
~~~

Sauvegarde S :

~~~json
{"revision":3,"cursor_question_id":"33333333-3333-4333-8333-333333333333","answers":[{"question_id":"33333333-3333-4333-8333-333333333333","option_id":"44444444-4444-4444-8444-444444444444"}]}
~~~

La sauvegarde est un upsert du sous-ensemble fourni, pas le remplacement silencieux de toutes les réponses. Un answer option_id = null efface explicitement la réponse de cette question. Le curseur et les réponses sont validés contre la même version et écrits dans une transaction. Un tableau vide sert à déplacer le curseur. Répéter une sauvegarde avec l'ancienne révision renvoie 409 ; le client relit la ressource et peut constater que son contenu a déjà été appliqué. Ne pas rejouer automatiquement en écrasant les réponses d'un autre onglet.

Résultat R :

~~~json
{"attempt_id":"55555555-5555-4555-8555-555555555555","language":"python","questionnaire_version":1,"state":"completed","revision":4,"correct_count":7,"technical_count":10,"score":14,"max_score":20,"score_rule_version":1,"completed_at":"2026-11-15T10:10:00Z"}
~~~

R contient le score déterministe enregistré à la complétion, pas une estimation certifiée de maîtrise. Le serveur refuse toute note fournie par le client. Les corrections détaillées seront un endpoint futur si le produit le demande.

Complétion et sauvegarde se verrouillent sur la même tentative : une sauvegarde concurrente ne peut pas changer les réponses après la note. Une interruption réseau après commit est résolue par GET ou un second complete, qui rend le résultat existant. Aucune double note.

## Auth : contrats du fournisseur, pas de doublon FastAPI

Proposition : client SDK Supabase Auth pour signUp, signInWithPassword, signOut avec scope explicite, resetPasswordForEmail et updateUser après récupération. FastAPI ne crée pas de route /login parallèle. Les réponses de session et erreurs sont celles du SDK fournisseur ; l'interface conserve des messages neutres et n'expose pas l'existence d'un compte via récupération.

Pour l'inscription, ne pas supposer qu'un compte créé donne immédiatement une session : l'e-mail peut devoir être confirmé. Les URL de confirmation/récupération et l'échange de code PKCE restent à configurer et tester au jalon Auth. Le SDK ne reçoit qu'une clé publiable, jamais une clé d'administration. Voir la [frontière et les limites de session](backend-foundation.md).

## Import d'un diagnostic local

Route proposée POST /diagnostic-imports, auth + profil obligatoires. Idempotency-Key identifie client_import_id. Exemple de corps pour un futur brouillon versionné :

~~~json
{"source_schema_version":2,"questionnaire_id":"22222222-2222-4222-8222-222222222222","content_hash":"empreinte-du-contenu","language":"python","cursor_source_key":"python-0","answers":[{"source_key":"education","option_index":0},{"source_key":"python-0","option_index":0}],"request_completion":false}
~~~

Réponse 201/200 : {"attempt":A,"import_id":"UUID"}. La transaction crée une nouvelle tentative et son registre d'import ; elle ne remplace ni un résultat serveur existant ni la préférence du profil. request_completion = true passe par les mêmes contrôles que complete. Le client n'envoie pas son score ni une identité propriétaire.

Le serveur vérifie format, langue, questions, options et version publiée connue ; les indices sont convertis en UUID uniquement selon cette version. 409 idempotency_conflict si même clé avec un autre contenu ; 422 incompatible_local_draft si version manquante/inconnue, empreinte incompatible ou option impossible ; 409 incomplete_attempt si complétion demandée sans toutes les réponses. Une panne ne laisse pas une moitié d'import.

Le brouillon v2 actuel n'a ni content_hash ni questionnaire_id. Ne pas inventer ces champs en prenant la version courante : la clé v2 versionne le stockage, pas les questions. Avant de proposer un import automatique, établir une correspondance prouvée entre l'ancien bundle et une version serveur figée (manifeste conservé avec la release). Sans cette preuve, conserver le brouillon local, proposer son export ou une nouvelle tentative ; ne pas lui attribuer une note serveur prétendument équivalente.

Un identifiant d'import aléatoire est généré une fois lors du premier import et conservé séparément du contenu local. Un rejeu après timeout conserve cette clé. Deux appareils peuvent avoir deux clés : c'est une nouvelle tentative, pas un écrasement de l'historique. L'interface demandera quel brouillon importer en présence d'une tentative serveur et signalera le changement de compte. Aucun effacement local avant accusé de réception durable et vérification de l'ID de compte ; l'effacement reste un choix explicite.

## Parcours produit encore ouvert

| Option | Avantage | Coût |
|---|---|---|
| Compte d'abord | Propriétaire connu dès le départ ; reprise multi-appareils immédiate | Inscription imposée avant l'essai |
| Diagnostic d'abord | Prolonge l'expérience invitée actuelle | Import versionné et choix de compte à gérer |

Recommandation : diagnostic d'abord, puis invitation à créer un compte pour sauvegarder. Le parcours invité reste local ; aucun endpoint anonyme d'écriture n'est nécessaire. Un étudiant déjà connecté peut démarrer directement une tentative serveur. Cette recommandation reste à valider par le porteur. L'import et la conversion des brouillons existants ne sont pas implémentés.
