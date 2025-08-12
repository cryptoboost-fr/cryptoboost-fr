-- CORRECTION STRUCTURE TABLES - CryptoBoost
-- =========================================

-- Script pour verifier et corriger la structure des tables

-- 1. Verifier la structure des tables
-- ===================================

-- Afficher la structure de investment_plans
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'investment_plans'
ORDER BY ordinal_position;

-- Afficher la structure de crypto_wallets
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'crypto_wallets'
ORDER BY ordinal_position;

-- Afficher la structure de users
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Corriger la structure si necessaire
-- ======================================

-- Ajouter la colonne price si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'investment_plans' 
        AND column_name = 'price'
    ) THEN
        ALTER TABLE public.investment_plans ADD COLUMN price INTEGER DEFAULT 0;
    END IF;
END $$;

-- Ajouter la colonne duration si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'investment_plans' 
        AND column_name = 'duration'
    ) THEN
        ALTER TABLE public.investment_plans ADD COLUMN duration INTEGER DEFAULT 30;
    END IF;
END $$;

-- Ajouter la colonne qr_code_url si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'crypto_wallets' 
        AND column_name = 'qr_code_url'
    ) THEN
        ALTER TABLE public.crypto_wallets ADD COLUMN qr_code_url TEXT;
    END IF;
END $$;

-- 3. Nettoyer les donnees existantes
-- ==================================

DELETE FROM public.investment_plans;
DELETE FROM public.crypto_wallets;

-- 4. Creer les donnees avec la structure corrigee
-- ===============================================

-- Creer les plans d'investissement
INSERT INTO public.investment_plans (name, description, price, duration, created_at, updated_at)
VALUES 
    ('Starter', 'Plan de base pour debuter en crypto', 100, 30, NOW(), NOW()),
    ('Growth', 'Plan de croissance pour investisseurs confirmes', 500, 90, NOW(), NOW()),
    ('Premium', 'Plan premium pour investisseurs experimentes', 1000, 180, NOW(), NOW()),
    ('Expert', 'Plan premium avec les meilleures strategies', 2000, 365, NOW(), NOW()),
    ('Pro', 'Plan pour les investisseurs serieux', 5000, 365, NOW(), NOW());

-- Creer les wallets crypto
INSERT INTO public.crypto_wallets (crypto_type, wallet_address, qr_code_url, created_at, updated_at)
VALUES 
    ('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW()),
    ('ETH', '0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('USDT', 'TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', NOW(), NOW()),
    ('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('BNB', 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW());

-- 5. Creer l'admin
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

-- 6. Verifications finales
-- ========================

-- Afficher la structure finale
SELECT 'investment_plans structure:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'investment_plans' ORDER BY ordinal_position;

-- Compter les donnees
SELECT 'investment_plans' as table_name, COUNT(*) as count FROM public.investment_plans
UNION ALL
SELECT 'crypto_wallets' as table_name, COUNT(*) as count FROM public.crypto_wallets
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM public.users;

-- Afficher les plans
SELECT name, description, price, duration FROM public.investment_plans;

-- Afficher les wallets
SELECT crypto_type, wallet_address FROM public.crypto_wallets;

-- Verifier l'admin
SELECT 'admin' as check_type, COUNT(*) as count FROM auth.users WHERE email = 'admin@cryptoboost.world';

SELECT 'CORRECTION STRUCTURE TERMINEE' as status;