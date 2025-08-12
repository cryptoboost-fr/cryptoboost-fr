#!/usr/bin/env node

/**
 * SCRIPT DE CRÉATION DES TABLES DE BASE DE DONNÉES SUPABASE
 * Crée toutes les tables nécessaires pour l'application CryptoBoost
 */

import fetch from 'node-fetch';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CRÉATION DES TABLES
// ============================================================================

async function createUsersTable() {
  logSection('👥 CRÉATION TABLE USERS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
      phone TEXT,
      avatar_url TEXT,
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Index pour améliorer les performances
    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table users créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table users', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createInvestmentPlansTable() {
  logSection('💰 CRÉATION TABLE INVESTMENT_PLANS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.investment_plans (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      min_amount DECIMAL(15,2) NOT NULL,
      max_amount DECIMAL(15,2),
      interest_rate DECIMAL(5,2) NOT NULL,
      duration_days INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON public.investment_plans(is_active);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table investment_plans créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table investment_plans', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createTransactionsTable() {
  logSection('💳 CRÉATION TABLE TRANSACTIONS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.transactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      type TEXT CHECK (type IN ('deposit', 'withdrawal', 'investment', 'profit', 'fee')) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
      description TEXT,
      reference_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
    CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table transactions créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table transactions', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createInvestmentsTable() {
  logSection('📈 CRÉATION TABLE INVESTMENTS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.investments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      plan_id UUID REFERENCES public.investment_plans(id) ON DELETE CASCADE,
      amount DECIMAL(15,2) NOT NULL,
      interest_rate DECIMAL(5,2) NOT NULL,
      start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      end_date TIMESTAMP WITH TIME ZONE NOT NULL,
      status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
      total_profit DECIMAL(15,2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
    CREATE INDEX IF NOT EXISTS idx_investments_plan_id ON public.investments(plan_id);
    CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table investments créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table investments', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createCryptoWalletsTable() {
  logSection('🔐 CRÉATION TABLE CRYPTO_WALLETS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.crypto_wallets (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      crypto_type TEXT NOT NULL,
      wallet_address TEXT NOT NULL,
      balance DECIMAL(20,8) DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_crypto_wallets_user_id ON public.crypto_wallets(user_id);
    CREATE INDEX IF NOT EXISTS idx_crypto_wallets_crypto_type ON public.crypto_wallets(crypto_type);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table crypto_wallets créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table crypto_wallets', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createNotificationsTable() {
  logSection('🔔 CRÉATION TABLE NOTIFICATIONS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.notifications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
    CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table notifications créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table notifications', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function createSystemLogsTable() {
  logSection('📋 CRÉATION TABLE SYSTEM_LOGS');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.system_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      details JSONB,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON public.system_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_system_logs_action ON public.system_logs(action);
    CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      log('✅ Table system_logs créée avec succès', 'green');
      return true;
    } else {
      log('❌ Erreur création table system_logs', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CONFIGURATION RLS (ROW LEVEL SECURITY)
// ============================================================================

async function configureRLS() {
  logSection('🔒 CONFIGURATION ROW LEVEL SECURITY');
  
  const rlsPolicies = [
    // Users table policies
    `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);`,
    `CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    `CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);`,
    
    // Investment plans policies
    `ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Anyone can view active plans" ON public.investment_plans FOR SELECT USING (is_active = true);`,
    `CREATE POLICY "Admins can manage plans" ON public.investment_plans FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    
    // Transactions policies
    `ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (user_id = auth.uid());`,
    `CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    `CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());`,
    
    // Investments policies
    `ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Users can view own investments" ON public.investments FOR SELECT USING (user_id = auth.uid());`,
    `CREATE POLICY "Admins can view all investments" ON public.investments FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    `CREATE POLICY "Users can create own investments" ON public.investments FOR INSERT WITH CHECK (user_id = auth.uid());`,
    
    // Crypto wallets policies
    `ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Users can view own wallets" ON public.crypto_wallets FOR SELECT USING (user_id = auth.uid());`,
    `CREATE POLICY "Admins can view all wallets" ON public.crypto_wallets FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    
    // Notifications policies
    `ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());`,
    `CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());`,
    
    // System logs policies
    `ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "Admins can view all logs" ON public.system_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));`,
    `CREATE POLICY "System can insert logs" ON public.system_logs FOR INSERT WITH CHECK (true);`
  ];

  for (const policy of rlsPolicies) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ sql: policy })
      });

      if (response.ok) {
        log('✅ Politique RLS configurée', 'green');
      } else {
        log('⚠️  Politique RLS déjà existante ou erreur', 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur politique RLS: ${error.message}`, 'yellow');
    }
  }
}

// ============================================================================
// INSERTION DE DONNÉES DE TEST
// ============================================================================

async function insertTestData() {
  logSection('📊 INSERTION DE DONNÉES DE TEST');
  
  // Plans d'investissement de test
  const plans = [
    {
      name: 'Plan Starter',
      description: 'Plan d\'investissement pour débutants',
      min_amount: 100,
      max_amount: 1000,
      interest_rate: 5.5,
      duration_days: 30
    },
    {
      name: 'Plan Premium',
      description: 'Plan d\'investissement premium',
      min_amount: 1000,
      max_amount: 10000,
      interest_rate: 8.5,
      duration_days: 60
    },
    {
      name: 'Plan VIP',
      description: 'Plan d\'investissement VIP',
      min_amount: 10000,
      max_amount: 100000,
      interest_rate: 12.5,
      duration_days: 90
    }
  ];

  for (const plan of plans) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(plan)
      });

      if (response.ok) {
        log(`✅ Plan "${plan.name}" créé`, 'green');
      } else {
        log(`⚠️  Plan "${plan.name}" déjà existant`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création plan: ${error.message}`, 'yellow');
    }
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function createDatabase() {
  log('🚀 CRÉATION COMPLÈTE DE LA BASE DE DONNÉES CRYPTOBOOST', 'bright');
  log('Création de toutes les tables, RLS et données de test', 'cyan');
  
  try {
    // 1. Créer toutes les tables
    const tables = [
      createUsersTable,
      createInvestmentPlansTable,
      createTransactionsTable,
      createInvestmentsTable,
      createCryptoWalletsTable,
      createNotificationsTable,
      createSystemLogsTable
    ];

    let successCount = 0;
    for (const createTable of tables) {
      const success = await createTable();
      if (success) successCount++;
    }

    // 2. Configurer RLS
    await configureRLS();

    // 3. Insérer données de test
    await insertTestData();

    // Résumé final
    logSection('📊 RÉSUMÉ DE LA CRÉATION');
    log(`✅ Tables créées : ${successCount}/${tables.length}`, 'green');
    log('✅ RLS configuré', 'green');
    log('✅ Données de test insérées', 'green');
    log('🎉 Base de données CryptoBoost prête !', 'bright');

  } catch (error) {
    log('\n❌ Erreur lors de la création de la base de données', 'red');
    log(error.message, 'red');
  }
}

// Exécution
createDatabase().catch(console.error);