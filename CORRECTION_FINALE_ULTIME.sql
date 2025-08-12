-- CORRECTION FINALE ULTIME - CryptoBoost Authentication
-- Script complet qui nettoie tout et configure correctement
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. NETTOYAGE COMPLET DES POLITIQUES
-- ===============================================

-- Desactiver RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les politiques existantes
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

-- Supprimer les politiques dupliquees
DROP POLICY IF EXISTS "Admins manage wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Everyone can read crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Public read active wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Allow admin access" ON crypto_wallets;
DROP POLICY IF EXISTS "Everyone can read investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Public read active plans" ON investment_plans;
DROP POLICY IF EXISTS "Allow admin access" ON investment_plans;
DROP POLICY IF EXISTS "Admins insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins read all notifications" ON notifications;
DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Users manage own notifications" ON notifications;
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow admin access" ON notifications;
DROP POLICY IF EXISTS "Admins insert logs" ON system_logs;
DROP POLICY IF EXISTS "Admins read logs" ON system_logs;
DROP POLICY IF EXISTS "Allow admin access" ON system_logs;
DROP POLICY IF EXISTS "Admins read transactions" ON transactions;
DROP POLICY IF EXISTS "Admins update transactions" ON transactions;
DROP POLICY IF EXISTS "Users insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users read own transactions" ON transactions;
DROP POLICY IF EXISTS "Allow admin access" ON transactions;
DROP POLICY IF EXISTS "Admins read all users" ON users;
DROP POLICY IF EXISTS "Admins update users" ON users;
DROP POLICY IF EXISTS "Users can create profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users create own profile" ON users;
DROP POLICY IF EXISTS "Users read own profile" ON users;
DROP POLICY IF EXISTS "Users update own profile" ON users;
DROP POLICY IF EXISTS "Allow admin access" ON users;

-- ===============================================
-- 2. NETTOYAGE DES DONNEES
-- ===============================================

DELETE FROM system_logs;
DELETE FROM notifications;
DELETE FROM user_investments;
DELETE FROM transactions;
DELETE FROM users;
DELETE FROM auth.users WHERE email = 'admin@cryptoboost.world';

-- ===============================================
-- 3. AJOUTER COLONNE QR_CODE_URL SI MANQUANTE
-- ===============================================

ALTER TABLE crypto_wallets ADD COLUMN IF NOT EXISTS qr_code_url VARCHAR;

-- ===============================================
-- 4. CREER L'ADMIN
-- ===============================================

-- Inserer dans auth.users
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
-- 5. CREER LES DONNEES PAR DEFAUT
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
-- 6. REACTIVER RLS AVEC POLITIQUES SIMPLES
-- ===============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Users: 3 politiques seulement
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "users_admin_all" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Investment plans: 2 politiques seulement
CREATE POLICY "plans_select_public" ON investment_plans FOR SELECT USING (is_active = true);
CREATE POLICY "plans_admin_all" ON investment_plans FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- User investments: 3 politiques seulement
CREATE POLICY "investments_select_own" ON user_investments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "investments_insert_own" ON user_investments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "investments_admin_all" ON user_investments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Transactions: 3 politiques seulement
CREATE POLICY "transactions_select_own" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "transactions_insert_own" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "transactions_admin_all" ON transactions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Crypto wallets: 2 politiques seulement
CREATE POLICY "wallets_select_public" ON crypto_wallets FOR SELECT USING (is_active = true);
CREATE POLICY "wallets_admin_all" ON crypto_wallets FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Notifications: 3 politiques seulement
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- System logs: 1 politique seulement (admin only)
CREATE POLICY "logs_admin_all" ON system_logs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- ===============================================
-- 7. VERIFICATION FINALE
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

-- Compter les politiques par table (doit etre 17 au total)
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;