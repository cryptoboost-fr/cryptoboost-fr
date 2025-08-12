# 🧪 GUIDE DE TEST MANUEL - CryptoBoost

## 📋 **PRÉREQUIS**

Avant de commencer les tests, assurez-vous que :

1. **Le serveur de développement fonctionne** : `npm run dev`
2. **Les scripts SQL ont été exécutés** dans Supabase SQL Editor
3. **L'application est accessible** sur `http://localhost:5173`

## 🚀 **TESTS À EFFECTUER**

### **1. TEST DE LA PAGE D'ACCUEIL**

**URL** : `http://localhost:5173`

**Vérifications** :
- ✅ La page se charge sans erreur
- ✅ Le design est correct et responsive
- ✅ Les liens de navigation fonctionnent
- ✅ Le bouton "Se connecter" redirige vers `/auth/login`
- ✅ Le bouton "S'inscrire" redirige vers `/auth/register`

### **2. TEST D'INSCRIPTION CLIENT**

**URL** : `http://localhost:5173/auth/register`

**Étapes** :
1. Remplir le formulaire avec des données valides :
   - **Nom complet** : `Test Utilisateur`
   - **Email** : `test-${Date.now()}@example.com`
   - **Mot de passe** : `TestPassword123!`
   - **Confirmation** : `TestPassword123!`

2. Cliquer sur "Créer un compte"

**Résultats attendus** :
- ✅ Aucune erreur de validation
- ✅ Redirection automatique vers `/client/dashboard`
- ✅ Message de succès affiché
- ✅ Utilisateur connecté automatiquement

### **3. TEST DE CONNEXION ADMIN**

**URL** : `http://localhost:5173/auth/login`

**Étapes** :
1. Remplir le formulaire avec les identifiants admin :
   - **Email** : `admin@cryptoboost.world`
   - **Mot de passe** : `CryptoAdmin2024!`

2. Cliquer sur "Se connecter"

**Résultats attendus** :
- ✅ Connexion réussie
- ✅ Redirection vers `/admin/dashboard`
- ✅ Interface admin accessible
- ✅ Toutes les fonctionnalités admin disponibles

### **4. TEST DU DASHBOARD CLIENT**

**URL** : `http://localhost:5173/client/dashboard`

**Vérifications** :
- ✅ Page accessible après connexion client
- ✅ Affichage des informations utilisateur
- ✅ Liste des plans d'investissement visible
- ✅ Wallets crypto affichés
- ✅ Navigation fonctionnelle
- ✅ Déconnexion fonctionne

### **5. TEST DU DASHBOARD ADMIN**

**URL** : `http://localhost:5173/admin/dashboard`

**Vérifications** :
- ✅ Page accessible après connexion admin
- ✅ Liste de tous les utilisateurs
- ✅ Gestion des plans d'investissement
- ✅ Gestion des wallets crypto
- ✅ Statistiques et rapports
- ✅ Navigation admin complète

### **6. TEST DE DÉCONNEXION**

**Étapes** :
1. Se connecter (admin ou client)
2. Cliquer sur "Déconnexion"
3. Vérifier la redirection

**Résultats attendus** :
- ✅ Déconnexion réussie
- ✅ Redirection vers la page d'accueil
- ✅ Session supprimée
- ✅ Impossible d'accéder aux pages protégées

## 🔧 **TESTS DE SÉCURITÉ**

### **1. ACCÈS NON AUTORISÉ**

**Tests** :
- Essayer d'accéder à `/admin/dashboard` sans être admin
- Essayer d'accéder à `/client/dashboard` sans être connecté
- Essayer d'accéder aux pages protégées directement via URL

**Résultats attendus** :
- ✅ Redirection vers la page de connexion
- ✅ Messages d'erreur appropriés
- ✅ Aucun accès aux données sensibles

### **2. VALIDATION DES FORMULAIRES**

**Tests** :
- Soumettre des formulaires avec des données invalides
- Tester les limites de validation (emails, mots de passe)
- Essayer des injections SQL basiques

**Résultats attendus** :
- ✅ Messages d'erreur clairs
- ✅ Validation côté client et serveur
- ✅ Aucune vulnérabilité d'injection

## 📊 **CHECKLIST DE VALIDATION**

### **✅ FONCTIONNALITÉS DE BASE**
- [ ] Page d'accueil accessible
- [ ] Inscription client fonctionnelle
- [ ] Connexion admin fonctionnelle
- [ ] Connexion client fonctionnelle
- [ ] Déconnexion fonctionnelle
- [ ] Redirections correctes

### **✅ INTERFACES UTILISATEUR**
- [ ] Dashboard client accessible
- [ ] Dashboard admin accessible
- [ ] Navigation responsive
- [ ] Design cohérent
- [ ] Messages d'erreur clairs

### **✅ SÉCURITÉ**
- [ ] Protection des routes
- [ ] Validation des formulaires
- [ ] Gestion des sessions
- [ ] Accès restreint aux données

### **✅ DONNÉES**
- [ ] Plans d'investissement visibles
- [ ] Wallets crypto affichés
- [ ] Données utilisateur correctes
- [ ] Synchronisation avec Supabase

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **Erreur "permission denied"**
**Solution** : Exécuter `SUPPRESSION_IMMEDIATE_DUPLIQUES.sql` dans Supabase

### **Erreur de connexion admin**
**Solution** : Vérifier que l'admin existe avec `TEST_AUTHENTIFICATION_FINALE.sql`

### **Page blanche ou erreur 404**
**Solution** : Redémarrer le serveur avec `npm run dev`

### **Erreurs de validation**
**Solution** : Vérifier les règles de validation dans les composants

## 🎯 **CRITÈRES DE SUCCÈS**

L'application est considérée comme **100% fonctionnelle** si :

1. ✅ **Tous les tests de base passent**
2. ✅ **Authentification admin et client fonctionne**
3. ✅ **Interfaces utilisateur sont accessibles**
4. ✅ **Sécurité est respectée**
5. ✅ **Données sont synchronisées**

## 📝 **RAPPORT DE TEST**

Après avoir effectué tous les tests, documentez :

- **Tests réussis** : Liste des fonctionnalités qui marchent
- **Tests échoués** : Liste des problèmes rencontrés
- **Actions correctives** : Scripts SQL exécutés
- **Recommandations** : Améliorations suggérées

---

**🎉 Si tous les tests passent, CryptoBoost est prêt pour la production !**