CREATE TABLE IF NOT EXISTS public.saved_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    reservation_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.saved_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved reservations"
    ON public.saved_reservations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved reservations"
    ON public.saved_reservations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved reservations"
    ON public.saved_reservations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved reservations"
    ON public.saved_reservations FOR DELETE
    USING (auth.uid() = user_id);
