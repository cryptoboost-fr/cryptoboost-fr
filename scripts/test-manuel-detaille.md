# 🎯 GUIDE DE TEST MANUEL DÉTAILLÉ - CryptoBoost

## 📋 **CHECKLIST COMPLÈTE DE VALIDATION**

### **🏠 1. PAGE D'ACCUEIL (`/`)**

#### **Éléments visuels à vérifier :**
- [ ] **Header/Navigation**
  - [ ] Logo CryptoBoost visible
  - [ ] Menu de navigation (Home, Plans, Wallets, Login, Register)
  - [ ] Bouton "Login" fonctionnel
  - [ ] Bouton "Register" fonctionnel
  - [ ] Menu responsive sur mobile

- [ ] **Section Hero**
  - [ ] Titre principal "CryptoBoost" visible
  - [ ] Sous-titre descriptif présent
  - [ ] Bouton "Commencer" ou "Get Started" fonctionnel
  - [ ] Image/illustration de fond

- [ ] **Section Plans d'investissement**
  - [ ] Affichage des 3 plans (Starter, Growth, Premium)
  - [ ] Prix et descriptions visibles
  - [ ] Boutons "Choisir" ou "Select" pour chaque plan
  - [ ] Redirection vers `/register` lors du clic

- [ ] **Section Wallets Crypto**
  - [ ] Affichage des wallets (BTC, ETH, USDT, USDC)
  - [ ] Adresses des wallets visibles
  - [ ] QR codes affichés (si présents)

- [ ] **Footer**
  - [ ] Liens de navigation
  - [ ] Informations de contact
  - [ ] Liens sociaux

#### **Actions à tester :**
- [ ] Clic sur "Login" → Redirection vers `/login`
- [ ] Clic sur "Register" → Redirection vers `/register`
- [ ] Clic sur "Commencer" → Redirection vers `/register`
- [ ] Clic sur un plan → Redirection vers `/register`
- [ ] Navigation mobile (hamburger menu)
- [ ] Scroll de la page
- [ ] Responsive design (tablette, mobile)

---

### **📝 2. PAGE D'INSCRIPTION (`/register`)**

#### **Éléments visuels à vérifier :**
- [ ] **Formulaire d'inscription**
  - [ ] Champ "Nom complet" (required)
  - [ ] Champ "Email" (required, validation email)
  - [ ] Champ "Mot de passe" (required, min 6 caractères)
  - [ ] Champ "Confirmer le mot de passe" (required, match)
  - [ ] Checkbox "J'accepte les conditions" (required)
  - [ ] Bouton "S'inscrire" ou "Register"
  - [ ] Lien "Déjà un compte ? Se connecter"

#### **Actions à tester :**
- [ ] **Validation des champs :**
  - [ ] Essayer de soumettre avec champs vides → Message d'erreur
  - [ ] Email invalide → Message d'erreur
  - [ ] Mot de passe trop court → Message d'erreur
  - [ ] Mots de passe différents → Message d'erreur
  - [ ] Checkbox non cochée → Message d'erreur

- [ ] **Inscription réussie :**
  - [ ] Remplir tous les champs correctement
  - [ ] Clic sur "S'inscrire"
  - [ ] Message de succès affiché
  - [ ] Redirection vers `/dashboard` ou `/login`
  - [ ] Email de confirmation envoyé (vérifier la boîte mail)

- [ ] **Navigation :**
  - [ ] Clic sur "Se connecter" → Redirection vers `/login`
  - [ ] Clic sur logo → Retour à l'accueil

---

### **🔐 3. PAGE DE CONNEXION (`/login`)**

#### **Éléments visuels à vérifier :**
- [ ] **Formulaire de connexion**
  - [ ] Champ "Email" (required)
  - [ ] Champ "Mot de passe" (required)
  - [ ] Checkbox "Se souvenir de moi" (optionnel)
  - [ ] Bouton "Se connecter" ou "Login"
  - [ ] Lien "Mot de passe oublié ?"
  - [ ] Lien "Pas de compte ? S'inscrire"

