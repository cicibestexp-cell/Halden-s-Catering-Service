-- ============================================================
-- SMARTSERVE — Ultimate RLS Fix
-- ============================================================

-- First, drop the broken policies from final_lockdown.sql that 
-- illegally attempted to query auth.users directly.
DROP POLICY IF EXISTS "customers_view_own" ON public.reservations;
DROP POLICY IF EXISTS "admins_view_all" ON public.reservations;
DROP POLICY IF EXISTS "customers_insert_own" ON public.reservations;

-- Now, apply the correct comprehensive lockdown script we wrote
-- yesterday, which safely uses auth.jwt() to read the user role!
\ir day8_rls_lockdown.sql
