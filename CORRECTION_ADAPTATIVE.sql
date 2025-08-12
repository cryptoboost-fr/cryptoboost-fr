-- CORRECTION ADAPTATIVE - CryptoBoost
-- ===================================

-- Script qui s'adapte a la structure existante des tables

-- 1. Verifier la structure existante
-- ==================================

-- Afficher les colonnes de investment_plans
SELECT column_name FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'investment_plans' 
ORDER BY ordinal_position;

-- Afficher les colonnes de crypto_wallets
SELECT column_name FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'crypto_wallets' 
ORDER BY ordinal_position;

-- 2. Nettoyer les donnees existantes
-- ==================================

DELETE FROM public.investment_plans;
DELETE FROM public.crypto_wallets;

-- 3. Creer les donnees selon la structure existante
-- =================================================

-- Insérer dans investment_plans selon les colonnes disponibles
INSERT INTO public.investment_plans (name, description, created_at, updated_at)
VALUES 
    ('Starter', 'Plan de base pour debuter en crypto', NOW(), NOW()),
    ('Growth', 'Plan de croissance pour investisseurs confirmes', NOW(), NOW()),
    ('Premium', 'Plan premium pour investisseurs experimentes', NOW(), NOW()),
    ('Expert', 'Plan premium avec les meilleures strategies', NOW(), NOW()),
    ('Pro', 'Plan pour les investisseurs serieux', NOW(), NOW());

-- Insérer dans crypto_wallets selon les colonnes disponibles
INSERT INTO public.crypto_wallets (crypto_type, wallet_address, created_at, updated_at)
VALUES 
    ('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW()),
    ('ETH', '0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('USDT', 'TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', NOW(), NOW()),
    ('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('BNB', 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW());

-- 4. Creer l'admin
-- ================

-- Supprimer l'admin existant
DELETE FROM public.users WHERE email = 'admin@cryptoboost.world';
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- Creer l'admin dans auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@cryptoboost.world',
    crypt('CryptoAdmin2024!', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "full_name": "Administrateur CryptoBoost"}',
    NOW(),
    NOW()
);

-- Creer l'admin dans public.users
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status,
    created_at,
    updated_at
) 
SELECT 
    id,
    'admin@cryptoboost.world',
    'Administrateur CryptoBoost',
    'admin',
    'active',
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'admin@cryptoboost.world';

-- 5. Verifications
-- ================

-- Compter les donnees
SELECT 'investment_plans' as table_name, COUNT(*) as count FROM public.investment_plans
UNION ALL
SELECT 'crypto_wallets' as table_name, COUNT(*) as count FROM public.crypto_wallets
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM public.users;

-- Afficher les plans
SELECT name, description FROM public.investment_plans;

-- Afficher les wallets
SELECT crypto_type, wallet_address FROM public.crypto_wallets;

-- Verifier l'admin
SELECT 'admin' as check_type, COUNT(*) as count FROM auth.users WHERE email = 'admin@cryptoboost.world';

SELECT 'CORRECTION ADAPTATIVE TERMINEE' as status;