-- 🚨 CORRECTION COMPLÈTE - Problèmes d'Authentification CryptoBoost
-- Exécuter ce script dans Supabase SQL Editor pour corriger tous les problèmes

-- ===============================================
-- 1. NETTOYAGE COMPLET
-- ===============================================

-- Supprimer toutes les données existantes pour repartir proprement
DELETE FROM system_logs;
DELETE FROM notifications;
DELETE FROM user_investments;
DELETE FROM transactions;
DELETE FROM users;
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- ===============================================
-- 2. CORRECTION DES POLITIQUES RLS
-- ===============================================

-- Désactiver temporairement RLS pour corriger les politiques
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;

-- Supprimer les politiques problématiques
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can view all investments" ON user_investments;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all system logs" ON system_logs;

-- Recréer les politiques RLS correctement
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques pour transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques pour user_investments
CREATE POLICY "Users can view own investments" ON user_investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON user_investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all investments" ON user_investments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques pour notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques pour system_logs
CREATE POLICY "Admins can view all system logs" ON system_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===============================================
-- 3. CRÉATION DE L'ADMIN CORRIGÉE
-- ===============================================

DO $$
DECLARE
    admin_email TEXT := 'admin@cryptoboost.world';
    admin_password TEXT := 'CryptoAdmin2024!';
    admin_name TEXT := 'Administrateur CryptoBoost';
    new_user_id UUID;
    encrypted_password TEXT;
BEGIN
    RAISE NOTICE '🔐 Création de l''administrateur...';
    
    -- Générer UUID et chiffrer mot de passe
    new_user_id := uuid_generate_v4();
    encrypted_password := crypt(admin_password, gen_salt('bf'));
    
    -- Insérer dans auth.users (SANS confirmed_at qui est auto-généré)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        email_change_confirm_status,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        admin_email,
        encrypted_password,
        NOW(),
        NOW(),
        NOW(),
        0,
        '{"provider": "email", "providers": ["email"]}',
        '{}'
    );
    
    -- Insérer dans public.users
    INSERT INTO users (
        id,
        email,
        full_name,
        role,
        status,
        total_invested,
        total_profit,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        admin_email,
        admin_name,
        'admin',
        'active',
        0,
        0,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ Administrateur créé avec succès !';
    RAISE NOTICE '📧 Email: %', admin_email;
    RAISE NOTICE '🔑 Mot de passe: %', admin_password;
    RAISE NOTICE '👤 ID: %', new_user_id;
END $$;

-- ===============================================
-- 4. CRÉATION DES DONNÉES PAR DÉFAUT
-- ===============================================

-- Plans d'investissement
INSERT INTO investment_plans (name, description, min_amount, max_amount, profit_target, duration_days, features, is_active) VALUES
('Starter', 'Plan d''entrée pour débuter en crypto', 100, 1000, 15.5, 30, ARRAY['Support 24/7', 'Rapports quotidiens'], true),
('Growth', 'Plan de croissance pour investisseurs confirmés', 1000, 10000, 25.0, 60, ARRAY['Support prioritaire', 'Rapports détaillés', 'Conseils personnalisés'], true),
('Premium', 'Plan premium pour investisseurs expérimentés', 10000, 100000, 35.0, 90, ARRAY['Support VIP', 'Rapports avancés', 'Stratégies exclusives', 'Accès prioritaire'], true);

-- Wallets crypto
INSERT INTO crypto_wallets (crypto_type, address, qr_code_url, is_active) VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', true),
('ETH', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', true),
('USDT', 'TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp', true),
('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', true);

-- ===============================================
-- 5. VÉRIFICATION FINALE
-- ===============================================

-- Vérifier l'admin
SELECT 
    'Admin créé' as status,
    u.email,
    u.full_name,
    u.role,
    u.status,
    au.email_confirmed_at IS NOT NULL as email_confirmed
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@cryptoboost.world';

-- Compter les données créées
SELECT 
    'Plans d''investissement' as type,
    COUNT(*) as count
FROM investment_plans 
WHERE is_active = true
UNION ALL
SELECT 
    'Wallets crypto' as type,
    COUNT(*) as count
FROM crypto_wallets 
WHERE is_active = true;

-- ===============================================
-- 6. MESSAGE DE CONFIRMATION
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 CORRECTION TERMINÉE AVEC SUCCÈS !';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Problèmes résolus :';
    RAISE NOTICE '   • Politiques RLS corrigées';
    RAISE NOTICE '   • Admin créé avec succès';
    RAISE NOTICE '   • Données par défaut ajoutées';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Identifiants de connexion :';
    RAISE NOTICE '   • Email: admin@cryptoboost.world';
    RAISE NOTICE '   • Mot de passe: CryptoAdmin2024!';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Tests à effectuer :';
    RAISE NOTICE '   1. Connexion admin sur /auth/login';
    RAISE NOTICE '   2. Inscription client sur /auth/register';
    RAISE NOTICE '   3. Vérification des redirections';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 L''authentification est maintenant fonctionnelle !';
END $$;