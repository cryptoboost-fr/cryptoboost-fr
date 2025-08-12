#!/usr/bin/env node

/**
 * ADMIN ACCESS VERIFICATION SCRIPT
 * Verifies admin credentials and dashboard access
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

// Admin credentials to test
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@cryptoboost.world',
    password: 'CryptoAdmin2024!',
    name: 'Primary Admin'
  },
  {
    email: 'admin@cryptoboost.world',
    password: 'admin123',
    name: 'Backup Admin'
  }
];

// URLs to test
const ADMIN_URLS = [
  'https://cryptoboost.world',
  'https://cryptoboost.world/admin',
  'https://cryptoboost.world/admin/users',
  'https://cryptoboost.world/admin/transactions',
  'https://cryptoboost.world/admin/plans',
  'https://cryptoboost.world/admin/logs',
  'https://cryptoboost.world/admin/wallets',
  'https://cryptoboost.world/admin/settings'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

// Test admin authentication
async function testAdminAuth() {
  log('\n🔐 TESTING ADMIN AUTHENTICATION', 'cyan');
  log('=====================================', 'cyan');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  for (const credential of ADMIN_CREDENTIALS) {
    log(`\n🧪 Testing ${credential.name}...`, 'blue');
    log(`   Email: ${credential.email}`);
    log(`   Password: ${'*'.repeat(credential.password.length)}`);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credential.email,
        password: credential.password
      });

      if (error) {
        logError(`Authentication failed: ${error.message}`);
        continue;
      }

      if (data.user) {
        logSuccess(`Authentication successful!`);
        log(`   User ID: ${data.user.id}`, 'green');
        log(`   Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`, 'green');

        // Check user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          logWarning(`Profile check failed: ${profileError.message}`);
        } else if (profile) {
          logSuccess(`Profile found!`);
          log(`   Name: ${profile.full_name}`, 'green');
          log(`   Role: ${profile.role}`, 'green');
          log(`   Status: ${profile.status}`, 'green');

          if (profile.role === 'admin') {
            logSuccess(`✅ ADMIN ACCESS CONFIRMED!`);
            
            // Test admin permissions
            await testAdminPermissions(supabase, data.session.access_token);
            
            return {
              success: true,
              credentials: credential,
              user: profile,
              token: data.session.access_token
            };
          } else {
            logError(`User role is '${profile.role}', not 'admin'`);
          }
        } else {
          logError('No profile found for user');
        }

        // Sign out
        await supabase.auth.signOut();
      }
    } catch (error) {
      logError(`Test failed: ${error.message}`);
    }
  }

  return { success: false };
}

// Test admin permissions
async function testAdminPermissions(supabase, token) {
  log('\n🛡️ Testing admin permissions...', 'blue');

  const adminHeaders = {
    'Authorization': `Bearer ${token}`,
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };

  // Test access to admin-only tables
  const adminTables = ['users', 'transactions', 'investment_plans', 'system_logs'];
  
  for (const table of adminTables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
        headers: adminHeaders
      });

      if (response.ok) {
        logSuccess(`Access to ${table} table: OK`);
      } else {
        logError(`Access to ${table} table: DENIED (${response.status})`);
      }
    } catch (error) {
      logError(`Error testing ${table}: ${error.message}`);
    }
  }
}

// Test admin dashboard URLs
async function testAdminUrls() {
  log('\n🌐 TESTING ADMIN DASHBOARD URLS', 'cyan');
  log('==================================', 'cyan');

  for (const url of ADMIN_URLS) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout: 10000
      });

      if (response.ok) {
        logSuccess(`${url} - Accessible (${response.status})`);
      } else {
        logWarning(`${url} - Response: ${response.status}`);
      }
    } catch (error) {
      logError(`${url} - Error: ${error.message}`);
    }
  }
}

// Main verification function
async function verifyAdminAccess() {
  log('🔍 CRYPTOBOOST ADMIN ACCESS VERIFICATION', 'magenta');
  log('==========================================', 'magenta');
  log('This script verifies admin credentials and dashboard access\n', 'cyan');

  try {
    // Test authentication
    const authResult = await testAdminAuth();
    
    if (authResult.success) {
      log('\n🎉 ADMIN ACCESS VERIFICATION SUCCESSFUL!', 'green');
      log('=========================================', 'green');
      
      log('\n📋 VERIFIED ADMIN CREDENTIALS:', 'cyan');
      log(`   Email: ${authResult.credentials.email}`, 'green');
      log(`   Password: ${authResult.credentials.password}`, 'green');
      log(`   Name: ${authResult.user.full_name}`, 'green');
      log(`   Role: ${authResult.user.role}`, 'green');
      
      log('\n🌐 ADMIN DASHBOARD URLS:', 'cyan');
      log('   Main Dashboard: https://cryptoboost.world/admin', 'green');
      log('   User Management: https://cryptoboost.world/admin/users', 'green');
      log('   Transactions: https://cryptoboost.world/admin/transactions', 'green');
      log('   Investment Plans: https://cryptoboost.world/admin/plans', 'green');
      log('   System Logs: https://cryptoboost.world/admin/logs', 'green');
      log('   Crypto Wallets: https://cryptoboost.world/admin/wallets', 'green');
      log('   Settings: https://cryptoboost.world/admin/settings', 'green');
      
      log('\n🚀 READY TO USE ADMIN DASHBOARD!', 'green');
      
    } else {
      log('\n❌ ADMIN ACCESS VERIFICATION FAILED!', 'red');
      log('===================================', 'red');
      logError('Could not verify admin credentials');
      logInfo('Please check:');
      logInfo('1. Database is properly configured');
      logInfo('2. Admin user exists in auth.users table');
      logInfo('3. Admin profile exists in users table');
      logInfo('4. User role is set to "admin"');
      logInfo('5. Account status is "active"');
    }

    // Test dashboard URLs regardless
    await testAdminUrls();

  } catch (error) {
    logError(`Verification failed: ${error.message}`);
  }
}

// Run verification
verifyAdminAccess().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
