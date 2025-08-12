-- 🔧 CORRECTION ADMIN ID - CryptoBoost
-- ====================================

-- Ce script corrige le problème d'ID nul lors de la création de l'admin
-- en s'assurant que l'ID est correctement généré et utilisé

-- 1. Vérifier la structure de la table users
-- ==========================================

-- Afficher la structure de la table users
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Vérifier si l'admin existe déjà
-- ===================================

-- Vérifier dans auth.users
SELECT 
    'auth.users' as table_name,
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@cryptoboost.world';

-- Vérifier dans public.users
SELECT 
    'public.users' as table_name,
    id,
    email,
    role,
    status
FROM public.users 
WHERE email = 'admin@cryptoboost.world';

-- 3. Créer l'admin avec un ID explicite
-- ======================================

DO $$
DECLARE
    admin_id uuid;
    admin_exists boolean;
BEGIN
    -- Générer un UUID pour l'admin
    admin_id := gen_random_uuid();
    
    -- Vérifier si l'admin existe déjà dans auth.users
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@cryptoboost.world'
    ) INTO admin_exists;
    
    IF NOT admin_exists THEN
        -- Créer l'admin dans auth.users avec l'ID explicite
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
            admin_id,
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
        
        RAISE NOTICE 'Admin utilisateur cree dans auth.users avec ID: %', admin_id;
    ELSE
        -- Récupérer l'ID de l'admin existant
        SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@cryptoboost.world';
        RAISE NOTICE 'Admin utilisateur existe deja dans auth.users avec ID: %', admin_id;
    END IF;
    
    -- Vérifier si l'admin existe dans public.users
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = admin_id
    ) THEN
        -- Créer l'admin dans public.users avec l'ID explicite
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
        
        RAISE NOTICE 'Admin utilisateur cree dans public.users avec ID: %', admin_id;
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
        
        RAISE NOTICE 'Admin utilisateur mis a jour dans public.users avec ID: %', admin_id;
    END IF;
    
END $$;

-- 4. Vérification finale
-- ======================

-- Afficher le statut final de l'admin
SELECT 
    'Admin Status Final' as check_type,
    au.id as auth_id,
    au.email as auth_email,
    au.raw_user_meta_data as auth_metadata,
    pu.id as public_id,
    pu.email as public_email,
    pu.full_name,
    pu.role,
    pu.status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@cryptoboost.world';

-- 5. Test de connexion admin
-- ==========================

-- Créer une fonction pour tester la connexion admin
CREATE OR REPLACE FUNCTION test_admin_connection()
RETURNS TABLE(
    test_name text,
    result text,
    details text
) AS $$
BEGIN
    -- Test 1: Vérifier que l'admin existe dans auth.users
    IF EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@cryptoboost.world'
    ) THEN
        RETURN QUERY SELECT 
            'Admin exists in auth.users'::text,
            'PASS'::text,
            'Admin found in auth.users'::text;
    ELSE
        RETURN QUERY SELECT 
            'Admin exists in auth.users'::text,
            'FAIL'::text,
            'Admin not found in auth.users'::text;
    END IF;
    
    -- Test 2: Vérifier que l'admin existe dans public.users
    IF EXISTS (
        SELECT 1 FROM public.users 
        WHERE email = 'admin@cryptoboost.world'
    ) THEN
        RETURN QUERY SELECT 
            'Admin exists in public.users'::text,
            'PASS'::text,
            'Admin found in public.users'::text;
    ELSE
        RETURN QUERY SELECT 
            'Admin exists in public.users'::text,
            'FAIL'::text,
            'Admin not found in public.users'::text;
    END IF;
    
    -- Test 3: Vérifier que les IDs correspondent
    IF EXISTS (
        SELECT 1 FROM auth.users au
        JOIN public.users pu ON au.id = pu.id
        WHERE au.email = 'admin@cryptoboost.world'
    ) THEN
        RETURN QUERY SELECT 
            'Admin IDs match'::text,
            'PASS'::text,
            'Auth and public users have matching IDs'::text;
    ELSE
        RETURN QUERY SELECT 
            'Admin IDs match'::text,
            'FAIL'::text,
            'Auth and public users have different IDs'::text;
    END IF;
    
    -- Test 4: Vérifier le rôle admin
    IF EXISTS (
        SELECT 1 FROM public.users 
        WHERE email = 'admin@cryptoboost.world' 
        AND role = 'admin'
    ) THEN
        RETURN QUERY SELECT 
            'Admin role is correct'::text,
            'PASS'::text,
            'Admin role is set to admin'::text;
    ELSE
        RETURN QUERY SELECT 
            'Admin role is correct'::text,
            'FAIL'::text,
            'Admin role is not set to admin'::text;
    END IF;
    
END;
$$ LANGUAGE plpgsql;

-- Exécuter les tests
SELECT * FROM test_admin_connection();

-- 6. Nettoyage
-- ============

-- Supprimer la fonction de test
DROP FUNCTION IF EXISTS test_admin_connection();

-- 7. Résumé final
-- ===============

RAISE NOTICE '=== CORRECTION ADMIN ID TERMINEE ===';
RAISE NOTICE 'Veuillez verifier les resultats ci-dessus';
RAISE NOTICE 'Si tous les tests passent, l''admin est correctement configure';
RAISE NOTICE 'Vous pouvez maintenant vous connecter avec:';
RAISE NOTICE 'Email: admin@cryptoboost.world';
RAISE NOTICE 'Mot de passe: CryptoAdmin2024!';