#### **Actions à tester :**
- [ ] **Connexion utilisateur :**
  - [ ] Email et mot de passe corrects d'un utilisateur
  - [ ] Clic sur "Se connecter"
  - [ ] Redirection vers `/dashboard`
  - [ ] Session utilisateur créée

- [ ] **Connexion admin :**
  - [ ] Email: `admin@cryptoboost.world`
  - [ ] Mot de passe: `CryptoAdmin2024!`
  - [ ] Clic sur "Se connecter"
  - [ ] Redirection vers `/admin`
  - [ ] Session admin créée

- [ ] **Gestion des erreurs :**
  - [ ] Email incorrect → Message d'erreur
  - [ ] Mot de passe incorrect → Message d'erreur
  - [ ] Champs vides → Message d'erreur

- [ ] **Navigation :**
  - [ ] Clic sur "S'inscrire" → Redirection vers `/register`
  - [ ] Clic sur "Mot de passe oublié" → Page de récupération

---

### **📊 4. DASHBOARD UTILISATEUR (`/dashboard`)**

#### **Éléments visuels à vérifier :**
- [ ] **Header du dashboard**
  - [ ] Nom de l'utilisateur affiché
  - [ ] Avatar/photo de profil
  - [ ] Menu déroulant utilisateur
  - [ ] Bouton de déconnexion

- [ ] **Sidebar/Navigation**
  - [ ] Menu "Dashboard" (actif)
  - [ ] Menu "Mes investissements"
  - [ ] Menu "Mon profil"
  - [ ] Menu "Paramètres"

- [ ] **Contenu principal**
  - [ ] Statistiques personnelles
  - [ ] Graphiques de performance
  - [ ] Derniers investissements
  - [ ] Notifications

#### **Actions à tester :**
- [ ] **Navigation :**
  - [ ] Clic sur "Mes investissements" → Page des investissements
  - [ ] Clic sur "Mon profil" → Page de profil
  - [ ] Clic sur "Paramètres" → Page des paramètres

- [ ] **Menu utilisateur :**
  - [ ] Clic sur avatar → Menu déroulant
  - [ ] Clic sur "Déconnexion" → Déconnexion et redirection vers `/`

- [ ] **Protection des routes :**
  - [ ] Essayer d'accéder sans être connecté → Redirection vers `/login`
  - [ ] Essayer d'accéder en tant qu'admin → Redirection vers `/admin`

---

### **👨‍💼 5. DASHBOARD ADMIN (`/admin`)**

#### **Éléments visuels à vérifier :**
- [ ] **Header admin**
  - [ ] "Dashboard Administrateur" affiché
  - [ ] Nom de l'admin
  - [ ] Bouton de déconnexion

- [ ] **Sidebar admin**
  - [ ] Menu "Vue d'ensemble" (actif)
  - [ ] Menu "Utilisateurs"
  - [ ] Menu "Investissements"
  - [ ] Menu "Plans d'investissement"
  - [ ] Menu "Wallets crypto"
  - [ ] Menu "Statistiques"
  - [ ] Menu "Paramètres"

- [ ] **Contenu principal**
  - [ ] Statistiques globales
  - [ ] Graphiques de performance
  - [ ] Dernières activités
  - [ ] Alertes et notifications

#### **Actions à tester :**
- [ ] **Gestion des utilisateurs :**
  - [ ] Clic sur "Utilisateurs" → Liste des utilisateurs
  - [ ] Voir les détails d'un utilisateur
  - [ ] Modifier le statut d'un utilisateur
  - [ ] Supprimer un utilisateur

- [ ] **Gestion des investissements :**
  - [ ] Clic sur "Investissements" → Liste des investissements
  - [ ] Voir les détails d'un investissement
  - [ ] Modifier un investissement

