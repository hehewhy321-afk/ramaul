
-- ============================================
-- LOCAL BUSINESSES / SKILLS DIRECTORY
-- ============================================
CREATE TABLE public.local_businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_name_ne TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  contact_person TEXT,
  contact_person_ne TEXT,
  phone TEXT,
  email TEXT,
  location TEXT,
  location_ne TEXT,
  description TEXT,
  description_ne TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.local_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active businesses visible to all" ON public.local_businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage businesses" ON public.local_businesses
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_local_businesses_updated_at
  BEFORE UPDATE ON public.local_businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- CITIZEN CHARTER
-- ============================================
CREATE TABLE public.citizen_charter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_name_ne TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  description_ne TEXT,
  required_documents TEXT,
  required_documents_ne TEXT,
  process_steps TEXT,
  process_steps_ne TEXT,
  processing_time TEXT,
  processing_time_ne TEXT,
  fee TEXT,
  fee_ne TEXT,
  official_link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.citizen_charter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active charter items visible to all" ON public.citizen_charter
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage charter" ON public.citizen_charter
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_citizen_charter_updated_at
  BEFORE UPDATE ON public.citizen_charter
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
