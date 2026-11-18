# 0003 — Auth côté serveur Next.js et validation FastAPI

Date : 15 novembre 2026. Statut : implémenté pour le jalon 2, demandé par le porteur.

La proposition 0002 envisageait le SDK navigateur pour Auth. Nous retenons les Server Actions Next.js et @supabase/ssr avec cookies HttpOnly, afin de garder les tokens hors du JavaScript navigateur. Next.js sert de frontière Auth ; le métier et les profils restent dans FastAPI. Ce choix remplace l’exception navigateur → Auth proposée dans 0002.

Le proxy SSR renouvelle les sessions ; les pages protégées vérifient getUser(), jamais un simple contenu de cookie. FastAPI valide indépendamment les bearers auprès du endpoint Auth configuré. Cet appel réseau est plus simple qu’un vérificateur JWT/JWKS maison et vérifie l’utilisateur actif, au prix d’une dépendance réseau par appel métier.

Les secrets d’administration ne sont pas nécessaires. Les erreurs publiques restent génériques. HTTPS et une origine explicite sont nécessaires au déploiement ; le local garde les ports documentés dans le [guide du jalon 2](../guides/milestone-2-auth.md).

Le diagnostic invité reste local ; compte avant/après diagnostic et import des brouillons restent des décisions du jalon 3.
