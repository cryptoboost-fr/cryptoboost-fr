-- 🔧 CORRECTION FINALE SANS ACCENTS - CryptoBoost
-- ===============================================

-- Ce script corrige les problèmes identifiés sans utiliser d'accents
-- pour éviter les erreurs de syntaxe SQL

-- 1. Nettoyage des donnees dupliquees
-- ===================================

-- Supprimer les plans d'investissement dupliques
DELETE FROM public.investment_plans 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM public.investment_plans 
    GROUP BY name
);

-- Recréer les plans d'investissement propres
INSERT INTO public.investment_plans (name, description, price, duration, created_at, updated_at)
VALUES 
    ('Starter', 'Plan de base pour debuter en crypto', 100, 30, NOW(), NOW()),
    ('Growth', 'Plan de croissance pour investisseurs confirmes', 500, 90, NOW(), NOW()),
    ('Premium', 'Plan premium pour investisseurs experimentes', 1000, 180, NOW(), NOW()),
    ('Expert', 'Plan premium avec les meilleures strategies et support dedie', 2000, 365, NOW(), NOW()),
    ('Pro', 'Plan pour les investisseurs serieux avec des performances optimisees', 5000, 365, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Nettoyage des wallets crypto
-- ===============================

-- Supprimer les wallets dupliques
DELETE FROM public.crypto_wallets 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM public.crypto_wallets 
    GROUP BY crypto_type
);

-- Recréer les wallets crypto propres
INSERT INTO public.crypto_wallets (crypto_type, wallet_address, qr_code_url, created_at, updated_at)
VALUES 
    ('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW()),
    ('ETH', '0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('USDT', 'TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', NOW(), NOW()),
    ('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('BNB', 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW())
ON CONFLICT (crypto_type) DO NOTHING;

-- 3. Correction de l'utilisateur admin
-- ====================================

-- Verifier et corriger l'admin dans auth.users
DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- Recuperer l'ID de l'admin existant
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@cryptoboost.world';
    
    IF admin_id IS NULL THEN
        -- Creer l'admin s'il n'existe pas
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
        
        SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@cryptoboost.world';
    END IF;
    
    -- S'assurer que l'admin existe dans public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_id) THEN
        INSERT INTO public.users (
            id,
            email,
            full_name,
            role,
            status,
            created_at,
            updated_at
        ) VALUES (
            admin_id,
            'admin@cryptoboost.world',
            'Administrateur CryptoBoost',
            'admin',
            'active',
            NOW(),
            NOW()
        );
    END IF;
    
END $$;

-- 4. Correction des politiques RLS
-- ================================

-- Desactiver temporairement RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Everyone can read investment plans" ON public.investment_plans;
DROP POLICY IF EXISTS "Admins can manage investment plans" ON public.investment_plans;
DROP POLICY IF EXISTS "Everyone can read crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Admins can manage crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can view own investments" ON public.user_investments;
DROP POLICY IF EXISTS "Admins can view all investments" ON public.user_investments;
DROP POLICY IF EXISTS "Users can create investments" ON public.user_investments;
DROP POLICY IF EXISTS "Admins can manage investments" ON public.user_investments;

-- Recréer les politiques RLS simplifiees
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Everyone can read investment plans" ON public.investment_plans
    FOR SELECT USING (true);

CREATE POLICY "Everyone can read crypto wallets" ON public.crypto_wallets
    FOR SELECT USING (true);

CREATE POLICY "Users can view own investments" ON public.user_investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create investments" ON public.user_investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- 5. Verification finale
-- ======================

-- Afficher le statut de l'admin
SELECT 
    'Admin Status' as check_type,
    au.email,
    pu.full_name,
    pu.role,
    pu.status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@cryptoboost.world';

-- Afficher le nombre d'enregistrements dans chaque table
SELECT 'investment_plans' as table_name, COUNT(*) as count FROM public.investment_plans
UNION ALL
SELECT 'crypto_wallets' as table_name, COUNT(*) as count FROM public.crypto_wallets
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'user_investments' as table_name, COUNT(*) as count FROM public.user_investments;

-- Afficher les plans d'investissement
SELECT name, description, price, duration FROM public.investment_plans ORDER BY price;

-- Afficher les wallets crypto
SELECT crypto_type, wallet_address FROM public.crypto_wallets ORDER BY crypto_type;

SELECT 'CORRECTION TERMINEE AVEC SUCCES' as status;