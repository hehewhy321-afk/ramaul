
-- =============================================
-- RAMAUL VILLAGE PORTAL - FULL DATABASE SCHEMA
-- =============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.announcement_priority AS ENUM ('normal', 'high', 'urgent');
CREATE TYPE public.donation_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. SECURITY DEFINER FUNCTION FOR ROLE CHECKS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. NEWS TABLE
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ne TEXT,
  summary TEXT,
  summary_ne TEXT,
  content TEXT NOT NULL,
  content_ne TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. EVENTS TABLE
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  description_ne TEXT,
  location TEXT,
  category TEXT DEFAULT 'general',
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_attendees INTEGER,
  registration_count INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. ANNOUNCEMENTS TABLE
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ne TEXT,
  content TEXT NOT NULL,
  content_ne TEXT,
  priority announcement_priority DEFAULT 'normal',
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. BUDGET CATEGORIES TABLE
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ne TEXT,
  allocated_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  financial_year TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_budget_categories_updated_at
  BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. BUDGET TRANSACTIONS TABLE
CREATE TABLE public.budget_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.budget_categories(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  description_ne TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;

-- 12. WARD REPRESENTATIVES TABLE
CREATE TABLE public.ward_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  full_name_ne TEXT,
  position TEXT NOT NULL,
  position_ne TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  bio TEXT,
  bio_ne TEXT,
  photo_url TEXT,
  ward_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  achievements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ward_representatives ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_ward_reps_updated_at
  BEFORE UPDATE ON public.ward_representatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. COMMUNITY ISSUES TABLE
CREATE TABLE public.community_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority issue_priority DEFAULT 'medium',
  status issue_status DEFAULT 'open',
  location TEXT,
  image_url TEXT,
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_issues ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.community_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. ISSUE COMMENTS TABLE
CREATE TABLE public.issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.community_issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

-- 15. ISSUE LIKES TABLE
CREATE TABLE public.issue_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.community_issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  UNIQUE(issue_id, user_id)
);
ALTER TABLE public.issue_likes ENABLE ROW LEVEL SECURITY;

-- 16. DONATIONS TABLE
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(15,2) NOT NULL,
  purpose TEXT,
  payment_method TEXT,
  payment_reference TEXT,
  qr_data TEXT,
  recipient_name TEXT,
  recipient_account TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  status donation_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 17. GALLERY PHOTOS TABLE
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- 18. DOCUMENTS TABLE
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  download_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 19. SUPPORT REQUESTS TABLE
CREATE TABLE public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority issue_priority DEFAULT 'medium',
  status support_status DEFAULT 'open',
  admin_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON public.support_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 20. SITE SETTINGS TABLE
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- USER ROLES
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- NEWS (public read, admin write)
CREATE POLICY "Published news visible to all"
  ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage news"
  ON public.news FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- EVENTS (public read, admin write)
CREATE POLICY "Active events visible to all"
  ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ANNOUNCEMENTS (public read, admin write)
CREATE POLICY "Active announcements visible to all"
  ON public.announcements FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Admins manage announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BUDGET CATEGORIES (public read, admin write)
CREATE POLICY "Budget categories visible to all"
  ON public.budget_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage budget categories"
  ON public.budget_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BUDGET TRANSACTIONS (public read, admin write)
CREATE POLICY "Budget transactions visible to all"
  ON public.budget_transactions FOR SELECT USING (true);
CREATE POLICY "Admins manage budget transactions"
  ON public.budget_transactions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- WARD REPRESENTATIVES (public read, admin write)
CREATE POLICY "Active ward reps visible to all"
  ON public.ward_representatives FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage ward reps"
  ON public.ward_representatives FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COMMUNITY ISSUES (public read, auth write own)
CREATE POLICY "Issues visible to all"
  ON public.community_issues FOR SELECT USING (true);
CREATE POLICY "Auth users can create issues"
  ON public.community_issues FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own issues"
  ON public.community_issues FOR UPDATE
  TO authenticated
  USING (auth.uid() = reported_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete issues"
  ON public.community_issues FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ISSUE COMMENTS
CREATE POLICY "Comments visible to all"
  ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment"
  ON public.issue_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments"
  ON public.issue_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ISSUE LIKES
CREATE POLICY "Likes visible to all"
  ON public.issue_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can like"
  ON public.issue_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike"
  ON public.issue_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- DONATIONS (public read, anyone can insert)
CREATE POLICY "Completed donations visible to all"
  ON public.donations FOR SELECT USING (true);
CREATE POLICY "Anyone can create donations"
  ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage donations"
  ON public.donations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete donations"
  ON public.donations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- GALLERY PHOTOS (approved visible, auth upload)
CREATE POLICY "Approved photos visible to all"
  ON public.gallery_photos FOR SELECT
  USING (is_approved = true);
CREATE POLICY "Auth users can upload photos"
  ON public.gallery_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins manage gallery"
  ON public.gallery_photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DOCUMENTS (public read, admin write)
CREATE POLICY "Documents visible to all"
  ON public.documents FOR SELECT USING (true);
CREATE POLICY "Admins manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SUPPORT REQUESTS (anyone can create, admin manage)
CREATE POLICY "Anyone can create support requests"
  ON public.support_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view support requests"
  ON public.support_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage support requests"
  ON public.support_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS (public read, admin write)
CREATE POLICY "Settings visible to all"
  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('issues', 'issues', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true);

-- Storage policies
CREATE POLICY "Public gallery access"
  ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Auth users upload to gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Public issues access"
  ON storage.objects FOR SELECT USING (bucket_id = 'issues');
CREATE POLICY "Auth users upload to issues"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'issues');

CREATE POLICY "Public documents access"
  ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Auth users upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public avatars access"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public news access"
  ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "Admins upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news');

-- ANONYMOUS DONOR FUNCTION
CREATE OR REPLACE FUNCTION public.get_public_donations()
RETURNS TABLE (
  id UUID,
  donor_name TEXT,
  amount DECIMAL,
  purpose TEXT,
  status donation_status,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    CASE WHEN d.is_anonymous THEN 'Anonymous' ELSE d.donor_name END,
    d.amount,
    d.purpose,
    d.status,
    d.created_at
  FROM public.donations d
  WHERE d.status = 'completed'
  ORDER BY d.created_at DESC
$$;
