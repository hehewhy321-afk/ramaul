
-- 1. Add contact_person to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_person text;

-- 2. Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  tole text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view registrations"
  ON public.event_registrations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete registrations"
  ON public.event_registrations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Storage RLS for news bucket
CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'news' AND has_role(auth.uid(), 'admin'::app_role)
  );
