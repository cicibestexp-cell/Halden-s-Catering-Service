-- =====================================================
-- SmartServe EIM Full Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- =====================================================

-- 1. Add allocation tracking columns to equipment_inventory
ALTER TABLE public.equipment_inventory
  ADD COLUMN IF NOT EXISTS allocated_qty           INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS allocation_batch        TEXT,
  ADD COLUMN IF NOT EXISTS allocated_to            TEXT,
  ADD COLUMN IF NOT EXISTS allocated_reservation_id TEXT;

-- 2. Add qty-status columns to equipment_inventory
ALTER TABLE public.equipment_inventory
  ADD COLUMN IF NOT EXISTS good_qty        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS maintenance_qty INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS missing_qty     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS retired_qty     INTEGER DEFAULT 0;

-- 3. Backfill good_qty from available_qty/total_qty for existing rows
UPDATE public.equipment_inventory
  SET good_qty = COALESCE(available_qty, total_qty, 0)
  WHERE good_qty IS NULL OR good_qty = 0;

-- 4. Create routine_check audit table
CREATE TABLE IF NOT EXISTS public.routine_check (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id    TEXT        NOT NULL,
  asset_id        TEXT,
  equipment_name  TEXT,
  checked_by      TEXT        NOT NULL,
  checked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT        NOT NULL CHECK (status IN ('good', 'incident')),
  incidents       JSONB,
  notes           TEXT
);

-- 5. Index for fast per-equipment lookups
CREATE INDEX IF NOT EXISTS idx_routine_check_equipment   ON public.routine_check(equipment_id);
CREATE INDEX IF NOT EXISTS idx_routine_check_checked_at  ON public.routine_check(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_equip_alloc_batch         ON public.equipment_inventory(allocation_batch);

-- Done!
SELECT 'Migration complete' as status;
