import puppeteer from 'puppeteer';

const BASE_URL = 'https://cryptoboost.world';

console.log('🎯 TEST COMPLET DES PAGES - CryptoBoost Application');
console.log('==================================================\n');

// Configuration du navigateur
const browserConfig = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
    ]
};

// Test d'une page spécifique
async function testPage(page, url, pageName) {
    try {
        console.log(`🔍 Test de ${pageName} (${url})...`);
        
        const startTime = Date.now();
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        const loadTime = Date.now() - startTime;
        
        // Vérifier le titre de la page
        const title = await page.title();
        
        // Vérifier si la page contient des éléments React
        const hasReactRoot = await page.evaluate(() => {
            return !!document.getElementById('root');
        });
        
        // Vérifier si la page contient du contenu CryptoBoost
        const hasCryptoBoostContent = await page.evaluate(() => {
            return document.body.textContent.includes('CryptoBoost');
        });
        
        // Vérifier les erreurs JavaScript
        const errors = await page.evaluate(() => {
            return window.errors || [];
        });
        
        // Vérifier les liens de navigation
        const navigationLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href]'));
            return links.map(link => ({
                text: link.textContent.trim(),
                href: link.href
            }));
        });
        
        console.log(`   ✅ ${pageName} chargée en ${loadTime}ms`);
        console.log(`   📄 Titre: ${title}`);
        console.log(`   ⚛️ React: ${hasReactRoot ? '✅' : '❌'}`);
        console.log(`   🎯 CryptoBoost: ${hasCryptoBoostContent ? '✅' : '❌'}`);
        console.log(`   🔗 Liens de navigation: ${navigationLinks.length}`);
        
        if (errors.length > 0) {
            console.log(`   ⚠️ Erreurs JavaScript: ${errors.length}`);
        }
        
        return {
            success: true,
            loadTime,
            title,
            hasReactRoot,
            hasCryptoBoostContent,
            navigationLinks: navigationLinks.length,
            errors: errors.length
        };
        
    } catch (error) {
        console.log(`   ❌ Erreur lors du test de ${pageName}: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

// Test des formulaires
async function testForms(page, url, pageName) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Test des formulaires de connexion/inscription
        const forms = await page.evaluate(() => {
            const formElements = document.querySelectorAll('form');
            return Array.from(formElements).map(form => ({
                action: form.action,
                method: form.method,
                inputs: Array.from(form.querySelectorAll('input')).map(input => ({
                    type: input.type,
                    name: input.name,
                    placeholder: input.placeholder
                }))
            }));
        });
        
        if (forms.length > 0) {
            console.log(`   📝 Formulaires trouvés: ${forms.length}`);
            forms.forEach((form, index) => {
                console.log(`      Form ${index + 1}: ${form.inputs.length} champs`);
            });
        }
        
        return forms.length;
        
    } catch (error) {
        console.log(`   ❌ Erreur lors du test des formulaires: ${error.message}`);
        return 0;
    }
}

// Test de la responsivité
async function testResponsiveness(page, url, pageName) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        const viewports = [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 667 }
        ];
        
        const results = [];
        
        for (const viewport of viewports) {
            await page.setViewport(viewport);
            
            const isResponsive = await page.evaluate(() => {
                // Vérifier si le contenu s'adapte à la largeur
                const body = document.body;
                const width = body.offsetWidth;
                const scrollWidth = body.scrollWidth;
                
                // Si la largeur de scroll est proche de la largeur du viewport, c'est responsive
                return Math.abs(scrollWidth - width) < 50;
            });
            
            results.push({
                viewport: viewport.name,
                responsive: isResponsive
            });
        }
        
        console.log(`   📱 Responsive design:`);
        results.forEach(result => {
            console.log(`      ${result.viewport}: ${result.responsive ? '✅' : '❌'}`);
        });
        
        return results;
        
    } catch (error) {
        console.log(`   ❌ Erreur lors du test responsive: ${error.message}`);
        return [];
    }
}

// Test des fonctionnalités interactives
async function testInteractions(page, url, pageName) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Test des boutons
        const buttons = await page.evaluate(() => {
            const buttonElements = document.querySelectorAll('button');
            return Array.from(buttonElements).map(button => ({
                text: button.textContent.trim(),
                type: button.type,
                disabled: button.disabled
            }));
        });
        
        // Test des liens
        const links = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('a[href]');
            return Array.from(linkElements).map(link => ({
                text: link.textContent.trim(),
                href: link.href
            }));
        });
        
        console.log(`   🖱️ Interactions:`);
        console.log(`      Boutons: ${buttons.length}`);
        console.log(`      Liens: ${links.length}`);
        
        return {
            buttons: buttons.length,
            links: links.length
        };
        
    } catch (error) {
        console.log(`   ❌ Erreur lors du test des interactions: ${error.message}`);
        return { buttons: 0, links: 0 };
    }
}

// Fonction principale de test
async function runCompletePageTest() {
    let browser;
    
    try {
        console.log('🚀 Démarrage du test complet des pages...\n');
        
        // Lancer le navigateur
        browser = await puppeteer.launch(browserConfig);
        const page = await browser.newPage();
        
        // Configuration de la page
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Pages à tester
        const pages = [
            { url: '/', name: 'Page d\'accueil' },
            { url: '/login', name: 'Page de connexion' },
            { url: '/register', name: 'Page d\'inscription' },
            { url: '/dashboard', name: 'Dashboard utilisateur' },
            { url: '/admin', name: 'Dashboard admin' },
            { url: '/plans', name: 'Page des plans' },
            { url: '/wallets', name: 'Page des wallets' },
            { url: '/profile', name: 'Page de profil' }
        ];
        
        const results = {
            total: pages.length,
            successful: 0,
            failed: 0,
            pages: []
        };
        
        // Tester chaque page
        for (const pageInfo of pages) {
            console.log(`\n📄 ${pageInfo.name.toUpperCase()}`);
            console.log('─'.repeat(50));
            
            const fullUrl = `${BASE_URL}${pageInfo.url}`;
            const pageResult = await testPage(page, fullUrl, pageInfo.name);
            
            if (pageResult.success) {
                results.successful++;
                
                // Tests supplémentaires pour les pages avec formulaires
                if (pageInfo.url === '/login' || pageInfo.url === '/register') {
                    await testForms(page, fullUrl, pageInfo.name);
                }
                
                // Test de responsivité pour la page d'accueil
                if (pageInfo.url === '/') {
                    await testResponsiveness(page, fullUrl, pageInfo.name);
                }
                
                // Test des interactions pour toutes les pages
                await testInteractions(page, fullUrl, pageInfo.name);
                
            } else {
                results.failed++;
            }
            
            results.pages.push({
                name: pageInfo.name,
                url: pageInfo.url,
                ...pageResult
            });
            
            // Pause entre les tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('🎯 RÉSULTATS DU TEST COMPLET DES PAGES');
        console.log('='.repeat(60));
        
        console.log(`\n📊 Statistiques générales:`);
        console.log(`   Total des pages: ${results.total}`);
        console.log(`   Pages réussies: ${results.successful}`);
        console.log(`   Pages échouées: ${results.failed}`);
        console.log(`   Taux de succès: ${Math.round((results.successful / results.total) * 100)}%`);
        
        console.log(`\n📋 Détail par page:`);
        results.pages.forEach(pageResult => {
            const status = pageResult.success ? '✅' : '❌';
            const loadTime = pageResult.loadTime ? ` (${pageResult.loadTime}ms)` : '';
            console.log(`   ${status} ${pageResult.name}${loadTime}`);
        });
        
        // Évaluation finale
        console.log(`\n🎯 ÉVALUATION FINALE:`);
        
        if (results.successful >= results.total * 0.8) {
            console.log('🏆 EXCELLENT - Toutes les pages principales fonctionnent');
        } else if (results.successful >= results.total * 0.6) {
            console.log('✅ BON - La plupart des pages fonctionnent');
        } else if (results.successful >= results.total * 0.4) {
            console.log('⚠️ MOYEN - Certaines pages ont des problèmes');
        } else {
            console.log('❌ CRITIQUE - Beaucoup de pages ne fonctionnent pas');
        }
        
        console.log('\n🔧 RECOMMANDATIONS:');
        
        if (results.failed > 0) {
            console.log('   - Vérifier les pages qui ont échoué');
            console.log('   - Corriger les erreurs JavaScript');
            console.log('   - Optimiser les temps de chargement');
        }
        
        if (results.successful > 0) {
            console.log('   - Tester manuellement les fonctionnalités');
            console.log('   - Valider les formulaires d\'authentification');
            console.log('   - Vérifier la responsivité sur mobile');
        }
        
        console.log('\n🎉 Test complet des pages terminé !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Exécuter le test
runCompletePageTest().catch(console.error);