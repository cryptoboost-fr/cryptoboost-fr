-- NETTOYAGE URGENT DES POLITIQUES RLS DUPLIQUEES
-- Script pour nettoyer et simplifier les politiques RLS
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- ===============================================

-- Desactiver RLS temporairement
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

-- Supprimer les politiques dupliquees identifiees
DROP POLICY IF EXISTS "Admins manage wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Everyone can read crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Public read active wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Everyone can read investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Public read active plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins read all notifications" ON notifications;
DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Users manage own notifications" ON notifications;
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins insert logs" ON system_logs;
DROP POLICY IF EXISTS "Admins read logs" ON system_logs;
DROP POLICY IF EXISTS "Admins read transactions" ON transactions;
DROP POLICY IF EXISTS "Admins update transactions" ON transactions;
DROP POLICY IF EXISTS "Users insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins read all users" ON users;
DROP POLICY IF EXISTS "Admins update users" ON users;
DROP POLICY IF EXISTS "Users can create profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users create own profile" ON users;
DROP POLICY IF EXISTS "Users read own profile" ON users;
DROP POLICY IF EXISTS "Users update own profile" ON users;

-- ===============================================
-- 2. REACTIVER RLS
-- ===============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 3. CREER DES POLITIQUES SIMPLES ET UNIQUES
-- ===============================================

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
-- 4. VERIFICATION FINALE
-- ===============================================

-- Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Lister toutes les politiques
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;