-- Enable RLS on notifications and system_logs (idempotent guards)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    RAISE NOTICE 'Table public.notifications does not exist, skipping';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'system_logs'
  ) THEN
    RAISE NOTICE 'Table public.system_logs does not exist, skipping';
  END IF;
END $$;

-- Notifications policies
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    EXECUTE 'ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY';

    -- Users can read their own notifications
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Users read own notifications'
    ) THEN
      CREATE POLICY "Users read own notifications"
        ON public.notifications
        FOR SELECT
        USING (user_id = auth.uid());
    END IF;

    -- Users can update their notifications (mark read / delete)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Users manage own notifications'
    ) THEN
      CREATE POLICY "Users manage own notifications"
        ON public.notifications
        FOR UPDATE
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Users delete own notifications'
    ) THEN
      CREATE POLICY "Users delete own notifications"
        ON public.notifications
        FOR DELETE
        USING (user_id = auth.uid());
    END IF;

    -- Admins can insert notifications for any user
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Admins insert notifications'
    ) THEN
      CREATE POLICY "Admins insert notifications"
        ON public.notifications
        FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid() AND u.role = 'admin'
          )
        );
    END IF;

    -- Admins can read all notifications
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Admins read all notifications'
    ) THEN
      CREATE POLICY "Admins read all notifications"
        ON public.notifications
        FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
          ) OR user_id = auth.uid()
        );
    END IF;
  END IF;
END $$;

-- System logs policies
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'system_logs'
  ) THEN
    EXECUTE 'ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY';

    -- Admins can insert logs
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='system_logs' AND policyname='Admins insert logs'
    ) THEN
      CREATE POLICY "Admins insert logs"
        ON public.system_logs
        FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
          )
        );
    END IF;

    -- Admins can read logs
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='system_logs' AND policyname='Admins read logs'
    ) THEN
      CREATE POLICY "Admins read logs"
        ON public.system_logs
        FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
          )
        );
    END IF;
  END IF;
END $$;