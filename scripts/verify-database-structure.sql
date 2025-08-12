-- Script de vérification de la structure de la base de données
-- À exécuter AVANT le script de réparation pour diagnostiquer les problèmes

-- =====================================================
-- 1. VÉRIFICATION DES TABLES EXISTANTES
-- =====================================================

SELECT '=== VÉRIFICATION DES TABLES ===' as info;

SELECT 
  table_name,
  table_type,
  CASE 
    WHEN table_name IN ('users', 'transactions', 'user_investments', 'investment_plans', 'crypto_wallets', 'system_logs', 'system_settings', 'notifications') 
    THEN '✅ REQUISE'
    ELSE '❌ NON REQUISE'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- 2. VÉRIFICATION DES COLONNES DE CHAQUE TABLE
-- =====================================================

SELECT '=== VÉRIFICATION DES COLONNES ===' as info;

-- Vérifier les colonnes de system_logs
SELECT 'system_logs columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'system_logs'
ORDER BY ordinal_position;

-- Vérifier les colonnes de transactions
SELECT 'transactions columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transactions'
ORDER BY ordinal_position;

-- Vérifier les colonnes de user_investments
SELECT 'user_investments columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_investments'
ORDER BY ordinal_position;

-- Vérifier les colonnes de users
SELECT 'users columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les colonnes de investment_plans
SELECT 'investment_plans columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'investment_plans'
ORDER BY ordinal_position;

-- Vérifier les colonnes de crypto_wallets
SELECT 'crypto_wallets columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'crypto_wallets'
ORDER BY ordinal_position;

-- Vérifier les colonnes de system_settings
SELECT 'system_settings columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'system_settings'
ORDER BY ordinal_position;

-- Vérifier les colonnes de notifications
SELECT 'notifications columns:' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notifications'
ORDER BY ordinal_position;

-- =====================================================
-- 3. VÉRIFICATION DES POLITIQUES RLS EXISTANTES
-- =====================================================

SELECT '=== VÉRIFICATION DES POLITIQUES RLS ===' as info;

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 4. VÉRIFICATION DU STATUT RLS
-- =====================================================

SELECT '=== VÉRIFICATION DU STATUT RLS ===' as info;

SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications', 'investment_plans', 'crypto_wallets')
ORDER BY tablename;

-- =====================================================
-- 5. VÉRIFICATION DES INDEX EXISTANTS
-- =====================================================

SELECT '=== VÉRIFICATION DES INDEX ===' as info;

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('users', 'transactions', 'user_investments', 'system_logs', 'system_settings', 'notifications', 'investment_plans', 'crypto_wallets')
ORDER BY tablename, indexname;

-- =====================================================
-- 6. VÉRIFICATION DES FONCTIONS RPC
-- =====================================================

SELECT '=== VÉRIFICATION DES FONCTIONS RPC ===' as info;

SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN ('get_dashboard_stats', 'column_exists');

-- =====================================================
-- 7. TEST DE DONNÉES EXISTANTES
-- =====================================================

SELECT '=== VÉRIFICATION DES DONNÉES ===' as info;

-- Compter les enregistrements dans chaque table
SELECT 'users count:' as table_name, COUNT(*) as count FROM users;
SELECT 'transactions count:' as table_name, COUNT(*) as count FROM transactions;
SELECT 'user_investments count:' as table_name, COUNT(*) as count FROM user_investments;
SELECT 'system_logs count:' as table_name, COUNT(*) as count FROM system_logs;
SELECT 'system_settings count:' as table_name, COUNT(*) as count FROM system_settings;
SELECT 'notifications count:' as table_name, COUNT(*) as count FROM notifications;
SELECT 'investment_plans count:' as table_name, COUNT(*) as count FROM investment_plans;
SELECT 'crypto_wallets count:' as table_name, COUNT(*) as count FROM crypto_wallets;

-- =====================================================
-- 8. RÉSUMÉ DES PROBLÈMES IDENTIFIÉS
-- =====================================================

SELECT '=== RÉSUMÉ DES PROBLÈMES ===' as info;

-- Vérifier si system_logs a la colonne 'level'
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'system_logs' 
      AND column_name = 'level'
    ) 
    THEN '✅ Colonne level existe dans system_logs'
    ELSE '❌ Colonne level MANQUANTE dans system_logs'
  END as status;

-- Vérifier si transactions a la colonne 'currency'
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'transactions' 
      AND column_name = 'currency'
    ) 
    THEN '✅ Colonne currency existe dans transactions'
    ELSE '❌ Colonne currency MANQUANTE dans transactions'
  END as status;

-- Vérifier si toutes les tables requises existent
SELECT 
  CASE 
    WHEN COUNT(*) = 8 THEN '✅ Toutes les tables requises existent'
    ELSE '❌ Tables manquantes: ' || (8 - COUNT(*)) || ' tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'transactions', 'user_investments', 'investment_plans', 'crypto_wallets', 'system_logs', 'system_settings', 'notifications');