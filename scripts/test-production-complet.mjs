import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://xqjqjqjqjqjqjqjqjqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTc1NTcsImV4cCI6MjA3MDM5MzU1N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

// URL de production
const PRODUCTION_URL = 'https://cryptoboost.world';

console.log('🎯 TEST COMPLET PRODUCTION - CryptoBoost Application');
console.log('====================================================\n');

// Test 1: Connexion à l'application en production
async function testProductionConnection() {
    console.log('1️⃣ Test de connexion à l\'application en production...');
    try {
        const response = await fetch(PRODUCTION_URL, { 
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (response.ok) {
            console.log('✅ Application en production accessible');
            console.log(`   Status: ${response.status}`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            return true;
        } else {
            console.log(`❌ Application non accessible - Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur de connexion à l\'application:', error.message);
        return false;
    }
}

// Test 2: Connexion Supabase
async function testSupabaseConnection() {
    console.log('\n2️⃣ Test de connexion à Supabase...');
    try {
        const { data, error } = await supabase.from('investment_plans').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Connexion à Supabase réussie');
        return true;
    } catch (error) {
        console.log('❌ Erreur de connexion à Supabase:', error.message);
        return false;
    }
}

// Test 3: Test des données publiques
async function testPublicData() {
    console.log('\n3️⃣ Test des données publiques...');
    
    // Test plans d'investissement
    try {
        const { data: plans, error: plansError } = await supabase
            .from('investment_plans')
            .select('*');
        
        if (plansError) throw plansError;
        console.log(`✅ ${plans.length} plans d'investissement accessibles`);
        
        // Afficher les plans uniques
        const uniquePlans = [...new Set(plans.map(p => p.name))];
        console.log(`   Plans uniques: ${uniquePlans.join(', ')}`);
    } catch (error) {
        console.log('❌ Erreur plans d\'investissement:', error.message);
    }
    
    // Test wallets crypto
    try {
        const { data: wallets, error: walletsError } = await supabase
            .from('crypto_wallets')
            .select('*');
        
        if (walletsError) throw walletsError;
        console.log(`✅ ${wallets.length} wallets crypto accessibles`);
        
        // Afficher les cryptos uniques
        const uniqueCryptos = [...new Set(wallets.map(w => w.crypto_type))];
        console.log(`   Cryptos uniques: ${uniqueCryptos.join(', ')}`);
    } catch (error) {
        console.log('❌ Erreur wallets crypto:', error.message);
    }
}

// Test 4: Test d'inscription utilisateur
async function testUserRegistration() {
    console.log('\n4️⃣ Test d\'inscription utilisateur...');
    const testEmail = `test-prod-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Test User Production',
                    role: 'user'
                }
            }
        });
        
        if (error) throw error;
        
        console.log('✅ Inscription utilisateur réussie');
        console.log(`   Email: ${testEmail}`);
        console.log(`   ID: ${data.user.id}`);
        
        // Nettoyer - supprimer l'utilisateur de test
        await supabase.auth.signOut();
        
        return { email: testEmail, password: testPassword, userId: data.user.id };
    } catch (error) {
        console.log('❌ Erreur d\'inscription:', error.message);
        return null;
    }
}

// Test 5: Test de connexion utilisateur
async function testUserLogin(testCredentials) {
    console.log('\n5️⃣ Test de connexion utilisateur...');
    
    if (!testCredentials) {
        console.log('⚠️ Pas de credentials de test disponibles');
        return false;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: testCredentials.email,
            password: testCredentials.password
        });
        
        if (error) throw error;
        
        console.log('✅ Connexion utilisateur réussie');
        console.log(`   Email: ${data.user.email}`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Rôle: ${data.user.user_metadata?.role || 'user'}`);
        
        // Test accès aux données utilisateur
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (userError) {
            console.log('⚠️ Impossible d\'accéder aux données utilisateur:', userError.message);
        } else {
            console.log('✅ Données utilisateur accessibles');
        }
        
        await supabase.auth.signOut();
        return true;
    } catch (error) {
        console.log('❌ Erreur de connexion:', error.message);
        return false;
    }
}

// Test 6: Test de connexion admin
async function testAdminLogin() {
    console.log('\n6️⃣ Test de connexion admin...');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (error) throw error;
        
        console.log('✅ Connexion admin réussie');
        console.log(`   Email: ${data.user.email}`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Rôle: ${data.user.user_metadata?.role || 'admin'}`);
        
        // Test accès aux données admin
        const { data: adminData, error: adminError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (adminError) {
            console.log('⚠️ Impossible d\'accéder aux données admin:', adminError.message);
        } else {
            console.log('✅ Données admin accessibles');
        }
        
        await supabase.auth.signOut();
        return true;
    } catch (error) {
        console.log('❌ Erreur de connexion admin:', error.message);
        return false;
    }
}

// Test 7: Test des routes de l'application en production
async function testProductionRoutes() {
    console.log('\n7️⃣ Test des routes de l\'application en production...');
    
    const routes = [
        '/',
        '/login',
        '/register',
        '/dashboard',
        '/admin',
        '/plans',
        '/wallets',
        '/profile'
    ];
    
    let accessibleRoutes = 0;
    
    for (const route of routes) {
        try {
            const response = await fetch(`${PRODUCTION_URL}${route}`, { 
                timeout: 5000,
                redirect: 'manual',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.status === 200 || response.status === 302) {
                console.log(`✅ Route ${route} accessible (${response.status})`);
                accessibleRoutes++;
            } else {
                console.log(`⚠️ Route ${route} - Status: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Route ${route} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`\n   ${accessibleRoutes}/${routes.length} routes accessibles`);
    return accessibleRoutes >= 5; // Au moins 5 routes sur 8
}

// Test 8: Test du contenu HTML de l'application
async function testAppContent() {
    console.log('\n8️⃣ Test du contenu de l\'application...');
    
    try {
        const response = await fetch(PRODUCTION_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = await response.text();
        
        // Vérifier la présence d'éléments React
        const contentChecks = [
            { name: 'React App', pattern: /<div id="root">/ },
            { name: 'CryptoBoost', pattern: /CryptoBoost/i },
            { name: 'JavaScript', pattern: /\.js/ },
            { name: 'CSS', pattern: /\.css/ },
            { name: 'Meta tags', pattern: /<meta/ },
            { name: 'Title', pattern: /<title>/ }
        ];
        
        let foundElements = 0;
        
        contentChecks.forEach(check => {
            if (check.pattern.test(html)) {
                console.log(`✅ ${check.name} détecté`);
                foundElements++;
            } else {
                console.log(`⚠️ ${check.name} non détecté`);
            }
        });
        
        console.log(`\n   ${foundElements}/${contentChecks.length} éléments détectés`);
        return foundElements >= 4; // Au moins 4 éléments sur 6
    } catch (error) {
        console.log('❌ Erreur lors du test du contenu:', error.message);
        return false;
    }
}

// Test 9: Test des politiques RLS
async function testRLSPolicies() {
    console.log('\n9️⃣ Test des politiques RLS...');
    
    try {
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*');
        
        if (error) {
            console.log('⚠️ Impossible de vérifier les politiques RLS:', error.message);
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

// Test 10: Test des fonctionnalités avancées
async function testAdvancedFeatures() {
    console.log('\n🔟 Test des fonctionnalités avancées...');
    
    // Test de la structure de la base de données
    const tables = ['users', 'investment_plans', 'crypto_wallets', 'user_investments'];
    let accessibleTables = 0;
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (error) throw error;
            
            console.log(`✅ Table ${table} accessible`);
            accessibleTables++;
        } catch (error) {
            console.log(`❌ Table ${table} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`\n   ${accessibleTables}/${tables.length} tables accessibles`);
    
    // Test des extensions PostgreSQL
    try {
        const { data, error } = await supabase.rpc('get_extensions');
        if (error) throw error;
        console.log('✅ Extensions PostgreSQL vérifiées');
    } catch (error) {
        console.log('⚠️ Impossible de vérifier les extensions:', error.message);
    }
    
    return accessibleTables >= 3; // Au moins 3 tables sur 4
}

// Test 11: Test de performance
async function testPerformance() {
    console.log('\n⚡ Test de performance...');
    
    const startTime = Date.now();
    
    try {
        const response = await fetch(PRODUCTION_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const loadTime = Date.now() - startTime;
        
        if (response.ok) {
            console.log(`✅ Temps de chargement: ${loadTime}ms`);
            
            if (loadTime < 3000) {
                console.log('✅ Performance excellente (< 3s)');
                return true;
            } else if (loadTime < 5000) {
                console.log('⚠️ Performance acceptable (< 5s)');
                return true;
            } else {
                console.log('❌ Performance lente (> 5s)');
                return false;
            }
        } else {
            console.log('❌ Erreur lors du test de performance');
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur lors du test de performance:', error.message);
        return false;
    }
}

// Test 12: Test de sécurité
async function testSecurity() {
    console.log('\n🔒 Test de sécurité...');
    
    // Test des en-têtes de sécurité
    try {
        const response = await fetch(PRODUCTION_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const securityHeaders = [
            'X-Frame-Options',
            'X-Content-Type-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security',
            'Content-Security-Policy'
        ];
        
        let securityScore = 0;
        
        securityHeaders.forEach(header => {
            const value = response.headers.get(header);
            if (value) {
                console.log(`✅ ${header}: ${value}`);
                securityScore++;
            } else {
                console.log(`⚠️ ${header}: Non défini`);
            }
        });
        
        console.log(`\n   Score de sécurité: ${securityScore}/${securityHeaders.length}`);
        return securityScore >= 2; // Au moins 2 en-têtes de sécurité
    } catch (error) {
        console.log('❌ Erreur lors du test de sécurité:', error.message);
        return false;
    }
}

// Fonction principale
async function runProductionTest() {
    console.log('🚀 Démarrage du test complet en production...\n');
    
    const results = {
        production: await testProductionConnection(),
        supabase: await testSupabaseConnection(),
        publicData: await testPublicData(),
        registration: await testUserRegistration(),
        userLogin: await testUserLogin(await testUserRegistration()),
        adminLogin: await testAdminLogin(),
        routes: await testProductionRoutes(),
        content: await testAppContent(),
        rlsPolicies: await testRLSPolicies(),
        advanced: await testAdvancedFeatures(),
        performance: await testPerformance(),
        security: await testSecurity()
    };
    
    // Résumé final
    console.log('\n====================================================');
    console.log('🎯 RÉSULTATS DU TEST COMPLET PRODUCTION');
    console.log('====================================================');
    
    const successfulTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n✅ Tests réussis: ${successfulTests}/${totalTests}`);
    console.log(`📊 Taux de succès: ${Math.round((successfulTests / totalTests) * 100)}%`);
    
    console.log('\n📋 Détail des tests:');
    Object.entries(results).forEach(([test, result]) => {
        const status = result ? '✅' : '❌';
        const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`   ${status} ${testName}`);
    });
    
    console.log('\n🎯 ÉVALUATION FINALE:');
    
    if (successfulTests >= 10) {
        console.log('🏆 EXCELLENT - Application prête pour la production');
    } else if (successfulTests >= 8) {
        console.log('✅ BON - Application fonctionnelle avec quelques améliorations');
    } else if (successfulTests >= 6) {
        console.log('⚠️ MOYEN - Application partiellement fonctionnelle');
    } else {
        console.log('❌ CRITIQUE - Application nécessite des corrections majeures');
    }
    
    console.log('\n🔧 RECOMMANDATIONS:');
    
    if (!results.production) {
        console.log('   - Vérifier que l\'application est déployée sur Netlify');
    }
    
    if (!results.adminLogin) {
        console.log('   - Résoudre le problème de connexion admin');
    }
    
    if (!results.routes) {
        console.log('   - Vérifier la configuration des routes React Router');
    }
    
    if (!results.performance) {
        console.log('   - Optimiser les performances de l\'application');
    }
    
    if (!results.security) {
        console.log('   - Ajouter des en-têtes de sécurité');
    }
    
    console.log('\n🎉 Test complet en production terminé !');
}

// Exécuter le test
runProductionTest().catch(console.error);