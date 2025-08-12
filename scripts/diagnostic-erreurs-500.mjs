import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTc1NTcsImV4cCI6MjA3MDM5MzU1N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 DIAGNOSTIC DES ERREURS 500 - CryptoBoost');
console.log('==========================================\n');

// Test 1: Connexion de base à Supabase
async function testBasicConnection() {
    console.log('1️⃣ Test de connexion de base à Supabase...');
    try {
        const { data, error } = await supabase.from('investment_plans').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Connexion de base réussie');
        return true;
    } catch (error) {
        console.log('❌ Erreur de connexion de base:', error.message);
        return false;
    }
}

// Test 2: Test d'authentification avec credentials admin
async function testAdminAuth() {
    console.log('\n2️⃣ Test d\'authentification admin...');
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (error) {
            console.log('❌ Erreur d\'authentification admin:', error.message);
            console.log('   Code d\'erreur:', error.status);
            console.log('   Détails:', error);
            return false;
        }
        
        console.log('✅ Authentification admin réussie');
        console.log(`   Email: ${data.user.email}`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Rôle: ${data.user.user_metadata?.role || 'admin'}`);
        
        await supabase.auth.signOut();
        return true;
        
    } catch (error) {
        console.log('❌ Erreur lors de l\'authentification admin:', error.message);
        return false;
    }
}

// Test 3: Test d'inscription utilisateur
async function testUserRegistration() {
    console.log('\n3️⃣ Test d\'inscription utilisateur...');
    const testEmail = `test-diagnostic-${Date.now()}@example.com`;
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPassword123!',
            options: {
                data: {
                    full_name: 'Test User Diagnostic',
                    role: 'user'
                }
            }
        });
        
        if (error) {
            console.log('❌ Erreur d\'inscription:', error.message);
            console.log('   Code d\'erreur:', error.status);
            console.log('   Détails:', error);
            return false;
        }
        
        console.log('✅ Inscription utilisateur réussie');
        console.log(`   Email: ${testEmail}`);
        console.log(`   ID: ${data.user.id}`);
        
        await supabase.auth.signOut();
        return true;
        
    } catch (error) {
        console.log('❌ Erreur lors de l\'inscription:', error.message);
        return false;
    }
}

// Test 4: Test d'accès aux tables avec authentification
async function testAuthenticatedAccess() {
    console.log('\n4️⃣ Test d\'accès authentifié aux tables...');
    
    try {
        // Se connecter d'abord
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (authError) {
            console.log('❌ Impossible de s\'authentifier pour le test:', authError.message);
            return false;
        }
        
        // Test d'accès à la table users
        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
        
        if (usersError) {
            console.log('❌ Erreur accès table users:', usersError.message);
        } else {
            console.log('✅ Accès à la table users réussi');
        }
        
        // Test d'accès à la table investment_plans
        const { data: plansData, error: plansError } = await supabase
            .from('investment_plans')
            .select('*')
            .limit(1);
        
        if (plansError) {
            console.log('❌ Erreur accès table investment_plans:', plansError.message);
        } else {
            console.log('✅ Accès à la table investment_plans réussi');
        }
        
        // Test d'accès à la table crypto_wallets
        const { data: walletsData, error: walletsError } = await supabase
            .from('crypto_wallets')
            .select('*')
            .limit(1);
        
        if (walletsError) {
            console.log('❌ Erreur accès table crypto_wallets:', walletsError.message);
        } else {
            console.log('✅ Accès à la table crypto_wallets réussi');
        }
        
        await supabase.auth.signOut();
        return true;
        
    } catch (error) {
        console.log('❌ Erreur lors du test d\'accès authentifié:', error.message);
        return false;
    }
}

// Test 5: Vérification des politiques RLS
async function testRLSPolicies() {
    console.log('\n5️⃣ Vérification des politiques RLS...');
    
    try {
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*');
        
        if (error) {
            console.log('❌ Impossible de vérifier les politiques RLS:', error.message);
            return false;
        }
        
        console.log(`✅ ${data.length} politiques RLS trouvées`);
        
        // Grouper par table
        const policiesByTable = {};
        data.forEach(policy => {
            if (!policiesByTable[policy.tablename]) {
                policiesByTable[policy.tablename] = [];
            }
            policiesByTable[policy.tablename].push(policy.policyname);
        });
        
        console.log('   Politiques par table:');
        Object.entries(policiesByTable).forEach(([table, policies]) => {
            console.log(`   - ${table}: ${policies.length} politiques`);
        });
        
        return true;
        
    } catch (error) {
        console.log('❌ Erreur lors de la vérification des politiques:', error.message);
        return false;
    }
}

// Test 6: Vérification de la structure de la base de données
async function testDatabaseStructure() {
    console.log('\n6️⃣ Vérification de la structure de la base de données...');
    
    const tables = ['users', 'investment_plans', 'crypto_wallets', 'user_investments'];
    let accessibleTables = 0;
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (error) {
                console.log(`❌ Table ${table} - Erreur: ${error.message}`);
            } else {
                console.log(`✅ Table ${table} accessible`);
                accessibleTables++;
            }
        } catch (error) {
            console.log(`❌ Table ${table} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`\n   ${accessibleTables}/${tables.length} tables accessibles`);
    return accessibleTables >= 3;
}

