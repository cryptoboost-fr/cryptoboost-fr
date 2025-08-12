-- VERIFICATION FINALE DES POLITIQUES RLS
-- Confirmer l'état actuel des politiques
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. COMPTER LES POLITIQUES PAR TABLE
-- ===============================================

SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ===============================================
-- 2. LISTER TOUTES LES POLITIQUES
-- ===============================================

SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===============================================
-- 3. VERIFIER L'ADMIN
-- ===============================================

SELECT 
    'Admin status' as check_type,
    u.email,
    u.full_name,
    u.role,
    u.status
FROM users u
WHERE u.email = 'admin@cryptoboost.world';

-- ===============================================
-- 4. VERIFIER LES DONNEES PAR DEFAUT
-- ===============================================

-- Plans d'investissement
SELECT 
    'Plans d''investissement' as type,
    COUNT(*) as nombre
FROM investment_plans 
WHERE is_active = true;

-- Wallets crypto
SELECT 
    'Wallets crypto' as type,
    COUNT(*) as nombre
FROM crypto_wallets 
WHERE is_active = true;

-- ===============================================
-- 5. TEST DE CONNEXION ADMIN
-- ===============================================

-- Vérifier que l'admin peut se connecter
SELECT 
    'Test connexion admin' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM auth.users 
            WHERE email = 'admin@cryptoboost.world'
            AND email_confirmed_at IS NOT NULL
        ) THEN 'Admin prêt pour connexion'
        ELSE 'Admin non configuré'
    END as status;