- [ ] **Gestion des plans :**
  - [ ] Clic sur "Plans d'investissement" → Liste des plans
  - [ ] Ajouter un nouveau plan
  - [ ] Modifier un plan existant
  - [ ] Supprimer un plan

- [ ] **Gestion des wallets :**
  - [ ] Clic sur "Wallets crypto" → Liste des wallets
  - [ ] Ajouter un nouveau wallet
  - [ ] Modifier un wallet existant
  - [ ] Supprimer un wallet

- [ ] **Protection des routes :**
  - [ ] Essayer d'accéder sans être admin → Redirection vers `/login`
  - [ ] Essayer d'accéder en tant qu'utilisateur → Redirection vers `/dashboard`

---

### **📈 6. PAGE DES PLANS (`/plans`)**

#### **Éléments visuels à vérifier :**
- [ ] **Liste des plans**
  - [ ] Affichage de tous les plans disponibles
  - [ ] Prix, description, durée de chaque plan
  - [ ] Bouton "Choisir" pour chaque plan
  - [ ] Filtres par catégorie (si présents)

#### **Actions à tester :**
- [ ] **Sans connexion :**
  - [ ] Clic sur "Choisir" → Redirection vers `/login`
  - [ ] Message "Connectez-vous pour investir"

- [ ] **Avec connexion utilisateur :**
  - [ ] Clic sur "Choisir" → Modal de confirmation
  - [ ] Confirmation d'investissement
  - [ ] Redirection vers `/dashboard`

- [ ] **Avec connexion admin :**
  - [ ] Boutons de modification/ suppression visibles
  - [ ] Clic sur "Modifier" → Formulaire d'édition
  - [ ] Clic sur "Supprimer" → Confirmation de suppression

---

### **💰 7. PAGE DES WALLETS (`/wallets`)**

#### **Éléments visuels à vérifier :**
- [ ] **Liste des wallets**
  - [ ] Affichage de tous les wallets crypto
  - [ ] Type de crypto, adresse, QR code
  - [ ] Bouton "Copier l'adresse"
  - [ ] Bouton "Télécharger QR code"

#### **Actions à tester :**
- [ ] **Fonctionnalités publiques :**
  - [ ] Clic sur "Copier l'adresse" → Adresse copiée
  - [ ] Clic sur "Télécharger QR code" → Téléchargement

- [ ] **Avec connexion admin :**
  - [ ] Boutons de modification/ suppression visibles
  - [ ] Clic sur "Ajouter wallet" → Formulaire d'ajout
  - [ ] Clic sur "Modifier" → Formulaire d'édition

---

### **👤 8. PAGE DE PROFIL (`/profile`)**

#### **Éléments visuels à vérifier :**
- [ ] **Informations personnelles**
  - [ ] Photo de profil
  - [ ] Nom complet
  - [ ] Email
  - [ ] Date d'inscription
  - [ ] Statut du compte

- [ ] **Formulaire de modification**
  - [ ] Champ "Nom complet" (modifiable)
  - [ ] Champ "Email" (modifiable)
  - [ ] Champ "Nouveau mot de passe" (optionnel)
  - [ ] Bouton "Sauvegarder"

#### **Actions à tester :**
- [ ] **Modification du profil :**
  - [ ] Changer le nom complet
  - [ ] Changer l'email
  - [ ] Changer le mot de passe
  - [ ] Sauvegarder les modifications
  - [ ] Vérifier que les changements sont appliqués

- [ ] **Validation :**
  - [ ] Email invalide → Message d'erreur
  - [ ] Mot de passe trop court → Message d'erreur

---

### **🔧 9. TESTS DE SÉCURITÉ**

#### **Protection des routes :**
- [ ] **Accès non autorisé :**
  - [ ] `/dashboard` sans connexion → Redirection `/login`
  - [ ] `/admin` sans connexion → Redirection `/login`
  - [ ] `/admin` avec utilisateur normal → Redirection `/dashboard`
  - [ ] `/profile` sans connexion → Redirection `/login`

