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

## Persistance du diagnostic

Le diagnostic nécessite une connexion. FastAPI enregistre les réponses, la progression et le résultat dans Supabase, associés au compte ; le score est calculé côté serveur. Les anciens brouillons locaux restent intacts mais ne sont pas importés automatiquement. Si l'enregistrement échoue, un message invite à réessayer.

## Organisation

- `src/app/` : routes, metadata, layout et page introuvable.
- `src/components/brand.tsx` : marque et navigation partagées.
- `src/features/auth/auth-form.tsx` : formulaires connectés à Supabase Auth.
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

## À développer

Le tutorat IA, les exercices adaptatifs et le suivi de progression restent à construire. Les banques du diagnostic doivent être validées pédagogiquement. La confirmation obligatoire d’e-mail et le SMTP hébergé restent à valider avant déploiement.

La landing présente la vision du produit. Les exemples de code sont prédéfinis et ne sont pas exécutés. Lenis respecte la préférence de réduction des animations.
