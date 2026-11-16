# Frontend AgenticTutor

Le frontend utilise Next.js App Router, TypeScript et Tailwind CSS. Les dépendances exactes sont verrouillées dans `package-lock.json`. Les polices Rethink Sans et Hanken Grotesk sont distribuées localement par les paquets Fontsource.

## Lancer

Installer Node.js 20.9 au minimum, puis lancer les commandes depuis la racine du dépôt :

```bash
cd frontend
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:3000.

Sous Windows PowerShell, si l’exécution de npm.ps1 est bloquée, utiliser ces commandes depuis frontend/ :

```powershell
npm.cmd ci
npm.cmd run dev
```

Pour les lancements suivants, npm.cmd run dev suffit ; relancer npm.cmd ci lorsque les dépendances changent.

## Routes

| Route | Fonction |
|---|---|
| `/` | Landing enrichie : cinq notions, exemple Python interactif prédéfini, boucle expliquée, profils et FAQ |
| `/sign-in` | Connexion Supabase Auth |
| `/sign-up` | Inscription Supabase Auth ; session valide → dashboard protégé |
| `/dashboard` | Espace protégé, profil persistant, diagnostic et déconnexion |
| `/onboarding` | 16 questions, revue, modification et récapitulatif final |

Les formulaires valident les champs et affichent les erreurs ainsi qu'un état de vérification. Un bouton permet de voir le mot de passe. Ils utilisent maintenant les Server Actions Next.js et Supabase Auth. Après inscription et obtention d’une session, /dashboard s’ouvre avec un profil persistant. Le dashboard vérifie l’identité côté serveur et charge uniquement le profil du compte connecté. La connexion établit une session. Aucun mot de passe n'est sauvegardé. La récupération passe par /forgot-password et /reset-password.

Le diagnostic commence par un choix parmi 10 langages et technologies, suivi de 6 questions de profil et 10 questions techniques. Chaque bonne réponse vaut 2 points : note finale sur 20. Le résultat donne un repère, sans certifier le niveau de l'étudiant. Les banques doivent être validées pédagogiquement.

## Persistance locale

Le brouillon utilise la clé agentictutor.onboarding.v2 et conserve le langage, les réponses, la position et le récapitulatif. Les anciens brouillons v1 restent intacts mais sont séparés de ce nouveau parcours. L'application valide le brouillon au chargement. Toutes les réponses doivent être renseignées pour accéder à la revue ou terminer le diagnostic. Si le stockage est bloqué, le parcours continue en mémoire et affiche un avertissement.

## Organisation

- `src/app/` : routes, metadata, layout et page introuvable.
- `src/components/brand.tsx` : marque et navigation partagées.
- `src/features/auth/auth-form.tsx` : formulaires de démonstration.
- `src/features/diagnostic/` : questions, stockage et parcours.
- `src/features/tutor/lesson-preview.tsx` : exemple prédéfini de la landing.
- `src/styles/tokens.css` : couleurs, polices et échelle de design.
- `src/styles/globals.css` : styles communs, responsive, focus et mouvement réduit.
- `tests/flows.spec.ts` : tests navigateur des parcours réels.

## Dernier état vérifié

La landing a été enrichie avec des surfaces colorées et du contenu Python concret. Les sept tests Playwright ont été relancés après ce changement ; des captures desktop et mobile ont été inspectées. Lint et build de production ont également été vérifiés pendant cette tranche. Relancer les commandes ci-dessous pour vérifier l’état courant.

## Vérifier

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Les tests E2E nécessitent le serveur sur le port 3000. Par défaut, Playwright utilise son Chromium : installer ce navigateur avec `npx playwright install chromium`. Pour utiliser un navigateur Chromium déjà installé, définir `CHROME_PATH`. Exemple PowerShell :

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:e2e
```

Pour lancer la version optimisée : `npm run build`, puis `npm start`. Ne pas utiliser un serveur dev et un build simultanément dans le même dossier lors d'un déploiement.

## Connexions backend restantes

Les comptes, sessions et récupération sont connectés. La confirmation obligatoire d’e-mail et le SMTP hébergé restent à valider avant déploiement. Il devra enregistrer le profil et le diagnostic, calculer la maîtrise selon des règles validées, et fournir la conversation IA, les ressources, les exercices adaptatifs et les données du tableau de bord.

