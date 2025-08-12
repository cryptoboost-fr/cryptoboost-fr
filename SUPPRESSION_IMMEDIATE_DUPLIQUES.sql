-- SUPPRESSION IMMEDIATE DES POLITIQUES DUPLIQUEES
-- Script direct pour supprimer les 2 politiques en double
-- Executer dans Supabase SQL Editor

-- ===============================================
-- SUPPRESSION DES 2 POLITIQUES DUPLIQUEES
-- ===============================================

-- 1. Supprimer la politique dupliquee sur investment_plans
DROP POLICY "Admins manage plans" ON investment_plans;

-- 2. Supprimer la politique dupliquee sur user_investments  
DROP POLICY "Allow admin access" ON user_investments;

-- ===============================================
-- VERIFICATION IMMEDIATE
-- ===============================================

-- Compter les politiques par table
SELECT 
    tablename,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Lister toutes les politiques restantes
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;