# 🔑 GUIDE DE RÉCUPÉRATION DES CLÉS API - CryptoBoost

## 📊 **PROBLÈME IDENTIFIÉ**

### **❌ ERREUR :**
```
Invalid API key
```

### **🔍 CAUSE :**
- Les clés API Supabase utilisées dans le code ne sont pas correctes
- Les variables d'environnement ne sont pas configurées
- Les clés ont peut-être été régénérées ou modifiées

---

## 🎯 **SOLUTION : RÉCUPÉRER LES BONNES CLÉS**

### **1. ACCÉDER AU DASHBOARD SUPABASE**

#### **Étapes :**
1. **Aller sur** https://supabase.com
2. **Se connecter** à votre compte
3. **Sélectionner** le projet CryptoBoost
4. **Vérifier** que vous êtes dans le bon projet

### **2. RÉCUPÉRER LES CLÉS API**

#### **Étapes :**
1. **Aller dans** Settings (⚙️) → **API**
2. **Copier** les informations suivantes :

#### **📋 INFORMATIONS À RÉCUPÉRER :**

```
Project URL: https://ropzeweidvjkfeyyuiim.supabase.co
anon public: [VOTRE_CLÉ_ANON_ICI]
service_role: [VOTRE_CLÉ_SERVICE_ROLE_ICI]
```

#### **🔑 TYPES DE CLÉS :**

- **`anon public`** : Clé publique pour l'authentification et l'accès public
- **`service_role`** : Clé privée pour l'administration (à garder secrète)

---

## 🔧 **CONFIGURATION DES VARIABLES D'ENVIRONNEMENT**

### **1. DANS NETLIFY (PRODUCTION)**

#### **Étapes :**
1. **Aller sur** https://app.netlify.com
2. **Sélectionner** votre site CryptoBoost
3. **Aller dans** Site settings → **Environment variables**
4. **Ajouter/Modifier** les variables :

```env
VITE_SUPABASE_URL=https://ropzeweidvjkfeyyuiim.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_correcte_ici
```

### **2. DANS LE FICHIER .ENV (DÉVELOPPEMENT)**

#### **Créer/modifier** le fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://ropzeweidvjkfeyyuiim.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_correcte_ici
```

### **3. VÉRIFICATION DANS LE CODE**

#### **Fichier : `src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🧪 **TEST DE VALIDATION**

### **1. TEST AVEC LE SCRIPT**

#### **Exécuter le script de test :**
```bash
node scripts/test-avec-bonnes-cles.mjs
```

#### **Ou tester manuellement dans la console du navigateur :**
```javascript
// Remplacer par vos vraies clés
const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const supabaseKey = 'VOTRE_CLÉ_ANON_ICI';

const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
const { data, error } = await supabase.from('investment_plans').select('*');
console.log('Test connexion:', { data, error });

// Test d'authentification admin
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'admin@cryptoboost.world',
  password: 'CryptoAdmin2024!'
});
console.log('Test auth:', { authData, authError });
```

### **2. VÉRIFICATIONS MANUELLES**

#### **✅ Vérifications à faire :**
- [ ] **Application accessible** sur https://cryptoboost.world
- [ ] **Page de connexion** fonctionnelle
- [ ] **Inscription utilisateur** possible
- [ ] **Connexion admin** avec admin@cryptoboost.world
- [ ] **Données affichées** (plans, wallets)
- [ ] **Navigation fluide** entre les pages

---

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **1. "Invalid API key" persistant**
**Solution :** Vérifier que la clé `anon` est bien copiée (pas la `service_role`)

### **2. "Environment variable not found"**
**Solution :** Vérifier que les variables d'environnement sont bien définies

### **3. "Project not found"**
**Solution :** Vérifier l'URL du projet dans Supabase Dashboard

### **4. "Permission denied"**
**Solution :** Vérifier que la clé a les bonnes permissions

---

## 📋 **CHECKLIST DE CONFIGURATION**

### **✅ ÉTAPES OBLIGATOIRES :**

- [ ] **Récupérer les clés** dans Supabase Dashboard
- [ ] **Mettre à jour les variables** dans Netlify
- [ ] **Créer/modifier le fichier .env** local
- [ ] **Tester la connexion** avec le script
- [ ] **Vérifier l'authentification** admin
- [ ] **Tester l'inscription** utilisateur
- [ ] **Vérifier l'affichage** des données

### **✅ VÉRIFICATIONS FINALES :**

- [ ] **Plus d'erreur "Invalid API key"**
- [ ] **Authentification fonctionnelle**
- [ ] **Données accessibles**
- [ ] **Application entièrement opérationnelle**

---

## 🔄 **PROCESSUS DE RÉCUPÉRATION**

### **En cas de perte des clés :**

1. **Aller dans** Supabase Dashboard → Settings → API
2. **Régénérer** les clés si nécessaire
3. **Mettre à jour** toutes les variables d'environnement
4. **Redéployer** l'application
5. **Tester** toutes les fonctionnalités

---

## 📞 **SUPPORT**

Si les problèmes persistent :

1. **Vérifiez les logs** dans Supabase Dashboard → Logs
2. **Testez avec Postman** ou un outil similaire
3. **Contactez le support** avec les détails des erreurs

---

## 🎯 **RÉSULTAT ATTENDU**

Après avoir suivi ce guide, vous devriez avoir :

✅ **Clés API correctement configurées**  
✅ **Plus d'erreur "Invalid API key"**  
✅ **Authentification admin fonctionnelle**  
✅ **Inscription utilisateur opérationnelle**  
✅ **Application 100% fonctionnelle**  

---

**🎯 Suivez ce guide étape par étape pour résoudre définitivement le problème des clés API !**