-- ============================================================
-- SmartServe: Rename 'city' column to 'venue_location'
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

ALTER TABLE public.reservations RENAME COLUMN city TO venue_location;
