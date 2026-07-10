-- ============================================================
-- SMARTSERVE — SUPABASE SCHEMA
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. USERS (supplements Supabase Auth)
-- ─────────────────────────────────────────────
CREATE TABLE public.users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- matches auth.users.id or custom signup
  name        text,
  email       text UNIQUE,
  password    text,
  phone       text,
  role        text DEFAULT 'customer', -- 'customer' | 'staff' | 'admin'
  status      text DEFAULT 'Active',   -- 'Active' | 'Inactive'
  department  text,
  last_login  timestamptz,
  created_at  timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 2. RESERVATIONS (core table)
-- ─────────────────────────────────────────────
CREATE TABLE public.reservations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid REFERENCES public.users(id),
  client_name           text,
  client_email          text,
  client_phone          text,
  date                  date,
  timeframe             text,
  venue                 text,
  venue_coords          jsonb,           -- { lat, lng }
  pax                   integer,
  type                  text,            -- occasion type (Wedding, Birthday, etc.)
  theme                 text,
  description           text,
  status                text DEFAULT 'pending',   -- pending | confirmed | cancelled | completed
  ops_status            text DEFAULT 'planning',  -- planning | preparing | on-going | completed
  amount                numeric DEFAULT 0,
  payment_method        text,            -- 'Online' | 'Cash'
  payment_status        text DEFAULT 'pending',   -- pending | paid
  package_name          text,
  pricing_mode          text DEFAULT 'custom',    -- custom | perhead | tiered
  selected_tier         jsonb,
  vip                   jsonb,           -- { enabled, count, service }
  meeting_times         jsonb,           -- array of proposed meeting time slots
  staff                 text[],          -- array of staff user IDs
  -- Complex nested JSON stored as jsonb (no need for querying internals)
  seating_layout        jsonb,
  execution_plan        jsonb,
  food_tasted           jsonb,
  rundown_data          jsonb,
  design_selections     jsonb,
  customer_equipment    jsonb,
  execution_agenda      jsonb,
  -- Settlement
  settlement_amount     numeric DEFAULT 0,
  settled               boolean DEFAULT false,
  -- Execution Day
  execution_live_status text DEFAULT 'idle', -- idle | on-the-way | arriving | delayed | arrived
  delay_reason          text,
  -- Payment tracking
  downpayment_amount    numeric DEFAULT 0,
  downpayment_due       date,
  initial_fee           numeric DEFAULT 0,
  initial_fee_paid      boolean DEFAULT false,
  -- Timestamps
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 3. RESERVATION ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE public.reservation_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  item_id         text,    -- CAT item ID (e.g. 'f1', 'eq2')
  name            text,
  cat             text,    -- food | dessert | drink | equipment | decoration | entertainment
  price           numeric DEFAULT 0,
  dynamic_price   numeric DEFAULT 0, -- price calculated at time of booking (with pax)
  is_free         boolean DEFAULT false,
  is_individual   boolean DEFAULT false,
  batch_size      integer,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 4. MEETINGS
-- ─────────────────────────────────────────────
CREATE TABLE public.meetings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  topic           text,    -- 'Contract finalization' | 'Food tasting' | 'Design and decorations to be selected' | 'Additional reservation discussion' | 'Final program rundown'
  scheduled_at    timestamptz,
  room_id         text,    -- MTG-XXXXXXXX
  status          text DEFAULT 'pending',   -- pending | scheduled | completed
  proposed_times  jsonb,   -- array of time slot objects from customer
  notes           text,
  concluded_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 5. GUESTS
-- ─────────────────────────────────────────────
CREATE TABLE public.guests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  name            text,
  seat            text,
  table_name      text,
  is_vip          boolean DEFAULT false,
  attended        boolean DEFAULT false,
  qr_code         text,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 6. TIMELINE PHASES
