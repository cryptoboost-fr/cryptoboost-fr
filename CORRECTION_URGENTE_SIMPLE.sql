-- CORRECTION URGENTE SIMPLE - CryptoBoost Authentication
-- Version ultra-simple sans blocs DO complexes
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. NETTOYAGE COMPLET
-- ===============================================

-- Desactiver RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can view active plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins can manage plans" ON investment_plans;
DROP POLICY IF EXISTS "Users can view own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can create own investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can manage all investments" ON user_investments;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can view active wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Admins can manage wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all logs" ON system_logs;
DROP POLICY IF EXISTS "System can insert logs" ON system_logs;
DROP POLICY IF EXISTS "Allow all for now" ON users;
DROP POLICY IF EXISTS "Allow all for now" ON transactions;
DROP POLICY IF EXISTS "Allow all for now" ON user_investments;
DROP POLICY IF EXISTS "Allow all for now" ON notifications;
DROP POLICY IF EXISTS "Allow all for now" ON system_logs;
DROP POLICY IF EXISTS "Allow all for now" ON investment_plans;
DROP POLICY IF EXISTS "Allow all for now" ON crypto_wallets;

-- Nettoyer les donnees
DELETE FROM system_logs;
DELETE FROM notifications;
DELETE FROM user_investments;
DELETE FROM transactions;
DELETE FROM users;
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- ===============================================
-- 2. AJOUTER COLONNE QR_CODE_URL SI MANQUANTE
-- ===============================================

ALTER TABLE crypto_wallets ADD COLUMN IF NOT EXISTS qr_code_url VARCHAR;

-- ===============================================
-- 3. CREER L'ADMIN SIMPLEMENT
-- ===============================================

-- Generer un UUID pour l'admin
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
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@cryptoboost.world',
    crypt('CryptoAdmin2024!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    0,
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "full_name": "Administrateur CryptoBoost"}'
);

-- Inserer dans public.users
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
    (SELECT id FROM auth.users WHERE email = 'admin@cryptoboost.world'),
    'admin@cryptoboost.world',
    'Administrateur CryptoBoost',
    'admin',
    'active',
    0,
    0,
    NOW(),
    NOW()
);

-- ===============================================
-- 4. CREER LES DONNEES PAR DEFAUT
-- ===============================================

-- Plans d'investissement
INSERT INTO investment_plans (name, description, min_amount, max_amount, profit_target, duration_days, features, is_active) VALUES
('Starter', 'Plan d''entree pour debuter en crypto', 100, 1000, 15.5, 30, ARRAY['Support 24/7', 'Rapports quotidiens'], true),
('Growth', 'Plan de croissance pour investisseurs confirmes', 1000, 10000, 25.0, 60, ARRAY['Support prioritaire', 'Rapports detailles', 'Conseils personnalises'], true),
('Premium', 'Plan premium pour investisseurs experimentes', 10000, 100000, 35.0, 90, ARRAY['Support VIP', 'Rapports avances', 'Strategies exclusives', 'Acces prioritaire'], true);

-- Wallets crypto
INSERT INTO crypto_wallets (crypto_type, address, qr_code_url, is_active) VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', true),
('ETH', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', true),
('USDT', 'TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp', true),
('USDC', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', true);

-- ===============================================
-- 5. REACTIVER RLS AVEC POLITIQUES SIMPLES
-- ===============================================

-- Reactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Politiques simples sans recursion
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Allow admin access" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Anyone can view active plans" ON investment_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin access" ON investment_plans FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Users can view own investments" ON user_investments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own investments" ON user_investments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow admin access" ON user_investments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow admin access" ON transactions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Anyone can view active wallets" ON crypto_wallets FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin access" ON crypto_wallets FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Allow admin access" ON notifications FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Allow admin access" ON system_logs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- ===============================================
-- 6. VERIFICATION FINALE
-- ===============================================

-- Verifier l'admin
SELECT 
    'Admin cree' as status,
    u.email,
    u.full_name,
    u.role,
    u.status
FROM users u
WHERE u.email = 'admin@cryptoboost.world';

-- Compter les donnees
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

-- Verifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;