// Test 7: Test de l'endpoint d'authentification spécifique
async function testAuthEndpoint() {
    console.log('\n7️⃣ Test de l\'endpoint d\'authentification...');
    
    try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey
            },
            body: JSON.stringify({
                email: 'admin@cryptoboost.world',
                password: 'CryptoAdmin2024!'
            })
        });
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Status Text: ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Endpoint d\'authentification fonctionnel');
            return true;
        } else {
            const errorData = await response.text();
            console.log('❌ Erreur endpoint d\'authentification:', errorData);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur lors du test de l\'endpoint:', error.message);
        return false;
    }
}

// Fonction principale
async function runDiagnostic() {
    console.log('🚀 Démarrage du diagnostic des erreurs 500...\n');
    
    const results = {
        basicConnection: await testBasicConnection(),
        adminAuth: await testAdminAuth(),
        userRegistration: await testUserRegistration(),
        authenticatedAccess: await testAuthenticatedAccess(),
        rlsPolicies: await testRLSPolicies(),
        databaseStructure: await testDatabaseStructure(),
        authEndpoint: await testAuthEndpoint()
    };
    
    // Résumé final
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RÉSULTATS DU DIAGNOSTIC');
    console.log('='.repeat(60));
    
    const successfulTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📊 Statistiques générales:`);
    console.log(`   Tests réussis: ${successfulTests}/${totalTests}`);
    console.log(`   Taux de succès: ${Math.round((successfulTests / totalTests) * 100)}%`);
    
    console.log('\n📋 Détail des tests:');
    Object.entries(results).forEach(([test, result]) => {
        const status = result ? '✅' : '❌';
        const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`   ${status} ${testName}`);
    });
    
    console.log('\n🔧 ANALYSE DES ERREURS 500:');
    
    if (!results.adminAuth || !results.userRegistration) {
        console.log('   ❌ Problème d\'authentification Supabase');
        console.log('   🔧 Solutions possibles:');
        console.log('      1. Vérifier les credentials admin');
        console.log('      2. Vérifier les politiques RLS');
        console.log('      3. Vérifier la configuration Supabase');
    }
    
    if (!results.authenticatedAccess) {
        console.log('   ❌ Problème d\'accès aux tables');
        console.log('   🔧 Solutions possibles:');
        console.log('      1. Vérifier les politiques RLS');
        console.log('      2. Vérifier les permissions utilisateur');
        console.log('      3. Vérifier la structure de la base de données');
    }
    
    if (!results.authEndpoint) {
        console.log('   ❌ Problème avec l\'endpoint d\'authentification');
        console.log('   🔧 Solutions possibles:');
        console.log('      1. Vérifier la configuration Supabase');
        console.log('      2. Vérifier les clés API');
        console.log('      3. Vérifier les paramètres d\'authentification');
    }
    
    console.log('\n🎯 RECOMMANDATIONS:');
    
    if (successfulTests >= totalTests * 0.7) {
        console.log('✅ La plupart des fonctionnalités fonctionnent');
        console.log('   - Vérifier manuellement l\'authentification');
        console.log('   - Tester les fonctionnalités spécifiques');
    } else {
        console.log('❌ Problèmes majeurs détectés');
        console.log('   - Vérifier la configuration Supabase');
        console.log('   - Corriger les politiques RLS');
        console.log('   - Vérifier les credentials');
    }
    
    console.log('\n🎉 Diagnostic terminé !');
}

// Exécuter le diagnostic
runDiagnostic().catch(console.error);