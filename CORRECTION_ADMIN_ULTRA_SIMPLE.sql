-- 🔧 CORRECTION ADMIN ULTRA SIMPLE - CryptoBoost
-- ===============================================

-- Script ultra-simple pour créer l'admin sans erreurs de syntaxe

-- 1. Nettoyer les entrées existantes
-- ===================================

DELETE FROM public.users WHERE email = 'admin@cryptoboost.world';
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- 2. Créer l'admin dans auth.users
-- =================================

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

-- 3. Créer l'admin dans public.users avec le même ID
-- ===================================================

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

-- 4. Vérification
-- ===============

-- Vérifier que l'admin existe dans auth.users
SELECT 'auth.users' as table_name, COUNT(*) as count 
FROM auth.users 
WHERE email = 'admin@cryptoboost.world';

-- Vérifier que l'admin existe dans public.users
SELECT 'public.users' as table_name, COUNT(*) as count 
FROM public.users 
WHERE email = 'admin@cryptoboost.world';

-- Vérifier la correspondance des IDs
SELECT 
    au.id as auth_id,
    pu.id as public_id,
    CASE WHEN au.id = pu.id THEN 'MATCH' ELSE 'MISMATCH' END as status
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
WHERE au.email = 'admin@cryptoboost.world';

-- 5. Afficher les informations de connexion
-- ==========================================

SELECT 'ADMIN CREE AVEC SUCCES' as status;
SELECT 'Email: admin@cryptoboost.world' as email;
SELECT 'Mot de passe: CryptoAdmin2024!' as password;