# À faire

> Liste des chantiers en attente. Créée le 18/11/2026.

## Emails envoyés aux parents

Principe (Laura, 18/11/2026) : **aucun email ne part vers un parent tant que Laura n'en a pas validé le texte.**

- [x] **Email de confirmation d'inscription** : validé et collé dans Supabase le 18/11.
- [x] **URL Configuration** Supabase faite le 18/11.
- [x] **Email « Mot de passe oublié »** : validé (version « Ça arrive ! ») et collé dans Supabase le 18/11.
- [x] **Page « Choisir un nouveau mot de passe »** : faite le 18/11 (`/nouveau-mot-de-passe`). Elle ne marche qu'une fois le modèle ci-dessus collé dans Supabase.

## Connecter Resend (pas encore fait : Laura ne connaît pas l'outil, à faire ensemble pas à pas)

Resend est le service qui envoie les emails de l'app. Il sert à deux choses :
- [ ] **L'email à Laura à chaque inscription** (nom, prénom, bébé, âge, code). Le code est prêt ; il manque une clé Resend valide (celle de `.env.local` est refusée). À faire : créer le compte Resend avec l'adresse Gmail de Laura, créer une clé, la mettre dans `.env.local` et sur Vercel avec `INSCRIPTION_NOTIF_EMAIL`.
- [ ] **Les emails envoyés aux parents** (confirmation, mot de passe) : brancher Supabase sur Resend (Authentication → SMTP), avec une adresse au nom de l'app. Sans ça, ils partent sous le nom « Supabase Auth » et Supabase n'en envoie que quelques-uns par heure. Demande un nom de domaine à soi (ex. nom-de-l-app.fr).

## Installation de l'app sur le téléphone

- [ ] **Email « Installer l'app sur votre téléphone »** (Laura, 18/11/2026) : pour le parent qui a fermé l'aide trop vite sans installer. Il reprend les gestes **iPhone** (Safari → Partager → « Sur l'écran d'accueil ») et **Android** (Chrome → menu ⋮ → « Installer l'application »), avec un bouton « Ouvrir l'app ». Modèle prêt : `supabase/emails/installation-app.html`, **à relire et valider par Laura**.
  - Envoyé par l'app via Resend, donc **après « Connecter Resend » avec un nom de domaine** (sans domaine, Resend ne peut écrire qu'à Laura).
  - Moment à décider : juste après la validation du profil (simple, part à tous, ceux qui ont installé l'ignorent), ou le lendemain seulement si l'app n'a jamais été ouverte depuis son icône (demande de noter l'ouverture depuis l'icône et une tâche quotidienne Vercel).
- [ ] Tester l'installation sur un vrai iPhone et un vrai Android après la mise en ligne.

## Inscription

- [x] Migration 0007 lancée, adresses de retour et deux emails collés dans Supabase, mise en ligne (18/11/2026).
- [ ] **Tester une vraie inscription sur téléphone** (adresse Gmail avec +test1, code BONNENUIT) : écran « Ouvrez vos emails », email reçu et picto lune visible, confirmation, « Présentez votre bébé », installation. Puis supprimer le compte fictif si besoin.
