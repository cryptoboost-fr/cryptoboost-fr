-- Core access: Grants and RLS policies for public schema
-- Run in Supabase SQL editor. Idempotent.

-- Basic grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Ensure anon/auth can read public reference tables
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='investment_plans') THEN
    EXECUTE 'ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY';

    -- Public read active plans
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investment_plans' AND policyname='Public read active plans'
    ) THEN
      CREATE POLICY "Public read active plans"
        ON public.investment_plans
        FOR SELECT
        TO anon, authenticated
        USING (is_active = true);
    END IF;

    -- Admins manage plans
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investment_plans' AND policyname='Admins manage plans'
    ) THEN
      CREATE POLICY "Admins manage plans"
        ON public.investment_plans
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
        WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;

    GRANT SELECT ON public.investment_plans TO anon, authenticated;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='crypto_wallets') THEN
    EXECUTE 'ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY';

    -- Public read active wallets
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='crypto_wallets' AND policyname='Public read active wallets'
    ) THEN
      CREATE POLICY "Public read active wallets"
        ON public.crypto_wallets
        FOR SELECT
        TO anon, authenticated
        USING (is_active = true);
    END IF;

    -- Admins manage wallets
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='crypto_wallets' AND policyname='Admins manage wallets'
    ) THEN
      CREATE POLICY "Admins manage wallets"
        ON public.crypto_wallets
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
        WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;

    GRANT SELECT ON public.crypto_wallets TO anon, authenticated;
  END IF;
END $$;

-- Users table policies
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='users') THEN
    EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';

    -- User reads own profile
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users read own profile'
    ) THEN
      CREATE POLICY "Users read own profile"
        ON public.users
        FOR SELECT
        TO authenticated
        USING (id = auth.uid());
    END IF;

    -- User creates own profile (used after email confirm)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users create own profile'
    ) THEN
      CREATE POLICY "Users create own profile"
        ON public.users
        FOR INSERT
        TO authenticated
        WITH CHECK (id = auth.uid());
    END IF;

    -- User updates own profile
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users update own profile'
    ) THEN
      CREATE POLICY "Users update own profile"
        ON public.users
        FOR UPDATE
        TO authenticated
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());
    END IF;

    -- Admins read and update all users
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Admins read all users'
    ) THEN
      CREATE POLICY "Admins read all users"
        ON public.users
        FOR SELECT
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Admins update users'
    ) THEN
      CREATE POLICY "Admins update users"
        ON public.users
        FOR UPDATE
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
        WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;
  END IF;
END $$;

-- Transactions table policies
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='transactions') THEN
    EXECUTE 'ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY';

    -- Users insert their own transactions (deposit/withdraw/exchange requests)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='Users insert own transactions'
    ) THEN
      CREATE POLICY "Users insert own transactions"
        ON public.transactions
        FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid());
    END IF;

    -- Users read their own transactions
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='Users read own transactions'
    ) THEN
      CREATE POLICY "Users read own transactions"
        ON public.transactions
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;

    -- Admins read and update all transactions
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='Admins read transactions'
    ) THEN
      CREATE POLICY "Admins read transactions"
        ON public.transactions
        FOR SELECT
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='Admins update transactions'
    ) THEN
      CREATE POLICY "Admins update transactions"
        ON public.transactions
        FOR UPDATE
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
        WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
    END IF;
  END IF;
END $$;