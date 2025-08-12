-- Script de correction des politiques RLS pour permettre l'accès admin complet
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérification de l'existence des tables
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

-- 2. Suppression des politiques RLS existantes problématiques
-- (à exécuter seulement si les politiques existent et causent des problèmes)

-- Supprimer les politiques existantes sur transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can create transactions" ON transactions;

-- Supprimer les politiques existantes sur user_investments
DROP POLICY IF EXISTS "Users can view their own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can create their own investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can view all investments" ON user_investments;
DROP POLICY IF EXISTS "Admins can create investments" ON user_investments;

-- Supprimer les politiques existantes sur system_logs
DROP POLICY IF EXISTS "Admins can view system logs" ON system_logs;
DROP POLICY IF EXISTS "Admins can create system logs" ON system_logs;

-- Supprimer les politiques existantes sur system_settings
DROP POLICY IF EXISTS "Admins can view system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can create system settings" ON system_settings;

-- Supprimer les politiques existantes sur notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- 3. Création des nouvelles politiques RLS pour admin

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

-- 4. Politiques pour les clients (si les tables existent)

-- Politiques pour les clients sur transactions
CREATE POLICY "Users can view their own transactions" ON transactions
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can create their own transactions" ON transactions
FOR INSERT WITH CHECK (
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

-- Politiques pour les clients sur notifications
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can create their own notifications" ON notifications
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- 5. Vérification des politiques créées
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
AND tablename IN ('transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications')
ORDER BY tablename, policyname;

-- 6. Activation de RLS sur toutes les tables (si pas déjà activé)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 7. Vérification du statut RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications')
ORDER BY tablename;

-- 8. Test des permissions (à exécuter après avoir créé un utilisateur admin)
-- SELECT 
--   auth.uid() as current_user_id,
--   EXISTS (
--     SELECT 1 FROM users 
--     WHERE users.id = auth.uid() 
--     AND users.role = 'admin'
--   ) as is_admin;

-- 9. Création des tables manquantes si elles n'existent pas

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

-- 10. Création d'index pour les performances
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_plan_id ON user_investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 11. Message de confirmation
SELECT 'Politiques RLS corrigées avec succès !' as status;