-- ─────────────────────────────────────────────
CREATE TABLE public.timeline_phases (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  phase_number    integer,
  name            text,
  color           text,
  start_date      date,
  end_date        date,
  duration_days   integer DEFAULT 0,
  activities      jsonb,   -- array of { title, status, notes, date }
  overlap         integer DEFAULT 0,
  status          text DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 7. AD-HOC CHARGES (post-event settlement)
-- ─────────────────────────────────────────────
CREATE TABLE public.adhoc_charges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  item_name       text,
  quantity        integer DEFAULT 1,
  unit_price      numeric DEFAULT 0,
  total           numeric DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 8. EXECUTION ACTIVITIES LOG
-- ─────────────────────────────────────────────
CREATE TABLE public.execution_activities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  logged_by       uuid REFERENCES public.users(id),
  logger_name     text,
  logger_role     text,    -- 'admin' | 'staff'
  phase           text,
  description     text,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 9. EQUIPMENT INVENTORY
-- ─────────────────────────────────────────────
CREATE TABLE public.equipment_inventory (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  category        text,    -- Furniture | AV | Lighting | Power | Tableware | Tent | Misc
  type            text,    -- Chair | Table | Speaker | etc.
  total_qty       integer DEFAULT 0,
  available_qty   integer DEFAULT 0,
  status          text DEFAULT 'available', -- available | allocated | in-use | maintenance | disposed
  condition       text DEFAULT 'Good',      -- Good | Fair | Needs Repair
  last_inspected  date,
  qr_code         text,
  purchase_date   date,
  value           numeric DEFAULT 0,
  notes           text,
  is_batch        boolean DEFAULT false,
  batch_id        text,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 10. EQUIPMENT CYCLES (allocation per reservation)
-- ─────────────────────────────────────────────
CREATE TABLE public.equipment_cycles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  equipment_id    uuid REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  equipment_name  text,
  quantity        integer DEFAULT 1,
  status          text DEFAULT 'allocated', -- allocated | delivered | returned
  allocated_at    timestamptz DEFAULT now(),
  returned_at     timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 11. EQUIPMENT MAINTENANCE
-- ─────────────────────────────────────────────
CREATE TABLE public.equipment_maintenance (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id    uuid REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  equipment_name  text,
  issue           text,
  cost            numeric DEFAULT 0,
  date_in         date,
  date_out        date,
  status          text DEFAULT 'Needs Repair', -- Needs Repair | In Repair | Repaired
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 12. EQUIPMENT RESUPPLY
-- ─────────────────────────────────────────────
CREATE TABLE public.equipment_resupply (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id        uuid REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  equipment_name      text,
  supplier            text,
  quantity_requested  integer DEFAULT 0,
  expected_delivery   date,
  status              text DEFAULT 'pending', -- pending | ordered | received
  created_at          timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 13. ANNOUNCEMENTS (admin to staff)
-- ─────────────────────────────────────────────
CREATE TABLE public.announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text,
  body        text,
  created_by  uuid REFERENCES public.users(id),
  created_at  timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 14. ADMIN CHATS (support + meeting chats)
-- ─────────────────────────────────────────────
CREATE TABLE public.admin_chats (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  sender_id       uuid REFERENCES public.users(id),
  sender_name     text,
  sender_role     text,    -- 'admin' | 'customer' | 'staff'
  message         text,
  room_type       text DEFAULT 'support', -- 'support' | 'meeting' | 'exec-live' | 'exec-preflight'
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 15. DIRECTIVES (customer-facing flags/notifications)
-- ─────────────────────────────────────────────
CREATE TABLE public.directives (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES public.users(id) ON DELETE CASCADE,
  reservation_id  uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  type            text,    -- 'seating_layout_sent' | 'meeting_scheduled' | 'status_change' | 'payment_due' | etc.
  title           text,
  message         text,
  data            jsonb,
  is_read         boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 16. ROUTINE CHECK LOG (equipment inspections)
-- ─────────────────────────────────────────────
CREATE TABLE public.routine_checks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_by    uuid REFERENCES public.users(id),
  checker_name  text,
  notes         text,
  items_checked jsonb,   -- array of { equipment_id, equipment_name, condition, notes }
  completed_at  timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY — permissive to start
-- Tighten after launch when needed
-- ─────────────────────────────────────────────
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhoc_charges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_cycles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_resupply  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directives          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_checks      ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users full access (permissive — tighten later)
CREATE POLICY "allow_all_authenticated" ON public.users               FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.reservations        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.reservation_items   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.meetings            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.guests              FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.timeline_phases     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.adhoc_charges       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.execution_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.equipment_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.equipment_cycles    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.equipment_maintenance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.equipment_resupply  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.announcements       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.admin_chats         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.directives          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON public.routine_checks      FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anon read for public-facing data (public calendar)
CREATE POLICY "allow_anon_read_confirmed" ON public.reservations FOR SELECT TO anon USING (status = 'confirmed');

-- ─────────────────────────────────────────────
-- ENABLE REALTIME on tables that need live updates
-- ─────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.directives;

-- ─────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────
CREATE INDEX idx_reservations_user_id  ON public.reservations(user_id);
CREATE INDEX idx_reservations_status   ON public.reservations(status);
CREATE INDEX idx_reservations_date     ON public.reservations(date);
CREATE INDEX idx_res_items_res_id      ON public.reservation_items(reservation_id);
CREATE INDEX idx_meetings_res_id       ON public.meetings(reservation_id);
CREATE INDEX idx_guests_res_id         ON public.guests(reservation_id);
CREATE INDEX idx_adhoc_res_id          ON public.adhoc_charges(reservation_id);
CREATE INDEX idx_activities_res_id     ON public.execution_activities(reservation_id);
CREATE INDEX idx_chats_res_id          ON public.admin_chats(reservation_id);
CREATE INDEX idx_chats_room_type       ON public.admin_chats(reservation_id, room_type);
CREATE INDEX idx_directives_user_id    ON public.directives(user_id);
CREATE INDEX idx_eq_cycles_res_id      ON public.equipment_cycles(reservation_id);
CREATE INDEX idx_eq_cycles_eq_id       ON public.equipment_cycles(equipment_id);

-- ─────────────────────────────────────────────
-- 17. UNSTRUCTURED COLLECTIONS (Fallback for Firebase migration)
-- ─────────────────────────────────────────────
CREATE TABLE public.chat_messages ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.messages ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.designs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.FoodTaste ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.chats ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.equipment_assets ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.equipment_flags ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.deploymentLogs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.issueResolutions ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.purchaseOrders ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.shoppingLists ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.rentalDamagePayments ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );
CREATE TABLE public.maintenanceTasks ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, created_at timestamptz DEFAULT now() );

-- Enable RLS and permissive policies for unstructured tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.FoodTaste ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deploymentLogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issueResolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchaseOrders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoppingLists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentalDamagePayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenanceTasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON public.chat_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.designs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.FoodTaste FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.chats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.equipment_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.equipment_flags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.deploymentLogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.issueResolutions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.purchaseOrders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.shoppingLists FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.rentalDamagePayments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.maintenanceTasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
