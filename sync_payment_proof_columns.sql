-- ============================================================
-- SMARTSERVE: PAYMENT PROOF & EXECUTION SYNC COLUMNS
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
--
-- Non-destructive and idempotent: safe to run multiple times.
-- Uses "ADD COLUMN IF NOT EXISTS" to ensure no existing data is touched.
-- ============================================================

-- 1. Ensure proof and receipt columns exist on reservation_payments
ALTER TABLE public.reservation_payments
  -- Initial Fee
  ADD COLUMN IF NOT EXISTS initial_fee_amount       numeric DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS initial_fee_status       text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS initial_fee_method       text,
  ADD COLUMN IF NOT EXISTS initial_fee_paid_at      timestamptz,
  ADD COLUMN IF NOT EXISTS initial_fee_received     numeric,
  ADD COLUMN IF NOT EXISTS initial_fee_change       numeric,
  ADD COLUMN IF NOT EXISTS initial_fee_received_by  text,
  ADD COLUMN IF NOT EXISTS initial_fee_proof        text,
  ADD COLUMN IF NOT EXISTS initial_fee_proof_url    text,

  -- Downpayment
  ADD COLUMN IF NOT EXISTS downpayment_amount       numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downpayment_status       text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS downpayment_method       text,
  ADD COLUMN IF NOT EXISTS downpayment_received     numeric,
  ADD COLUMN IF NOT EXISTS downpayment_change       numeric,
  ADD COLUMN IF NOT EXISTS downpayment_paid_at      timestamptz,
  ADD COLUMN IF NOT EXISTS downpayment_received_by  text,
  ADD COLUMN IF NOT EXISTS downpayment_proof        text,
  ADD COLUMN IF NOT EXISTS downpayment_proof_url    text,

  -- Final Payment
  ADD COLUMN IF NOT EXISTS final_payment_amount     numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_payment_status     text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS final_method             text,
  ADD COLUMN IF NOT EXISTS final_received           numeric,
  ADD COLUMN IF NOT EXISTS final_change             numeric,
  ADD COLUMN IF NOT EXISTS final_paid_at            timestamptz,
  ADD COLUMN IF NOT EXISTS final_received_by        text,
  ADD COLUMN IF NOT EXISTS final_proof              text,
  ADD COLUMN IF NOT EXISTS final_proof_url          text,

  -- Additional / Execution Charges
  ADD COLUMN IF NOT EXISTS additional_charges_amount      numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS additional_charges_status      text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS additional_charges_breakdown   jsonb,
  ADD COLUMN IF NOT EXISTS additional_charges_received    numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS additional_charges_change      numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS additional_charges_method      text DEFAULT 'cash',
  ADD COLUMN IF NOT EXISTS additional_charges_paid_at     timestamptz,
  ADD COLUMN IF NOT EXISTS additional_charges_received_by text,
  ADD COLUMN IF NOT EXISTS additional_charges_ref_id      text,
  ADD COLUMN IF NOT EXISTS additional_charges_proof       text,
  ADD COLUMN IF NOT EXISTS additional_charges_proof_url   text;

-- 2. Ensure proof and receipt columns exist on reservations table
ALTER TABLE public.reservations
  -- Downpayment
  ADD COLUMN IF NOT EXISTS downpayment_status       text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS downpayment_method       text,
  ADD COLUMN IF NOT EXISTS downpayment_received     numeric,
  ADD COLUMN IF NOT EXISTS downpayment_change       numeric,
  ADD COLUMN IF NOT EXISTS downpayment_paid_at      timestamptz,
  ADD COLUMN IF NOT EXISTS downpayment_received_by  text,
  ADD COLUMN IF NOT EXISTS downpayment_ref_id       text,
  ADD COLUMN IF NOT EXISTS downpayment_proof        text,
  ADD COLUMN IF NOT EXISTS downpayment_proof_url    text,

  -- Final Payment
  ADD COLUMN IF NOT EXISTS final_payment_status     text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS final_method             text,
  ADD COLUMN IF NOT EXISTS final_received           numeric,
  ADD COLUMN IF NOT EXISTS final_change             numeric,
  ADD COLUMN IF NOT EXISTS final_paid_at            timestamptz,
  ADD COLUMN IF NOT EXISTS final_received_by        text,
  ADD COLUMN IF NOT EXISTS final_ref_id             text,
  ADD COLUMN IF NOT EXISTS final_proof              text,
  ADD COLUMN IF NOT EXISTS final_proof_url          text,
  ADD COLUMN IF NOT EXISTS settled                  boolean DEFAULT false,

  -- Initial Fee
  ADD COLUMN IF NOT EXISTS initial_fee_status       text,
  ADD COLUMN IF NOT EXISTS initial_fee_proof        text,
  ADD COLUMN IF NOT EXISTS initial_fee_proof_url    text,

  -- Execution Charges
  ADD COLUMN IF NOT EXISTS exec_charges_payment_status  text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS exec_charges_amount_paid     numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS exec_charges_change          numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS exec_charges_paid_at         timestamptz,
  ADD COLUMN IF NOT EXISTS exec_charges_method          text,
  ADD COLUMN IF NOT EXISTS exec_charges_received_by     text,
  ADD COLUMN IF NOT EXISTS exec_charges_proof           text,
  ADD COLUMN IF NOT EXISTS exec_charges_proof_url       text;

-- 3. Ensure permissions and Realtime remain active
GRANT ALL ON TABLE public.reservation_payments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reservations TO anon, authenticated, service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'reservation_payments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservation_payments;
  END IF;
END $$;
