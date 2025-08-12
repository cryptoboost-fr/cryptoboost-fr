-- TEST AUTHENTIFICATION FINALE
-- Verifier que tout fonctionne correctement
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. VERIFICATION DE L'ADMIN
-- ===============================================

-- Verifier que l'admin existe
SELECT 
    'Admin existe' as test,
    u.email,
    u.full_name,
    u.role,
    u.status
FROM users u
WHERE u.email = 'admin@cryptoboost.world';

-- ===============================================
-- 2. VERIFICATION DES DONNEES
-- ===============================================

-- Compter les plans d'investissement
SELECT 
    'Plans d''investissement' as type,
    COUNT(*) as nombre
FROM investment_plans 
WHERE is_active = true;

-- Compter les wallets crypto
SELECT 
    'Wallets crypto' as type,
    COUNT(*) as nombre
FROM crypto_wallets 
WHERE is_active = true;

-- ===============================================
-- 3. VERIFICATION DES POLITIQUES RLS
-- ===============================================

-- Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Verifier les politiques admin
SELECT 
    'Politiques admin' as type,
    COUNT(*) as nombre
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname LIKE '%admin%'
AND cmd = 'ALL';

-- ===============================================
-- 4. VERIFICATION DE LA STRUCTURE
-- ===============================================

-- Verifier que la colonne qr_code_url existe
SELECT 
    'Colonne qr_code_url' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'crypto_wallets' 
            AND column_name = 'qr_code_url'
        ) THEN 'Existe'
        ELSE 'Manquante'
    END as status;

-- ===============================================
-- 5. RESUME FINAL
-- ===============================================

SELECT 
    'RESUME FINAL' as section,
    'Configuration CryptoBoost' as description,
    'Pret pour l''authentification' as status;