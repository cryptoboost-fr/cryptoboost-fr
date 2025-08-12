# 🔧 GUIDE DE CORRECTION DES ERREURS 500 - CryptoBoost

## 📊 **DIAGNOSTIC DES PROBLÈMES**

### **❌ PROBLÈME IDENTIFIÉ :**
- **Erreur principale :** `Invalid API key` (401 Unauthorized)
- **Cause :** Clé API Supabase invalide ou incorrecte
- **Impact :** Toutes les fonctionnalités d'authentification échouent

### **🔍 ANALYSE DÉTAILLÉE :**

Les erreurs 500 que vous voyez dans la console sont causées par :
1. **Clé API Supabase invalide** - La clé `anon` n'est pas correcte
2. **Configuration Supabase incorrecte** - URL ou clé API mal configurées
3. **Politiques RLS bloquantes** - Accès refusé aux données

---

## 🎯 **SOLUTIONS IMMÉDIATES**

### **1. VÉRIFIER LA CONFIGURATION SUPABASE**

#### **Étape 1 : Accéder au Dashboard Supabase**
1. Aller sur https://supabase.com
2. Se connecter à votre compte
3. Sélectionner le projet CryptoBoost

#### **Étape 2 : Récupérer les bonnes clés API**
1. Aller dans **Settings** → **API**
2. Copier les informations suivantes :
   - **Project URL** : `https://ropzeweidvjkfeyyuiim.supabase.co`
   - **anon public** : Clé publique pour l'authentification
   - **service_role** : Clé privée pour l'administration

#### **Étape 3 : Mettre à jour les variables d'environnement**
Dans votre projet Netlify ou fichier `.env` :

```env
VITE_SUPABASE_URL=https://ropzeweidvjkfeyyuiim.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_correcte_ici
```

### **2. CORRIGER LA CONFIGURATION DANS LE CODE**

#### **Fichier : `src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### **Vérifier que les variables sont bien définies :**
```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

### **3. EXÉCUTER LE SCRIPT DE CORRECTION**

#### **Étape 1 : Exécuter le script SQL**
1. Aller dans Supabase Dashboard → **SQL Editor**
2. Copier et exécuter le contenu de `CORRECTION_ERREURS_500.sql`
3. Vérifier que toutes les commandes s'exécutent sans erreur

#### **Étape 2 : Vérifier les résultats**
Le script doit afficher :
- ✅ Admin utilisateur créé/mis à jour
- ✅ Politiques RLS corrigées
- ✅ Données de test insérées

---

## 🔧 **CORRECTIONS SPÉCIFIQUES**

### **1. CORRECTION DES POLITIQUES RLS**

Si les politiques RLS causent des problèmes, exécutez ce script simplifié :

```sql
-- Désactiver temporairement RLS pour les tests
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments DISABLE ROW LEVEL SECURITY;

-- Permettre l'accès public aux données de base
CREATE POLICY "Allow public read access" ON public.investment_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.crypto_wallets FOR SELECT USING (true);

-- Réactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
```

### **2. CRÉATION DE L'UTILISATEUR ADMIN**

Si l'admin n'existe pas, créez-le manuellement :

```sql
-- Créer l'admin dans auth.users
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@cryptoboost.world',
    crypt('CryptoAdmin2024!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "full_name": "Administrateur CryptoBoost"}',
    NOW(),
    NOW()
);
```

### **3. VÉRIFICATION DE LA STRUCTURE**

Vérifiez que toutes les tables existent :

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'investment_plans', 'crypto_wallets', 'user_investments');

-- Vérifier les colonnes de la table users
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users';
```

---

## 🧪 **TESTS DE VALIDATION**

### **1. TEST DE CONNEXION DE BASE**

Après avoir corrigé la configuration, testez :

```javascript
// Dans la console du navigateur
const { createClient } = await import('https://esm.sh/@supabase/supabase-js')
const supabase = createClient(
  'https://ropzeweidvjkfeyyuiim.supabase.co',
  'votre_clé_anon_correcte'
)

// Test de connexion
const { data, error } = await supabase.from('investment_plans').select('*')
console.log('Test connexion:', { data, error })
```

### **2. TEST D'AUTHENTIFICATION**

```javascript
// Test de connexion admin
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@cryptoboost.world',
  password: 'CryptoAdmin2024!'
})
console.log('Test auth:', { data, error })
```

### **3. TEST D'ACCÈS AUX DONNÉES**

```javascript
// Test d'accès aux plans
const { data: plans, error: plansError } = await supabase
  .from('investment_plans')
  .select('*')
console.log('Plans:', plans, plansError)

// Test d'accès aux wallets
const { data: wallets, error: walletsError } = await supabase
  .from('crypto_wallets')
  .select('*')
console.log('Wallets:', wallets, walletsError)
```

---

## 📋 **CHECKLIST DE CORRECTION**

### **✅ ÉTAPES OBLIGATOIRES :**

- [ ] **Vérifier les clés API** dans Supabase Dashboard
- [ ] **Mettre à jour les variables d'environnement** dans Netlify
- [ ] **Exécuter le script de correction** `CORRECTION_ERREURS_500.sql`
- [ ] **Tester la connexion de base** avec les nouvelles clés
- [ ] **Tester l'authentification admin** avec les credentials
- [ ] **Vérifier l'accès aux données** (plans, wallets)
- [ ] **Tester l'inscription utilisateur** avec un email de test

### **✅ VÉRIFICATIONS FINALES :**

- [ ] **Plus d'erreurs 500** dans la console
- [ ] **Authentification fonctionnelle** (login/register)
- [ ] **Données affichées** (plans, wallets)
- [ ] **Navigation fluide** entre les pages
- [ ] **Dashboard admin accessible** après connexion

---

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS**

### **1. "Invalid API key" persistant**
**Solution :** Vérifier que la clé `anon` est bien copiée (pas la `service_role`)

### **2. "Permission denied" sur les tables**
**Solution :** Exécuter le script de correction des politiques RLS

### **3. "User not found" lors de la connexion admin**
**Solution :** Créer manuellement l'utilisateur admin avec le script SQL

### **4. "Network error" lors des requêtes**
**Solution :** Vérifier l'URL Supabase et la connectivité réseau

---

## 🎯 **RÉSULTAT ATTENDU**

Après avoir suivi ce guide, vous devriez avoir :

✅ **Plus d'erreurs 500** dans la console  
✅ **Authentification fonctionnelle**  
✅ **Données affichées correctement**  
✅ **Navigation fluide**  
✅ **Toutes les fonctionnalités opérationnelles**  

---

## 📞 **SUPPORT**

Si les problèmes persistent après avoir suivi ce guide :

1. **Vérifiez les logs** dans Supabase Dashboard → Logs
2. **Testez avec Postman** ou un outil similaire
3. **Contactez le support** avec les détails des erreurs

---

**🎯 Suivez ce guide étape par étape pour résoudre définitivement les erreurs 500 !**