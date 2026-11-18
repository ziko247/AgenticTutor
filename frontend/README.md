# Frontend AgenticTutor

Première interface fonctionnelle : Next.js App Router, TypeScript et Tailwind CSS. Les dépendances exactes sont verrouillées dans `package-lock.json`. Les polices Rethink Sans et Hanken Grotesk sont distribuées localement par les paquets Fontsource.

## Lancer

Node.js 24.15 minimum. Depuis la racine :

```bash
cd frontend
npm ci
```

Depuis `frontend/`, copier `.env.example` vers `.env.local`. Générer un secret avec `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` et le renseigner dans `BETTER_AUTH_SECRET`. Garder cette valeur privée et stable. `BETTER_AUTH_URL` doit correspondre exactement à l’origine utilisée dans le navigateur.

```bash
npm run auth:migrate
npm run dev
```

Ouvrir http://127.0.0.1:3000. La migration initialise `agentictutor.sqlite`. Relancer `npm run auth:migrate` (ou `npm.cmd run auth:migrate` sous PowerShell) après une mise à jour du schéma, notamment pour ajouter le champ du nom. Les comptes existants conservent leur prénom. Pour utiliser un autre fichier, définir `AUTH_DB_PATH` avant la migration et le lancement.

Sous Windows PowerShell, si l’exécution de npm.ps1 est bloquée, utiliser ces commandes depuis frontend/ :

```powershell
npm.cmd ci
# Configurer .env.local comme indiqué ci-dessus.
npm.cmd run auth:migrate
npm.cmd run dev
```

Pour les lancements suivants, npm.cmd run dev suffit ; relancer npm.cmd ci lorsque les dépendances changent.

## Routes

| Route | Fonction |
|---|---|
| `/` | Landing enrichie : cinq notions, exemple Python interactif prédéfini, boucle expliquée, profils et FAQ |
| `/sign-in` | Connexion par e-mail et mot de passe |
| `/sign-up` | Création d’un compte avec prénom et nom |
| `/forgot-password` | Demande d’un lien de réinitialisation |
| `/reset-password` | Nouveau mot de passe depuis un lien reçu par e-mail |
| `/account` | Page protégée, informations du compte et déconnexion |
| `/onboarding` | 16 questions, revue, modification et récapitulatif final |

Better Auth hache les mots de passe et stocke les comptes et sessions dans SQLite. Le navigateur reçoit un cookie HttpOnly. La route `/account` vérifie la session avant d’afficher les informations du compte. Pour un déploiement, utiliser une URL HTTPS publique et un volume SQLite persistant.

Le diagnostic commence par un choix parmi 10 langages et technologies, suivi de 6 questions de profil et 10 questions techniques. Chaque bonne réponse vaut 2 points : note finale sur 20. Le résultat est indicatif, non certifiant ; les banques doivent être validées pédagogiquement.

## Réinitialiser un mot de passe

Configurer `SMTP_URL` et `AUTH_EMAIL_FROM` dans `.env.local`, puis redémarrer Next.js. Pour tester localement, démarrer Mailpit avec `mailpit --listen 127.0.0.1:8025 --smtp 127.0.0.1:1025` et reprendre les exemples SMTP de `.env.example`. Les messages sont visibles dans sa boîte locale sur http://127.0.0.1:8025. Pour livrer de vrais e-mails, utiliser un serveur SMTP authentifié avec TLS et une adresse d’expédition autorisée.

Le lien est valable 30 minutes et utilisable une seule fois. Une réinitialisation réussie invalide les sessions existantes.

## Persistance locale

Clé agentictutor.onboarding.v2. Le brouillon conserve le langage, les réponses, la position et le récapitulatif. Les anciens brouillons v1 restent intacts mais sont séparés de ce nouveau parcours. Le stockage est validé au chargement et les états de revue/fin exigent des réponses complètes. En cas de stockage bloqué, le parcours continue en mémoire avec avertissement.

## Organisation

