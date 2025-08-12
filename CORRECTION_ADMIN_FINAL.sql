-- 🔧 CORRECTION ADMIN FINAL - CryptoBoost
-- =======================================

-- Script final corrigé pour créer l'admin sans erreurs de syntaxe

-- 1. Nettoyer les entrées existantes problématiques
-- =================================================

-- Supprimer l'admin existant s'il y a des problèmes
DELETE FROM public.users WHERE email = 'admin@cryptoboost.world';
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- 2. Créer l'admin étape par étape
-- =================================

-- Étape 1: Créer l'admin dans auth.users
DO $$
DECLARE
    new_admin_id uuid;
BEGIN
    -- Générer un nouvel UUID
    new_admin_id := gen_random_uuid();
    
    -- Insérer dans auth.users
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
        new_admin_id,
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
    
    -- Étape 2: Créer l'admin dans public.users avec le même ID
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        status,
        created_at,
        updated_at
    ) VALUES (
        new_admin_id,
        'admin@cryptoboost.world',
        'Administrateur CryptoBoost',
        'admin',
        'active',
        NOW(),
        NOW()
    );
    
END $$;

-- 3. Vérification
-- ===============

-- Vérifier que l'admin a été créé correctement
SELECT 
    'Verification Admin' as check_type,
    au.id as auth_id,
    au.email as auth_email,
    au.raw_user_meta_data->>'role' as auth_role,
    pu.id as public_id,
    pu.email as public_email,
    pu.role as public_role,
    pu.status
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@cryptoboost.world';

-- 4. Test de connexion
-- ====================

-- Créer une fonction de test simple
CREATE OR REPLACE FUNCTION test_admin_final()
RETURNS text AS $$
DECLARE
    admin_count integer;
    matching_count integer;
BEGIN
    -- Compter les admins dans auth.users
    SELECT COUNT(*) INTO admin_count 
    FROM auth.users 
    WHERE email = 'admin@cryptoboost.world';
    
    -- Compter les correspondances entre auth et public
    SELECT COUNT(*) INTO matching_count 
    FROM auth.users au
    JOIN public.users pu ON au.id = pu.id
    WHERE au.email = 'admin@cryptoboost.world';
    
    IF admin_count = 1 AND matching_count = 1 THEN
        RETURN 'SUCCESS: Admin created successfully';
    ELSE
        RETURN 'ERROR: Admin creation failed - auth: ' || admin_count || ', matching: ' || matching_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Exécuter le test
SELECT test_admin_final();

-- Nettoyer
DROP FUNCTION test_admin_final();

-- 5. Instructions finales
-- =======================

SELECT '=== ADMIN CREE AVEC SUCCES ===' as message;
SELECT 'Email: admin@cryptoboost.world' as credentials;
SELECT 'Mot de passe: CryptoAdmin2024!' as password;
SELECT 'Vous pouvez maintenant vous connecter a l''application' as next_step;