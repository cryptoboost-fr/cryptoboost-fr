-- 🔧 CORRECTION DES ERREURS 500 - CryptoBoost
-- ============================================

-- Ce script corrige les problèmes d'authentification et d'accès aux données
-- qui causent les erreurs 500 dans l'application

-- 1. Vérification et correction de l'utilisateur admin
-- ===================================================

-- Vérifier si l'admin existe dans auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@cryptoboost.world'
    ) THEN
        -- Créer l'admin dans auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@cryptoboost.world',
            crypt('CryptoAdmin2024!', gen_salt('bf')),
            NOW(),
            NULL,
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"role": "admin", "full_name": "Administrateur CryptoBoost"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Admin utilisateur cree dans auth.users';
    ELSE
        RAISE NOTICE 'Admin utilisateur existe deja dans auth.users';
    END IF;
END $$;

-- 2. Vérification et correction de l'utilisateur admin dans public.users
-- =====================================================================

-- Vérifier si l'admin existe dans public.users
DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- Récupérer l'ID de l'admin depuis auth.users
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@cryptoboost.world';
    
    IF admin_id IS NOT NULL THEN
        -- Vérifier si l'admin existe dans public.users
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = admin_id
        ) THEN
            -- Créer l'admin dans public.users
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
            
            RAISE NOTICE 'Admin utilisateur cree dans public.users';
        ELSE
            -- Mettre à jour l'admin existant
            UPDATE public.users 
            SET 
                email = 'admin@cryptoboost.world',
                full_name = 'Administrateur CryptoBoost',
                role = 'admin',
                status = 'active',
                updated_at = NOW()
            WHERE id = admin_id;
            
            RAISE NOTICE 'Admin utilisateur mis a jour dans public.users';
        END IF;
    ELSE
        RAISE NOTICE 'Admin utilisateur non trouve dans auth.users';
    END IF;
END $$;

-- 3. Correction des politiques RLS pour l'authentification
-- =======================================================

-- Désactiver temporairement RLS pour corriger les politiques
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

-- Recréer les politiques RLS corrigées
-- ====================================

-- Politiques pour la table users
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

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Politiques pour la table investment_plans
CREATE POLICY "Everyone can read investment plans" ON public.investment_plans
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage investment plans" ON public.investment_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Politiques pour la table crypto_wallets
CREATE POLICY "Everyone can read crypto wallets" ON public.crypto_wallets
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage crypto wallets" ON public.crypto_wallets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Politiques pour la table user_investments
CREATE POLICY "Users can view own investments" ON public.user_investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all investments" ON public.user_investments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can create investments" ON public.user_investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage investments" ON public.user_investments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Réactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- 4. Vérification de la structure des tables
-- ==========================================

-- Vérifier que toutes les colonnes nécessaires existent
DO $$
BEGIN
    -- Vérifier la colonne confirmed_at dans auth.users
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'confirmed_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Colonne confirmed_at ajoutee a auth.users';
    END IF;
    
    -- Vérifier la colonne qr_code_url dans crypto_wallets
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'crypto_wallets' 
        AND column_name = 'qr_code_url'
    ) THEN
        ALTER TABLE public.crypto_wallets ADD COLUMN qr_code_url TEXT;
        RAISE NOTICE 'Colonne qr_code_url ajoutee a crypto_wallets';
    END IF;
END $$;

-- 5. Mise à jour des données de test
-- ==================================

-- S'assurer que les données de test existent
INSERT INTO public.investment_plans (name, description, price, duration, created_at, updated_at)
VALUES 
    ('Starter', 'Plan de base pour débuter en crypto', 100, 30, NOW(), NOW()),
    ('Growth', 'Plan de croissance pour investisseurs confirmés', 500, 90, NOW(), NOW()),
    ('Premium', 'Plan premium pour investisseurs expérimentés', 1000, 180, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.crypto_wallets (crypto_type, wallet_address, qr_code_url, created_at, updated_at)
VALUES 
    ('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW(), NOW()),
    ('ETH', '0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6632C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW()),
    ('USDT', 'TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TRX9tT7w8Rt4RxW8KKnE8KqKqKqKqKqKqKqK', NOW(), NOW()),
    ('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', NOW(), NOW())
ON CONFLICT (crypto_type) DO NOTHING;

-- 6. Vérification finale
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

-- Afficher le nombre de politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Afficher le nombre d'enregistrements dans chaque table
SELECT 'investment_plans' as table_name, COUNT(*) as count FROM public.investment_plans
UNION ALL
SELECT 'crypto_wallets' as table_name, COUNT(*) as count FROM public.crypto_wallets
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'user_investments' as table_name, COUNT(*) as count FROM public.user_investments;

RAISE NOTICE 'Correction des erreurs 500 terminee avec succes!';