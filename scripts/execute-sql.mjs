const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      headers,
      ...options
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Error ${response.status}:`, error);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function executeSQL() {
  console.log('🚀 Exécution du script SQL de configuration...\n');

  // 1. Désactiver RLS temporairement pour la configuration
  console.log('🔧 Configuration des permissions...');
  
  const disableRLS = await makeRequest('/rest/v1/rpc/exec_sql', {
    method: 'POST',
    body: JSON.stringify({
      sql: `
        -- Désactiver RLS temporairement
        ALTER TABLE users DISABLE ROW LEVEL SECURITY;
        ALTER TABLE investment_plans DISABLE ROW LEVEL SECURITY;
        ALTER TABLE crypto_wallets DISABLE ROW LEVEL SECURITY;
        ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
        ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
        ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;
      `
    })
  });

  if (disableRLS) {
    console.log('✅ RLS désactivé temporairement');
  }

  // 2. Créer les tables manquantes
  console.log('\n📊 Création des tables manquantes...');
  
  const createTables = await makeRequest('/rest/v1/rpc/exec_sql', {
    method: 'POST',
    body: JSON.stringify({
      sql: `
        -- Créer les tables manquantes
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR CHECK (type IN ('deposit', 'withdrawal')),
          crypto_type VARCHAR NOT NULL,
          amount DECIMAL(15,8) NOT NULL,
          usd_value DECIMAL(15,2) NOT NULL,
          wallet_address VARCHAR,
          transaction_hash VARCHAR,
          fee_amount DECIMAL(15,2) DEFAULT 0,
          status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'failed')),
          admin_note TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS system_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR NOT NULL,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
  });

  if (createTables) {
    console.log('✅ Tables créées');
  }

  // 3. Créer les index
  console.log('\n🔍 Création des index...');
  
  const createIndexes = await makeRequest('/rest/v1/rpc/exec_sql', {
    method: 'POST',
    body: JSON.stringify({
      sql: `
        -- Créer les index nécessaires
        CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
        CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
        CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
      `
    })
  });

  if (createIndexes) {
    console.log('✅ Index créés');
  }

  // 4. Créer le profil administrateur
  console.log('\n👤 Création du profil administrateur...');
  
  // D'abord, récupérer l'ID de l'admin depuis auth.users
  const adminUsers = await makeRequest('/rest/v1/rpc/exec_sql', {
    method: 'POST',
    body: JSON.stringify({
      sql: `
        SELECT id, email FROM auth.users 
        WHERE email = 'admin@cryptoboost.world' 
        LIMIT 1;
      `
    })
  });

  if (adminUsers && adminUsers.length > 0) {
    const adminId = adminUsers[0].id;
    const adminEmail = adminUsers[0].email;
    
    console.log(`✅ Admin trouvé: ${adminEmail} (${adminId})`);
    
    // Créer le profil dans la table users
    const createProfile = await makeRequest('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        sql: `
          INSERT INTO users (id, email, full_name, role, status, total_invested, total_profit)
          VALUES (
            '${adminId}',
            '${adminEmail}',
            'Administrateur CryptoBoost',
            'admin',
            'active',
            0,
            0
          )
          ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            status = 'active',
            updated_at = NOW();
        `
      })
    });

    if (createProfile) {
      console.log('✅ Profil administrateur créé/mis à jour');
    }
  } else {
    console.log('❌ Aucun administrateur trouvé dans auth.users');
  }

  // 5. Réactiver RLS avec les bonnes politiques
  console.log('\n🔒 Configuration des politiques RLS...');
  
  const enableRLS = await makeRequest('/rest/v1/rpc/exec_sql', {
    method: 'POST',
    body: JSON.stringify({
      sql: `
        -- Réactiver RLS
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
        ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
        ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
        ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

        -- Supprimer les anciennes politiques
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

        -- Créer les nouvelles politiques
        CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
        CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
        CREATE POLICY "Admins can view all users" ON users FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Anyone can view active plans" ON investment_plans FOR SELECT USING (is_active = true);
        CREATE POLICY "Admins can manage plans" ON investment_plans FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Users can view own investments" ON user_investments FOR SELECT USING (user_id = auth.uid());
        CREATE POLICY "Users can create own investments" ON user_investments FOR INSERT WITH CHECK (user_id = auth.uid());
        CREATE POLICY "Admins can manage all investments" ON user_investments FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
        CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
        CREATE POLICY "Admins can manage all transactions" ON transactions FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Anyone can view active wallets" ON crypto_wallets FOR SELECT USING (is_active = true);
        CREATE POLICY "Admins can manage wallets" ON crypto_wallets FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
        CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
        CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );

        CREATE POLICY "Admins can view all logs" ON system_logs FOR SELECT USING (
          EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
        );
        CREATE POLICY "System can insert logs" ON system_logs FOR INSERT WITH CHECK (true);
      `
    })
  });

  if (enableRLS) {
    console.log('✅ RLS réactivé avec les bonnes politiques');
  }

  console.log('\n🎉 Configuration SQL terminée !');
  console.log('\n📋 Identifiants de connexion :');
  console.log('Email: admin@cryptoboost.world');
  console.log('Mot de passe: AdminCrypto2024!');
  console.log('\n🔗 URL de connexion: https://cryptoboost.world/auth/login');
}

executeSQL().catch(console.error);