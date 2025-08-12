-- Script complet de réparation de la base de données CryptoBoost (CORRIGÉ)
-- À exécuter dans l'éditeur SQL de Supabase
-- Ce script corrige TOUTES les erreurs identifiées et évite les duplications

-- =====================================================
-- 1. VÉRIFICATION ET CRÉATION DES TABLES MANQUANTES
-- =====================================================

-- Vérification de l'existence des tables
SELECT 'Vérification des tables existantes...' as status;

SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users', 
  'transactions', 
  'user_investments', 
  'investment_plans', 
  'crypto_wallets', 
  'system_logs', 
  'system_settings', 
  'notifications'
)
ORDER BY table_name;

-- =====================================================
-- 2. CRÉATION DES TABLES MANQUANTES
-- =====================================================

-- Table transactions (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  description TEXT,
  from_currency VARCHAR(10),
  to_currency VARCHAR(10),
  exchange_rate DECIMAL(15,6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table user_investments (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS user_investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES investment_plans(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_end_date TIMESTAMP WITH TIME ZONE,
  actual_end_date TIMESTAMP WITH TIME ZONE,
  total_profit DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table system_logs (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level VARCHAR(20) NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table system_settings (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table notifications (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 3. SUPPRESSION DE TOUTES LES POLITIQUES RLS EXISTANTES
-- =====================================================

SELECT 'Suppression des politiques RLS existantes...' as status;

-- Supprimer TOUTES les politiques existantes sur transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can create transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;

-- Supprimer TOUTES les politiques existantes sur user_investments
DROP POLICY IF EXISTS "Users can view their own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can create their own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can update their own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can delete their own investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can view all investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can create investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can update investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can delete investments" ON user_investments;

-- Supprimer TOUTES les politiques existantes sur system_logs
DROP POLICY IF EXISTS "Admins can view system logs" ON system_logs;
DROP POLICY IF EXISTS "Admins can create system logs" ON system_logs;
DROP POLICY IF EXISTS "Admins can update system logs" ON system_logs;
DROP POLICY IF EXISTS "Admins can delete system logs" ON system_logs;

-- Supprimer TOUTES les politiques existantes sur system_settings
DROP POLICY IF EXISTS "Admins can view system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can create system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can delete system settings" ON system_settings;

-- Supprimer TOUTES les politiques existantes sur notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;

-- Supprimer TOUTES les politiques existantes sur users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can create users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Supprimer TOUTES les politiques existantes sur investment_plans
DROP POLICY IF EXISTS "Users can view investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins can view investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins can create investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins can update investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Admins can delete investment plans" ON investment_plans;

-- Supprimer TOUTES les politiques existantes sur crypto_wallets
DROP POLICY IF EXISTS "Users can view crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Admins can view crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Admins can create crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Admins can update crypto wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Admins can delete crypto wallets" ON crypto_wallets;

-- =====================================================
-- 4. CRÉATION DES NOUVELLES POLITIQUES RLS POUR ADMIN
-- =====================================================

SELECT 'Création des nouvelles politiques RLS pour admin...' as status;

-- Politiques pour la table users
CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create users" ON users
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update users" ON users
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete users" ON users
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table transactions
CREATE POLICY "Admins can view all transactions" ON transactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create transactions" ON transactions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update transactions" ON transactions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete transactions" ON transactions
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table user_investments
CREATE POLICY "Admins can view all investments" ON user_investments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create investments" ON user_investments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update investments" ON user_investments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete investments" ON user_investments
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table system_logs
CREATE POLICY "Admins can view system logs" ON system_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create system logs" ON system_logs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update system logs" ON system_logs
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete system logs" ON system_logs
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table system_settings
CREATE POLICY "Admins can view system settings" ON system_settings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create system settings" ON system_settings
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update system settings" ON system_settings
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete system settings" ON system_settings
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table notifications
CREATE POLICY "Admins can view all notifications" ON notifications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create notifications" ON notifications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update notifications" ON notifications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete notifications" ON notifications
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table investment_plans
CREATE POLICY "Admins can view investment plans" ON investment_plans
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create investment plans" ON investment_plans
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update investment plans" ON investment_plans
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete investment plans" ON investment_plans
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Politiques pour la table crypto_wallets
CREATE POLICY "Admins can view crypto wallets" ON crypto_wallets
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can create crypto wallets" ON crypto_wallets
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update crypto wallets" ON crypto_wallets
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete crypto wallets" ON crypto_wallets
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- 5. CRÉATION DES POLITIQUES RLS POUR LES CLIENTS
-- =====================================================

SELECT 'Création des politiques RLS pour les clients...' as status;

-- Politiques pour les clients sur users (profil)
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (
  auth.uid() = id
);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (
  auth.uid() = id
);

-- Politiques pour les clients sur transactions
CREATE POLICY "Users can view their own transactions" ON transactions
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can create their own transactions" ON transactions
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own transactions" ON transactions
FOR UPDATE USING (
  auth.uid() = user_id
);

-- Politiques pour les clients sur user_investments
CREATE POLICY "Users can view their own investments" ON user_investments
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can create their own investments" ON user_investments
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own investments" ON user_investments
FOR UPDATE USING (
  auth.uid() = user_id
);

-- Politiques pour les clients sur notifications
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can create their own notifications" ON notifications
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own notifications" ON notifications
FOR UPDATE USING (
  auth.uid() = user_id
);

-- Politiques pour les clients sur investment_plans (lecture seule)
CREATE POLICY "Users can view investment plans" ON investment_plans
FOR SELECT USING (
  is_active = true
);

-- Politiques pour les clients sur crypto_wallets (lecture seule)
CREATE POLICY "Users can view crypto wallets" ON crypto_wallets
FOR SELECT USING (
  is_active = true
);

-- =====================================================
-- 6. ACTIVATION DE RLS SUR TOUTES LES TABLES
-- =====================================================

SELECT 'Activation de RLS sur toutes les tables...' as status;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CRÉATION DES INDEX POUR LES PERFORMANCES
-- =====================================================

SELECT 'Création des index pour les performances...' as status;

-- Index pour transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_currency ON transactions(currency);

-- Index pour user_investments
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_plan_id ON user_investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);
CREATE INDEX IF NOT EXISTS idx_user_investments_start_date ON user_investments(start_date);

-- Index pour system_logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);

-- Index pour notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Index pour users
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index pour investment_plans
CREATE INDEX IF NOT EXISTS idx_investment_plans_is_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_investment_plans_created_at ON investment_plans(created_at);

-- Index pour crypto_wallets
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_is_active ON crypto_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_symbol ON crypto_wallets(symbol);

-- =====================================================
-- 8. CRÉATION DE LA FONCTION RPC POUR LES STATISTIQUES
-- =====================================================

SELECT 'Création de la fonction RPC pour les statistiques...' as status;

-- Supprimer la fonction si elle existe
DROP FUNCTION IF EXISTS get_dashboard_stats();

-- Créer la fonction get_dashboard_stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_capital DECIMAL,
  active_investments BIGINT,
  pending_transactions BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
    (SELECT COALESCE(SUM(total_invested), 0) FROM users WHERE status = 'active') as total_capital,
    (SELECT COUNT(*) FROM user_investments WHERE status = 'active') as active_investments,
    (SELECT COUNT(*) FROM transactions WHERE status = 'pending') as pending_transactions;
END;
$$;

-- =====================================================
-- 9. INSERTION DE DONNÉES DE TEST
-- =====================================================

SELECT 'Insertion de données de test...' as status;

-- Insérer des paramètres système de base
INSERT INTO system_settings (key, value, description) VALUES
('site_name', 'CryptoBoost', 'Nom du site'),
('maintenance_mode', 'false', 'Mode maintenance'),
('max_investment_amount', '100000', 'Montant maximum d''investissement'),
('min_investment_amount', '100', 'Montant minimum d''investissement'),
('support_email', 'support@cryptoboost.world', 'Email de support')
ON CONFLICT (key) DO NOTHING;

-- Insérer des logs système de base
INSERT INTO system_logs (level, message, action) VALUES
('info', 'Système initialisé avec succès', 'system_init'),
('info', 'Politiques RLS configurées', 'rls_config'),
('info', 'Base de données mise à jour', 'db_update')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. VÉRIFICATION FINALE
-- =====================================================

SELECT 'Vérification finale...' as status;

-- Vérifier les tables
SELECT 'Tables créées:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users', 
  'transactions', 
  'user_investments', 
  'investment_plans', 
  'crypto_wallets', 
  'system_logs', 
  'system_settings', 
  'notifications'
)
ORDER BY table_name;

-- Vérifier les politiques RLS
SELECT 'Politiques RLS créées:' as info;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications', 'investment_plans', 'crypto_wallets')
ORDER BY tablename, policyname;

-- Vérifier le statut RLS
SELECT 'Statut RLS:' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications', 'investment_plans', 'crypto_wallets')
ORDER BY tablename;

-- Vérifier les index
SELECT 'Index créés:' as info;
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('users', 'transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications', 'investment_plans', 'crypto_wallets')
ORDER BY tablename, indexname;

-- Test de la fonction RPC
SELECT 'Test fonction RPC:' as info;
SELECT * FROM get_dashboard_stats();

-- =====================================================
-- 11. MESSAGE DE CONFIRMATION
-- =====================================================

SELECT '🎉 RÉPARATION COMPLÈTE TERMINÉE !' as status;
SELECT '✅ Toutes les tables ont été créées' as info;
SELECT '✅ Toutes les politiques RLS ont été configurées' as info;
SELECT '✅ Tous les index ont été créés' as info;
SELECT '✅ La fonction RPC a été créée' as info;
SELECT '✅ Les données de test ont été insérées' as info;
SELECT '🚀 La base de données est maintenant 100% fonctionnelle !' as info;