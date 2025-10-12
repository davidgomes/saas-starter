# Modèle de Démarrage SaaS Next.js

Ceci est un modèle de démarrage pour créer une application SaaS en utilisant **Next.js** avec support pour l'authentification, l'intégration Stripe pour les paiements, et un tableau de bord pour les utilisateurs connectés.

**Démo : [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Fonctionnalités

- Page d'accueil marketing (`/`) avec élément Terminal animé
- Page de tarification (`/pricing`) qui se connecte à Stripe Checkout
- Pages de tableau de bord avec opérations CRUD sur les utilisateurs/équipes
- RBAC de base avec rôles Propriétaire et Membre
- Gestion des abonnements avec le Portail Client Stripe
- Authentification email/mot de passe avec JWTs stockés dans les cookies
- Middleware global pour protéger les routes connectées
- Middleware local pour protéger les Server Actions ou valider les schémas Zod
- Système de journalisation d'activité pour tous les événements utilisateur

## Stack Technologique

- **Framework** : [Next.js](https://nextjs.org/)
- **Base de données** : [Postgres](https://www.postgresql.org/)
- **ORM** : [Drizzle](https://orm.drizzle.team/)
- **Paiements** : [Stripe](https://stripe.com/)
- **Bibliothèque UI** : [shadcn/ui](https://ui.shadcn.com/)

## Démarrage

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Exécution Locale

[Installez](https://docs.stripe.com/stripe-cli) et connectez-vous à votre compte Stripe :

```bash
stripe login
```

Utilisez le script de configuration inclus pour créer votre fichier `.env` :

```bash
pnpm db:setup
```

Exécutez les migrations de base de données et initialisez la base de données avec un utilisateur et une équipe par défaut :

```bash
pnpm db:migrate
pnpm db:seed
```

Cela créera l'utilisateur et l'équipe suivants :

- Utilisateur : `test@test.com`
- Mot de passe : `admin123`

Vous pouvez également créer de nouveaux utilisateurs via la route `/sign-up`.

Enfin, exécutez le serveur de développement Next.js :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application en action.

Vous pouvez écouter les webhooks Stripe localement via leur CLI pour gérer les événements de changement d'abonnement :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Test des Paiements

Pour tester les paiements Stripe, utilisez les détails de carte de test suivants :

- Numéro de carte : `4242 4242 4242 4242`
- Expiration : N'importe quelle date future
- CVC : N'importe quel nombre à 3 chiffres

## Passage en Production

Quand vous êtes prêt à déployer votre application SaaS en production, suivez ces étapes :

### Configuration d'un webhook Stripe de production

1. Allez dans le Tableau de bord Stripe et créez un nouveau webhook pour votre environnement de production.
2. Définissez l'URL du point de terminaison vers votre route API de production (ex. `https://yourdomain.com/api/stripe/webhook`).
3. Sélectionnez les événements que vous voulez écouter (ex. `checkout.session.completed`, `customer.subscription.updated`).

### Déploiement sur Vercel

1. Poussez votre code vers un dépôt GitHub.
2. Connectez votre dépôt à [Vercel](https://vercel.com/) et déployez-le.
3. Suivez le processus de déploiement Vercel, qui vous guidera dans la configuration de votre projet.

### Ajout des variables d'environnement

Dans les paramètres de votre projet Vercel (ou pendant le déploiement), ajoutez toutes les variables d'environnement nécessaires. Assurez-vous de mettre à jour les valeurs pour l'environnement de production, y compris :

1. `BASE_URL` : Définissez ceci vers votre domaine de production.
2. `STRIPE_SECRET_KEY` : Utilisez votre clé secrète Stripe pour l'environnement de production.
3. `STRIPE_WEBHOOK_SECRET` : Utilisez le secret du webhook du webhook de production que vous avez créé à l'étape 1.
4. `POSTGRES_URL` : Définissez ceci vers l'URL de votre base de données de production.
5. `AUTH_SECRET` : Définissez ceci comme une chaîne aléatoire. `openssl rand -base64 32` en générera une.

## Autres Modèles

Bien que ce modèle soit intentionnellement minimal et destiné à être utilisé comme ressource d'apprentissage, il existe d'autres versions payantes dans la communauté qui sont plus complètes :

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
