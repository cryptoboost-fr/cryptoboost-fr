const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
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

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données CryptoBoost...\n');

  // 1. Vérifier les tables existantes
  console.log('📊 Vérification des tables...');
  
  const tables = ['users', 'investment_plans', 'crypto_wallets', 'transactions', 'notifications', 'system_logs'];
  
  for (const table of tables) {
    const result = await makeRequest(`/rest/v1/${table}?select=count&limit=1`);
    if (result !== null) {
      console.log(`✅ Table ${table} existe`);
    } else {
      console.log(`❌ Table ${table} manquante`);
    }
  }

  // 2. Insérer les plans d'investissement par défaut
  console.log('\n📈 Création des plans d\'investissement...');
  
  const plans = [
    {
      name: 'Starter',
      description: 'Plan parfait pour débuter dans le trading automatisé',
      min_amount: 50.00,
      max_amount: 199.99,
      profit_target: 15.00,
      duration_days: 30,
      features: ['Investissement minimum: 50€', 'Profit cible: 15%', 'Durée: 30 jours', 'Support email'],
      is_active: true
    },
    {
      name: 'Pro',
      description: 'Plan pour les investisseurs sérieux avec des performances optimisées',
      min_amount: 200.00,
      max_amount: 499.99,
      profit_target: 25.00,
      duration_days: 45,
      features: ['Investissement minimum: 200€', 'Profit cible: 25%', 'Durée: 45 jours', 'Support prioritaire', 'Analyses avancées'],
      is_active: true
    },
    {
      name: 'Expert',
      description: 'Plan premium avec les meilleures stratégies et support dédié',
      min_amount: 500.00,
      max_amount: null,
      profit_target: 35.00,
      duration_days: 60,
      features: ['Investissement minimum: 500€', 'Profit cible: 35%', 'Durée: 60 jours', 'Support dédié', 'Stratégies exclusives', 'Consultation personnalisée'],
      is_active: true
    }
  ];

  for (const plan of plans) {
    const result = await makeRequest('/rest/v1/investment_plans', {
      method: 'POST',
      body: JSON.stringify(plan)
    });
    
    if (result) {
      console.log(`✅ Plan ${plan.name} créé`);
    } else {
      console.log(`⚠️ Plan ${plan.name} déjà existant ou erreur`);
    }
  }

  // 3. Insérer les wallets crypto par défaut
  console.log('\n💰 Configuration des wallets crypto...');
  
  const wallets = [
    { crypto_type: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', is_active: true },
    { crypto_type: 'ETH', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', is_active: true },
    { crypto_type: 'USDT', address: 'TQn9Y2khDD95J42FQtQTdwVVRZqjqH3q6B', is_active: true },
    { crypto_type: 'USDC', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', is_active: true }
  ];

  for (const wallet of wallets) {
    const result = await makeRequest('/rest/v1/crypto_wallets', {
      method: 'POST',
      body: JSON.stringify(wallet)
    });
    
    if (result) {
      console.log(`✅ Wallet ${wallet.crypto_type} configuré`);
    } else {
      console.log(`⚠️ Wallet ${wallet.crypto_type} déjà configuré ou erreur`);
    }
  }

  // 4. Créer l'administrateur via l'API d'authentification
  console.log('\n👤 Création de l\'administrateur...');
  
  const adminData = {
    email: 'admin@cryptoboost.world',
    password: 'AdminCrypto2024!',
    user_metadata: {
      full_name: 'Administrateur CryptoBoost'
    }
  };

  const adminResult = await makeRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(adminData)
  });

  if (adminResult && adminResult.user) {
    console.log('✅ Administrateur créé dans auth.users');
    
    // Créer le profil dans la table users
    const userProfile = {
      id: adminResult.user.id,
      email: adminData.email,
      full_name: adminData.user_metadata.full_name,
      role: 'admin',
      status: 'active',
      total_invested: 0,
      total_profit: 0
    };

    const profileResult = await makeRequest('/rest/v1/users', {
      method: 'POST',
      body: JSON.stringify(userProfile)
    });

    if (profileResult) {
      console.log('✅ Profil administrateur créé dans users');
    } else {
      console.log('❌ Erreur création profil administrateur');
    }
  } else {
    console.log('⚠️ Administrateur déjà existant ou erreur de création');
  }

  console.log('\n🎉 Configuration terminée !');
  console.log('\n📋 Identifiants de connexion :');
  console.log('Email: admin@cryptoboost.world');
  console.log('Mot de passe: AdminCrypto2024!');
  console.log('\n🔗 URL de connexion: https://cryptoboost.world/auth/login');
}

setupDatabase().catch(console.error);