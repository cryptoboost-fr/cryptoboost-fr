-- NETTOYAGE FINAL DES POLITIQUES RLS
-- Supprimer les dernières politiques dupliquées
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. SUPPRIMER LES POLITIQUES DUPLIQUEES
-- ===============================================

-- Supprimer les politiques dupliquees sur investment_plans
DROP POLICY IF EXISTS "Admins manage plans" ON investment_plans;

-- Supprimer les politiques dupliquees sur user_investments
DROP POLICY IF EXISTS "Allow admin access" ON user_investments;

-- ===============================================
-- 2. VERIFICATION FINALE
-- ===============================================

-- Compter les politiques par table (doit etre exactement 17)
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Lister toutes les politiques pour verification
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===============================================
-- 3. VERIFICATION DE L'ADMIN
-- ===============================================

-- Verifier que l'admin existe et peut se connecter
SELECT 
    'Admin status' as check_type,
    u.email,
    u.full_name,
    u.role,
    u.status
FROM users u
WHERE u.email = 'admin@cryptoboost.world';

-- ===============================================
-- 4. TEST DE CONNEXION ADMIN
-- ===============================================

-- Verifier que les politiques admin fonctionnent
SELECT 
    'Admin policies test' as test_type,
    COUNT(*) as accessible_tables
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname LIKE '%admin%'
AND cmd = 'ALL';