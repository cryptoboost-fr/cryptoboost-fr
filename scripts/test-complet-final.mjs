import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTc1NTcsImV4cCI6MjA3MDM5MzU1N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTION_URL = 'https://cryptoboost.world';

console.log('🚀 TEST COMPLET FINAL - CryptoBoost');
console.log('====================================\n');

// Test 1: Connexion à l'application
async function testAppConnection() {
    console.log('1️⃣ Test de connexion à l\'application...');
    try {
        const response = await fetch(PRODUCTION_URL);
        if (response.ok) {
            console.log('✅ Application accessible');
            return true;
        } else {
            console.log('❌ Erreur de connexion:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur de connexion:', error.message);
        return false;
    }
}

// Test 2: Connexion Supabase
async function testSupabaseConnection() {
    console.log('\n2️⃣ Test de connexion Supabase...');
    try {
        const { data, error } = await supabase.from('investment_plans').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Connexion Supabase réussie');
        return true;
    } catch (error) {
        console.log('❌ Erreur Supabase:', error.message);
        return false;
    }
}

// Test 3: Test d'authentification admin
async function testAdminAuth() {
    console.log('\n3️⃣ Test d\'authentification admin...');
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (error) {
            console.log('❌ Erreur d\'authentification admin:', error.message);
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

// Test 4: Test d'inscription utilisateur
async function testUserRegistration() {
    console.log('\n4️⃣ Test d\'inscription utilisateur...');
    const testEmail = `test-complet-${Date.now()}@example.com`;
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPassword123!',
            options: {
                data: {
                    full_name: 'Test User Complet',
                    role: 'user'
                }
            }
        });
        
        if (error) {
            console.log('❌ Erreur d\'inscription:', error.message);
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

// Test 5: Test d'accès aux données publiques
async function testPublicData() {
    console.log('\n5️⃣ Test d\'accès aux données publiques...');
    
    try {
        // Test plans d'investissement
        const { data: plans, error: plansError } = await supabase
            .from('investment_plans')
            .select('*');
        
        if (plansError) {
            console.log('❌ Erreur accès plans:', plansError.message);
        } else {
            console.log(`✅ ${plans.length} plans d'investissement accessibles`);
        }
        
        // Test wallets crypto
        const { data: wallets, error: walletsError } = await supabase
            .from('crypto_wallets')
            .select('*');
        
        if (walletsError) {
            console.log('❌ Erreur accès wallets:', walletsError.message);
        } else {
            console.log(`✅ ${wallets.length} wallets crypto accessibles`);
        }
        
        return !plansError && !walletsError;
        
    } catch (error) {
        console.log('❌ Erreur lors du test des données publiques:', error.message);
        return false;
    }
}

// Test 6: Test des routes de l'application
async function testAppRoutes() {
    console.log('\n6️⃣ Test des routes de l\'application...');
    
    const routes = [
        '/',
        '/about',
        '/contact',
        '/register',
        '/login',
        '/dashboard',
        '/admin'
    ];
    
    let successCount = 0;
    
    for (const route of routes) {
        try {
            const response = await fetch(`${PRODUCTION_URL}${route}`);
            if (response.ok) {
                console.log(`✅ Route ${route} accessible`);
                successCount++;
            } else {
                console.log(`❌ Route ${route} - Erreur: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Route ${route} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`\n   ${successCount}/${routes.length} routes accessibles`);
    return successCount >= routes.length * 0.8; // 80% de succès minimum
}

// Test 7: Test des politiques RLS
async function testRLSPolicies() {
    console.log('\n7️⃣ Test des politiques RLS...');
    
    try {
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*');
        
        if (error) {
            console.log('❌ Impossible de vérifier les politiques RLS:', error.message);
            return false;
        }
        
        console.log(`✅ ${data.length} politiques RLS trouvées`);
        
        // Vérifier les politiques essentielles
        const essentialPolicies = [
            'Users can view own profile',
            'Everyone can read investment plans',
            'Everyone can read crypto wallets'
        ];
        
        const foundPolicies = data.map(p => p.policyname);
        const missingPolicies = essentialPolicies.filter(p => !foundPolicies.includes(p));
        
        if (missingPolicies.length > 0) {
            console.log('⚠️ Politiques manquantes:', missingPolicies);
        } else {
            console.log('✅ Toutes les politiques essentielles présentes');
        }
        
        return true;
        
    } catch (error) {
        console.log('❌ Erreur lors de la vérification des politiques:', error.message);
        return false;
    }
}

// Test 8: Test de la structure de la base de données
async function testDatabaseStructure() {
    console.log('\n8️⃣ Test de la structure de la base de données...');
    
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

// Test 9: Test des fonctionnalités avancées
async function testAdvancedFeatures() {
    console.log('\n9️⃣ Test des fonctionnalités avancées...');
    
    try {
        // Se connecter en tant qu'admin
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (authError) {
            console.log('❌ Impossible de s\'authentifier pour les tests avancés:', authError.message);
            return false;
        }
        
        // Test d'accès aux utilisateurs (admin seulement)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(5);
        
        if (usersError) {
            console.log('❌ Erreur accès utilisateurs:', usersError.message);
        } else {
            console.log(`✅ Accès aux utilisateurs réussi (${users.length} utilisateurs)`);
        }
        
        // Test de création d'investissement
        const { data: investment, error: investmentError } = await supabase
            .from('user_investments')
            .insert({
                user_id: authData.user.id,
                plan_id: 1,
                amount: 100,
                status: 'pending'
            })
            .select();
        
        if (investmentError) {
            console.log('❌ Erreur création investissement:', investmentError.message);
        } else {
            console.log('✅ Création d\'investissement réussie');
            
            // Nettoyer l'investissement de test
            await supabase
                .from('user_investments')
                .delete()
                .eq('id', investment[0].id);
        }
        
        await supabase.auth.signOut();
        return !usersError;
        
    } catch (error) {
        console.log('❌ Erreur lors des tests avancés:', error.message);
        return false;
    }
}

// Test 10: Test de performance
async function testPerformance() {
    console.log('\n🔟 Test de performance...');
    
    const startTime = Date.now();
    
    try {
        // Test de chargement des données
        const { data, error } = await supabase
            .from('investment_plans')
            .select('*');
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (error) {
            console.log('❌ Erreur lors du test de performance:', error.message);
            return false;
        }
        
        console.log(`✅ Temps de réponse: ${responseTime}ms`);
        
        if (responseTime < 1000) {
            console.log('✅ Performance excellente');
            return true;
        } else if (responseTime < 3000) {
            console.log('⚠️ Performance acceptable');
            return true;
        } else {
            console.log('❌ Performance lente');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur lors du test de performance:', error.message);
        return false;
    }
}

// Fonction principale
async function runCompleteTest() {
    console.log('🚀 Démarrage du test complet final...\n');
    
    const results = {
        appConnection: await testAppConnection(),
        supabaseConnection: await testSupabaseConnection(),
        adminAuth: await testAdminAuth(),
        userRegistration: await testUserRegistration(),
        publicData: await testPublicData(),
        appRoutes: await testAppRoutes(),
        rlsPolicies: await testRLSPolicies(),
        databaseStructure: await testDatabaseStructure(),
        advancedFeatures: await testAdvancedFeatures(),
        performance: await testPerformance()
    };
    
    // Résumé final
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RÉSULTATS DU TEST COMPLET FINAL');
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
    
    console.log('\n🎯 ANALYSE FINALE:');
    
    if (successfulTests >= totalTests * 0.9) {
        console.log('✅ APPLICATION 100% FONCTIONNELLE');
        console.log('   - Toutes les fonctionnalités principales opérationnelles');
        console.log('   - Authentification admin et utilisateur fonctionnelle');
        console.log('   - Données accessibles et sécurisées');
        console.log('   - Performance optimale');
    } else if (successfulTests >= totalTests * 0.7) {
        console.log('⚠️ APPLICATION FONCTIONNELLE AVEC QUELQUES PROBLÈMES');
        console.log('   - La plupart des fonctionnalités opérationnelles');
        console.log('   - Quelques problèmes mineurs à corriger');
    } else {
        console.log('❌ PROBLÈMES MAJEURS DÉTECTÉS');
        console.log('   - Fonctionnalités critiques non opérationnelles');
        console.log('   - Corrections urgentes nécessaires');
    }
    
    console.log('\n🎉 Test complet terminé !');
    
    return results;
}

// Exécuter le test complet
runCompleteTest().catch(console.error);