- [ ] **Sessions :**
  - [ ] Déconnexion → Suppression de la session
  - [ ] Expiration de session → Redirection `/login`
  - [ ] Rafraîchissement de page → Session maintenue

#### **Validation des données :**
- [ ] **Injection SQL :**
  - [ ] Essayer des caractères spéciaux dans les formulaires
  - [ ] Vérifier que les données sont échappées

- [ ] **XSS :**
  - [ ] Essayer des scripts dans les champs texte
  - [ ] Vérifier que le HTML est échappé

---

### **📱 10. TESTS RESPONSIVE**

#### **Desktop (1920x1080) :**
- [ ] Navigation complète visible
- [ ] Sidebar déployée
- [ ] Graphiques et tableaux lisibles

#### **Tablette (768x1024) :**
- [ ] Menu hamburger fonctionnel
- [ ] Sidebar rétractable
- [ ] Contenu adapté à l'écran

#### **Mobile (375x667) :**
- [ ] Menu hamburger obligatoire
- [ ] Boutons et liens touchables
- [ ] Texte lisible
- [ ] Formulaires utilisables

---

### **⚡ 11. TESTS DE PERFORMANCE**

#### **Temps de chargement :**
- [ ] Page d'accueil < 3 secondes
- [ ] Dashboard < 2 secondes
- [ ] Images optimisées
- [ ] CSS/JS minifiés

#### **Interactions :**
- [ ] Clics réactifs (< 100ms)
- [ ] Animations fluides
- [ ] Pas de blocage de l'interface

---

### **🎯 12. TESTS DE FONCTIONNALITÉS SPÉCIFIQUES**

#### **Authentification :**
- [ ] Inscription avec email valide
- [ ] Connexion avec credentials corrects
- [ ] Déconnexion complète
- [ ] Récupération de mot de passe

#### **Gestion des investissements :**
- [ ] Création d'un investissement
- [ ] Modification d'un investissement
- [ ] Suppression d'un investissement
- [ ] Calcul des gains/pertes

#### **Notifications :**
- [ ] Messages de succès
- [ ] Messages d'erreur
- [ ] Notifications en temps réel
- [ ] Emails de confirmation

---

## 📊 **RÉSULTATS DU TEST**

### **✅ TESTS RÉUSSIS :**
- [ ] Page d'accueil : ___/___ tests
- [ ] Inscription : ___/___ tests
- [ ] Connexion : ___/___ tests
- [ ] Dashboard utilisateur : ___/___ tests
- [ ] Dashboard admin : ___/___ tests
- [ ] Plans d'investissement : ___/___ tests
- [ ] Wallets crypto : ___/___ tests
- [ ] Profil utilisateur : ___/___ tests
- [ ] Sécurité : ___/___ tests
- [ ] Responsive : ___/___ tests
- [ ] Performance : ___/___ tests

### **❌ TESTS ÉCHOUÉS :**
- [ ] Problèmes identifiés :
- [ ] Actions correctives nécessaires :

### **📈 SCORE GLOBAL :**
- **Total des tests :** ___/___
- **Taux de succès :** ___%
- **Évaluation :** Excellent / Bon / Moyen / Critique

---

## 🎉 **VALIDATION FINALE**

### **✅ APPLICATION VALIDÉE :**
- [ ] Tous les tests critiques réussis
- [ ] Fonctionnalités principales opérationnelles
- [ ] Sécurité validée
- [ ] Performance acceptable
- [ ] Interface utilisateur fonctionnelle

### **🚀 PRÊT POUR LA PRODUCTION :**
- [ ] Tests de régression effectués
- [ ] Documentation mise à jour
- [ ] Déploiement validé
- [ ] Monitoring configuré

---

**🎯 CryptoBoost est maintenant prêt pour les utilisateurs finaux !**