# Frontend AgenticTutor

Première interface fonctionnelle : Next.js App Router, TypeScript et Tailwind CSS. Les dépendances exactes sont verrouillées dans `package-lock.json`. Les polices Rethink Sans et Hanken Grotesk sont distribuées localement par les paquets Fontsource.

## Lancer

Node.js 20.9 minimum. Depuis la racine :

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
| `/sign-in` | Connexion en aperçu frontend |
| `/sign-up` | Inscription en aperçu frontend |
| `/onboarding` | 16 questions, revue, modification et récapitulatif final |

Les formulaires valident les champs, affichent les erreurs, gèrent un état de vérification et permettent de voir le mot de passe. **Ils n'envoient aucune requête d'authentification et ne créent aucun compte.** Aucun mot de passe n'est sauvegardé. La récupération de mot de passe n'est pas implémentée, faute de service existant.

Le diagnostic commence par un choix parmi 11 langages et technologies, suivi de 6 questions de profil et 10 questions techniques. Chaque bonne réponse vaut 2 points : note finale sur 20. Le résultat est indicatif, non certifiant ; les banques doivent être validées pédagogiquement.

## Persistance locale

Clé agentictutor.onboarding.v2. Le brouillon conserve le langage, les réponses, la position et le récapitulatif. Les anciens brouillons v1 restent intacts mais sont séparés de ce nouveau parcours. Le stockage est validé au chargement et les états de revue/fin exigent des réponses complètes. En cas de stockage bloqué, le parcours continue en mémoire avec avertissement.

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

Authentification, sessions sécurisées, création de compte, vérification d'e-mail et récupération du mot de passe ; enregistrement du profil et du diagnostic ; calcul de maîtrise validé ; conversation IA, ressources, exercices adaptatifs et dashboard.

Le futur backend devra recalculer les scores à partir des identifiants/réponses, contrôler les permissions et ne jamais faire confiance au score calculé dans le navigateur. Les bonnes réponses côté client ne conviennent pas à un examen officiel. Après connexion, remplacer l'aperçu explicite sans transformer la sauvegarde locale en preuve d'authentification.


## Dépendances

Audit production : aucune vulnérabilité détectée. L’audit complet signale 7 alertes modérées dans la chaîne de développement ESLint/typescript-eslint/minimatch ; la mise à jour automatique sans rupture ne les résout pas. Elles ne font pas partie du bundle applicatif et restent à suivre.


### Positionnement de la landing

À la demande du porteur du projet, la landing présente le produit cible au présent : tutorat multilangage, exercices adaptatifs, suivi, révisions et outils enseignants. Cette présentation marketing ne constitue pas une preuve de livraison. Le périmètre exécuté reste le frontend, le diagnostic Python local et les formulaires en aperçu. Les autres parcours, le backend et le tutorat IA restent à implémenter. Les commandes de lancement sont inchangées.

Les deux exemples de la landing proposent chacun un sélecteur indépendant : Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go, Rust et MySQL. Code, indices et explications sont prédéfinis, sans exécution de code ni génération IA. HTML et CSS illustrent respectivement la structure et la présentation. Les commandes de lancement restent inchangées.

## Diagnostic multilangage actuel

Le parcours commence par un choix unique parmi 11 langages et technologies. Il contient ensuite 6 questions de profil non notées et 10 questions techniques spécifiques : chaque bonne réponse vaut 2 points, soit une note sur 20. Les banques restent à valider pédagogiquement. Navigation, revue et reprise locale sont conservées. Le format v2 est enregistré sous agentictutor.onboarding.v2 ; les anciens brouillons v1 restent intacts mais ne sont pas repris dans les nouveaux tests. Changer de langage demande confirmation et réinitialise le diagnostic courant. Aucun backend ni authentification réelle ajouté. Commandes de lancement inchangées.