- `src/app/` : routes, metadata, layout et page introuvable.
- `src/components/brand.tsx` : marque et navigation partagées.
- `src/features/auth/auth-form.tsx` : formulaires d’authentification.
- `src/features/diagnostic/` : questions, stockage et parcours.
- `src/features/tutor/lesson-preview.tsx` : exemple prédéfini de la landing.
- `src/styles/tokens.css` : couleurs, polices et échelle de design.
- `src/styles/globals.css` : styles communs, responsive, focus et mouvement réduit.
- `tests/flows.spec.ts` : tests navigateur des parcours réels.

## Dernier état vérifié

Lint, TypeScript et 12 tests Playwright sous Chrome ont réussi. Les tests couvrent notamment l’inscription, la connexion, la reprise de session, la déconnexion et le refus d’accès au compte en mode invité.

## Vérifier

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Les tests E2E nécessitent le serveur sur le port 3000 et une base initialisée. Pour isoler les comptes de test, définir `AUTH_DB_PATH` sur un fichier SQLite dédié avant la migration et le lancement. Par défaut, Playwright utilise son Chromium : installer ce navigateur avec `npx playwright install chromium`. Pour utiliser un navigateur Chromium déjà installé, définir `CHROME_PATH`. Exemple PowerShell :

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e
```

Pour lancer la version optimisée : `npm run build`, puis `npm start`. Ne pas utiliser un serveur dev et un build simultanément dans le même dossier lors d'un déploiement.

## Connexions backend restantes

Vérification d’e-mail et rôles étudiant/gestionnaire ; enregistrement du profil et du diagnostic ; calcul de maîtrise validé ; conversation IA, ressources, exercices adaptatifs et dashboard.

Le futur backend devra recalculer les scores à partir des identifiants/réponses, contrôler les permissions et ne jamais faire confiance au score calculé dans le navigateur. Les bonnes réponses côté client ne conviennent pas à un examen officiel. Le diagnostic reprend le brouillon du navigateur indépendamment du compte.


## Dépendances

Audit production : aucune vulnérabilité détectée. L’audit complet signale 7 alertes modérées dans la chaîne de développement ESLint/typescript-eslint/minimatch ; la mise à jour automatique sans rupture ne les résout pas. Elles ne font pas partie du bundle applicatif et restent à suivre.


### Positionnement de la landing

À la demande du porteur du projet, la landing présente le produit cible au présent : tutorat multilangage, exercices adaptatifs, suivi, révisions et outils enseignants. Cette présentation marketing ne constitue pas une preuve de livraison. Le périmètre exécuté reste le frontend, le diagnostic multilangage local et l’authentification par e-mail. Les autres parcours, le backend et le tutorat IA restent à implémenter. Les commandes de lancement sont inchangées.

Les deux exemples de la landing proposent chacun un sélecteur indépendant : Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go, et Rust. Code, indices et explications sont prédéfinis, sans exécution de code ni génération IA. HTML et CSS illustrent respectivement la structure et la présentation. Les commandes de lancement restent inchangées.

## Diagnostic multilangage actuel

Le parcours commence par un choix unique parmi 10 langages et technologies. Il contient ensuite 6 questions de profil non notées et 10 questions techniques spécifiques : chaque bonne réponse vaut 2 points, soit une note sur 20. Les banques restent à valider pédagogiquement. Navigation, revue et reprise locale sont conservées. Le format v2 est enregistré sous agentictutor.onboarding.v2 ; les anciens brouillons v1 restent intacts mais ne sont pas repris dans les nouveaux tests. Changer de langage demande confirmation et réinitialise le diagnostic courant. Le diagnostic reste indépendant de la session et accessible en mode invité.

## Simplification interne du frontend

Les identifiants, libellés et l’ordre des langages sont centralisés dans frontend/src/lib/languages.ts. Le diagnostic est uniquement à choix unique ; ses banques utilisent des tuples de quatre chaînes et une couverture typée de tous les langages. Questions, ordre des options, score et format de brouillon v2 sont inchangés. Le favicon est passé de 83 540 à 80 524 octets ; comparaison des pixels identique à 16, 32, 64, 128 et 2048 pixels. Les commandes de lancement sont inchangées.