Le futur backend devra recalculer les scores à partir des identifiants/réponses, contrôler les permissions et ne jamais faire confiance au score calculé dans le navigateur. Les bonnes réponses côté client ne conviennent pas à un examen officiel. Après connexion, remplacer l'aperçu explicite sans transformer la sauvegarde locale en preuve d'authentification.


## Dépendances

L'audit de production n'a détecté aucune vulnérabilité. L’audit complet signale 7 alertes modérées dans la chaîne de développement ESLint/typescript-eslint/minimatch ; la mise à jour automatique sans rupture ne les résout pas. Elles ne font pas partie du bundle applicatif et restent à suivre.


### Positionnement de la landing

La landing décrit le produit cible au présent, à la demande du porteur du projet. Elle présente le tutorat multilangage, les exercices adaptatifs, le suivi, les révisions et les outils enseignants. Ces fonctionnalités ne sont pas toutes livrées : le frontend, le diagnostic Python local et les formulaires en aperçu constituent le périmètre réalisé. Les autres parcours, le backend et le tutorat IA restent à implémenter.

Les deux exemples de la landing ont chacun leur sélecteur de langage : Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go et Rust. Le code, les indices et les explications sont prédéfinis. Les exemples n'exécutent pas de code et ne génèrent pas de réponse par IA. HTML et CSS illustrent respectivement la structure et la présentation. Les commandes de lancement restent inchangées.

## Diagnostic multilangage actuel

Le parcours commence par un choix unique parmi 10 langages et technologies. Il contient ensuite 6 questions de profil non notées et 10 questions techniques spécifiques : chaque bonne réponse vaut 2 points, soit une note sur 20. Les banques restent à valider pédagogiquement. L'étudiant peut revenir en arrière, revoir ses réponses et reprendre le diagnostic localement. Le format v2 est enregistré sous agentictutor.onboarding.v2 ; les anciens brouillons v1 restent intacts, mais le nouveau diagnostic ne les reprend pas. Changer de langage demande confirmation et réinitialise le diagnostic courant. Le diagnostic ne dispose pas de backend ni d'authentification réelle. Les commandes de lancement restent inchangées.

## Simplification interne du frontend

Les identifiants, libellés et l’ordre des langages sont centralisés dans frontend/src/lib/languages.ts. Le diagnostic est uniquement à choix unique ; ses banques utilisent des tuples de quatre chaînes et une couverture typée de tous les langages. Les questions, l'ordre des options, le score et le format de brouillon v2 restent inchangés. Le favicon est passé de 83 540 à 80 524 octets. La comparaison des rendus à 16, 32, 64, 128 et 2048 pixels n'a montré aucune différence de pixels. Les commandes de lancement sont inchangées.
## Tableau de bord provisoire : 15 novembre 2026

Le nouvel écran réutilise Brand, les boutons, les polices et les tokens existants. Route dans src/app/dashboard/page.tsx, styles isolés dans src/styles/dashboard.css ; redirection d’aperçu dans features/auth/auth-form.tsx. Aucun paquet ni variable ajouté ; lancement inchangé avec npm.cmd run dev.

Vérifications de cette tranche : lint, typecheck, build de production et 12 tests Playwright réussis. Le parcours inscription → tableau de bord → diagnostic, la reprise après rechargement, le clavier et les largeurs 375/768/1280/1920 sont couverts. Hallmark : 0 FAIL, 0 REFLEX, 0 WARN ; captures desktop/mobile inspectées. Le build affiche un avertissement de racine de workspace lié aux deux lockfiles ; il réussit.

## Jalon 2 : comptes et profil connectés

L’inscription et la connexion utilisent maintenant Supabase Auth via des Server Actions Next.js et des cookies HttpOnly. /dashboard est protégé ; le profil est enregistré par FastAPI, éditable et isolé par RLS. Déconnexion et récupération de mot de passe sont connectées. Cette tranche remplace les aperçus d’authentification décrits dans les sections historiques. Le diagnostic reste local jusqu’au jalon 3.

Lire [le guide complet](../docs/guides/milestone-2-auth.md) pour les commandes. Après démarrage de Supabase, exécuter python -m tools.configure_auth depuis backend/ avec son environnement, puis redémarrer FastAPI et Next.js. Les instructions Windows utilisant le Python de base restent valables. Décision : docs/decisions/0003-server-auth-sessions.md.
