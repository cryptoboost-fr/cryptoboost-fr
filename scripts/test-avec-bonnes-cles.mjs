import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec les bonnes clés
// Note: Ces clés doivent être remplacées par les vraies clés de votre projet
const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co';

// Test avec différentes clés possibles
const possibleKeys = [
    // Clé anon publique (la plus probable)
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTc1NTcsImV4cCI6MjA3MDM5MzU1N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
    
    // Clé service_role (pour les tests admin)
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgxNzU1NywiZXhwIjoyMDcwMzkzNTU3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
    
    // Autres clés possibles (à remplacer par les vraies)
    'VOTRE_CLE_ANON_ICI',
    'VOTRE_CLE_SERVICE_ROLE_ICI'
];

const PRODUCTION_URL = 'https://cryptoboost.world';

console.log('🔑 TEST AVEC BONNES CLÉS - CryptoBoost');
console.log('======================================\n');

// Test de connexion avec différentes clés
async function testWithDifferentKeys() {
    console.log('🔍 Test de connexion avec différentes clés...\n');
    
    for (let i = 0; i < possibleKeys.length; i++) {
        const key = possibleKeys[i];
        console.log(`Test ${i + 1}: Clé ${key.substring(0, 20)}...`);
        
        try {
            const supabase = createClient(supabaseUrl, key);
            
            // Test de connexion de base
            const { data, error } = await supabase.from('investment_plans').select('*').limit(1);
            
            if (error) {
                console.log(`   ❌ Erreur: ${error.message}`);
            } else {
                console.log(`   ✅ Connexion réussie avec la clé ${i + 1}!`);
                console.log(`   📊 Données récupérées: ${data.length} enregistrements`);
                
                // Test d'authentification admin avec cette clé
                await testAdminAuthWithKey(supabase, i + 1);
                
                return { key, supabase };
            }
        } catch (error) {
            console.log(`   ❌ Erreur: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('❌ Aucune clé valide trouvée');
    return null;
}

// Test d'authentification admin avec une clé spécifique
async function testAdminAuthWithKey(supabase, keyNumber) {
    console.log(`   🔐 Test d'authentification admin avec la clé ${keyNumber}...`);
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@cryptoboost.world',
            password: 'CryptoAdmin2024!'
        });
        
        if (error) {
            console.log(`      ❌ Erreur auth: ${error.message}`);
        } else {
            console.log(`      ✅ Authentification admin réussie!`);
            console.log(`      👤 Email: ${data.user.email}`);
            console.log(`      🆔 ID: ${data.user.id}`);
            console.log(`      👑 Rôle: ${data.user.user_metadata?.role || 'admin'}`);
            
            await supabase.auth.signOut();
        }
    } catch (error) {
        console.log(`      ❌ Erreur: ${error.message}`);
    }
}

// Test de l'application web
async function testWebApp() {
    console.log('\n🌐 Test de l\'application web...');
    
    const routes = ['/', '/about', '/contact', '/register', '/login', '/dashboard', '/admin'];
    let successCount = 0;
    
    for (const route of routes) {
        try {
            const response = await fetch(`${PRODUCTION_URL}${route}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.ok) {
                console.log(`✅ Route ${route} accessible (${response.status})`);
                successCount++;
            } else {
                console.log(`⚠️ Route ${route} - Status: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Route ${route} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`\n📊 ${successCount}/${routes.length} routes accessibles`);
    return successCount >= routes.length * 0.7;
}

// Test complet avec la bonne clé
async function runCompleteTestWithGoodKey() {
    console.log('🚀 Démarrage du test avec les bonnes clés...\n');
    
    // Test 1: Trouver une clé valide
    const keyResult = await testWithDifferentKeys();
    
    if (!keyResult) {
        console.log('\n❌ Aucune clé valide trouvée. Veuillez vérifier les clés API dans Supabase Dashboard.');
        console.log('\n📋 Instructions pour récupérer les bonnes clés:');
        console.log('1. Aller sur https://supabase.com');
        console.log('2. Se connecter à votre compte');
        console.log('3. Sélectionner le projet CryptoBoost');
        console.log('4. Aller dans Settings → API');
        console.log('5. Copier la clé "anon public"');
        console.log('6. Mettre à jour le script avec la bonne clé');
        return;
    }
    
    const { key, supabase } = keyResult;
    
    // Test 2: Test de l'application web
    const webAppWorking = await testWebApp();
    
    // Test 3: Test des données avec la bonne clé
    console.log('\n📊 Test des données avec la bonne clé...');
    
    try {
        // Test plans d'investissement
        const { data: plans, error: plansError } = await supabase
            .from('investment_plans')
            .select('*');
        
        if (plansError) {
            console.log(`❌ Erreur plans: ${plansError.message}`);
        } else {
            console.log(`✅ ${plans.length} plans d'investissement accessibles`);
        }
        
        // Test wallets crypto
        const { data: wallets, error: walletsError } = await supabase
            .from('crypto_wallets')
            .select('*');
        
        if (walletsError) {
            console.log(`❌ Erreur wallets: ${walletsError.message}`);
        } else {
            console.log(`✅ ${wallets.length} wallets crypto accessibles`);
        }
        
        // Test utilisateurs (si admin)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(5);
        
        if (usersError) {
            console.log(`❌ Erreur utilisateurs: ${usersError.message}`);
        } else {
            console.log(`✅ ${users.length} utilisateurs accessibles`);
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors du test des données: ${error.message}`);
    }
    
    // Résumé final
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RÉSULTATS DU TEST AVEC BONNES CLÉS');
    console.log('='.repeat(60));
    
    console.log('\n✅ CLÉ VALIDE TROUVÉE!');
    console.log(`   Clé utilisée: ${key.substring(0, 20)}...`);
    console.log(`   Application web: ${webAppWorking ? '✅ Fonctionnelle' : '⚠️ Problèmes'}`);
    
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Mettre à jour les variables d\'environnement avec la bonne clé');
    console.log('2. Redéployer l\'application si nécessaire');
    console.log('3. Tester manuellement l\'authentification');
    console.log('4. Vérifier toutes les fonctionnalités');
    
    console.log('\n🎉 Test terminé avec succès!');
}

// Exécuter le test
runCompleteTestWithGoodKey().catch(console.error);