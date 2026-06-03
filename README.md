# LindaStay MVP

Application simple pour propriétaires de maisons de vacances.

## Fonctions incluses

- Connexion / inscription Supabase
- Rôle admin et propriétaire
- Activation / expiration abonnement par admin
- Gestion des maisons
- Gestion des réservations
- Calcul avance / reste
- Dépenses intelligentes paramétrables
- Génération automatique des dépenses à partir d'une réservation
- Dashboard revenus / dépenses / bénéfice net
- Bouton WhatsApp pour envoyer les infos d'arrivée

## Installation Supabase

1. Crée un projet sur Supabase.
2. Va dans SQL Editor.
3. Copie le fichier `supabase/schema.sql` et exécute-le.
4. Va dans Project Settings > API.
5. Copie :
   - Project URL
   - anon public key
6. Colle-les dans `js/config.js`.

## Créer un admin

1. Inscris-toi dans l'application avec ton email.
2. Dans Supabase > Table editor > profiles
3. Change ton rôle :

```text
role = admin
subscription_status = active
```

## Lancer localement

Ouvre `index.html` avec un petit serveur local, par exemple VS Code Live Server.

## Déploiement GitHub Pages

1. Mets tous les fichiers dans un repository GitHub.
2. Active GitHub Pages.
3. Source : main branch / root.
4. Ouvre l'URL générée.

## Important

C'est un MVP pour tester rapidement avec les premiers propriétaires. Avant de vendre à grande échelle, il faudra ajouter :

- design plus professionnel
- modification/suppression détaillée
- vraie gestion calendrier
- paiement automatique Stripe / Konnect / PayPal
- emails transactionnels
- backups
- conditions générales et politique de confidentialité
