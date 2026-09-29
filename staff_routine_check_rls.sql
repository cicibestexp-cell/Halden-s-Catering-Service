-- ======================================================================================
-- SCRIPT: staff_routine_check_rls.sql
-- PURPOSE: Grant Staff Members access to perform Routine Equipment Checks
-- ======================================================================================

-- 1. Ensure `routine_check` table allows both Anon and Authenticated to INSERT/SELECT/UPDATE/DELETE.
-- The day8_rls_lockdown script might have restricted it, so we ensure standard access is restored.
ALTER TABLE public.routine_check ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "smartserve_routine_check_all" ON public.routine_check;
DROP POLICY IF EXISTS "routine_checks_admin_all" ON public.routine_check;

CREATE POLICY "smartserve_routine_check_all"
  ON public.routine_check FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- 2. Update `equipment_inventory` table to allow STAFF to UPDATE quantities.
-- The day8_rls_lockdown script locked equipment_inventory to Admins ONLY.
-- We must allow all authenticated users (Admins & Staff) to UPDATE it so they can report missing/broken items.
ALTER TABLE public.equipment_inventory ENABLE ROW LEVEL SECURITY;

-- If a restrictive policy exists, we drop it.
DROP POLICY IF EXISTS "equipment_inventory_admin_all" ON public.equipment_inventory;

-- Create a new policy that allows ALL authenticated users to UPDATE equipment inventory.
-- Note: We still keep SELECT open to everyone so the app can fetch inventory.
CREATE POLICY "equipment_inventory_select_all"
  ON public.equipment_inventory FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "equipment_inventory_update_auth"
  ON public.equipment_inventory FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- (Optional) If staff needs to insert/delete equipment (not just update quantities), we can allow that too:
-- CREATE POLICY "equipment_inventory_all_auth" ON public.equipment_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ======================================================================================
-- Run this in your Supabase SQL Editor.
-- ======================================================================================
