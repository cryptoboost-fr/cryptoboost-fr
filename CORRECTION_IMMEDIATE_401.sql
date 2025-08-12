-- CORRECTION IMMEDIATE DES ERREURS 401
-- Résoudre les problèmes d'accès aux données publiques
-- Executer dans Supabase SQL Editor

-- ===============================================
-- 1. VERIFIER L'ETAT ACTUEL
-- ===============================================

-- Compter les politiques actuelles
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ===============================================
-- 2. SUPPRIMER LES POLITIQUES PROBLEMATIQUES
-- ===============================================

-- Supprimer toutes les politiques existantes pour repartir de zéro
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_admin_all" ON users;
DROP POLICY IF EXISTS "plans_select_public" ON investment_plans;
DROP POLICY IF EXISTS "plans_admin_all" ON investment_plans;
DROP POLICY IF EXISTS "investments_select_own" ON user_investments;
DROP POLICY IF EXISTS "investments_insert_own" ON user_investments;
DROP POLICY IF EXISTS "investments_admin_all" ON user_investments;
DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
DROP POLICY IF EXISTS "transactions_admin_all" ON transactions;
DROP POLICY IF EXISTS "wallets_select_public" ON crypto_wallets;
DROP POLICY IF EXISTS "wallets_admin_all" ON crypto_wallets;
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
DROP POLICY IF EXISTS "notifications_admin_all" ON notifications;
DROP POLICY IF EXISTS "logs_admin_all" ON system_logs;

-- Supprimer aussi les anciennes politiques qui pourraient rester
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow admin access" ON users;
DROP POLICY IF EXISTS "Anyone can view active plans" ON investment_plans;
DROP POLICY IF EXISTS "Allow admin access" ON investment_plans;
DROP POLICY IF EXISTS "Users can view own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can create own investments" ON user_investments;
DROP POLICY IF EXISTS "Allow admin access" ON user_investments;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON transactions;
DROP POLICY IF EXISTS "Allow admin access" ON transactions;
DROP POLICY IF EXISTS "Anyone can view active wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Allow admin access" ON crypto_wallets;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow admin access" ON notifications;
DROP POLICY IF EXISTS "Allow admin access" ON system_logs;

-- ===============================================
-- 3. CREER DES POLITIQUES SIMPLES ET FONCTIONNELLES
-- ===============================================

-- Users: Politiques simples
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Investment plans: Accès public en lecture
CREATE POLICY "plans_select_public" ON investment_plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_all" ON investment_plans FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- User investments: Politiques utilisateur
CREATE POLICY "investments_select_own" ON user_investments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "investments_insert_own" ON user_investments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "investments_admin_all" ON user_investments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Transactions: Politiques utilisateur
CREATE POLICY "transactions_select_own" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "transactions_insert_own" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "transactions_admin_all" ON transactions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Crypto wallets: Accès public en lecture
CREATE POLICY "wallets_select_public" ON crypto_wallets FOR SELECT USING (true);
CREATE POLICY "wallets_admin_all" ON crypto_wallets FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Notifications: Politiques utilisateur
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL USING (
    EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = auth.uid()::text::uuid 
        AND au.raw_user_meta_data->>'role' = 'admin'
    )
);

-- System logs: Admin seulement
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

-- Compter les politiques finales
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

-- ===============================================
-- 5. TEST DE CONNEXION
-- ===============================================

-- Vérifier que l'admin existe
SELECT 
    'Admin status' as check_type,
    u.email,
    u.full_name,
    u.role,
    u.status
FROM users u
WHERE u.email = 'admin@cryptoboost.world';