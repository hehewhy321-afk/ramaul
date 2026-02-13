-- ============================================================
-- Ramaul Village Portal — Full Database Setup
-- ============================================================
-- Run this SQL against a fresh Supabase/PostgreSQL database
-- to recreate the entire schema, RLS policies, functions,
-- triggers, storage buckets, and seed data.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────────────────────────

CREATE TYPE public.announcement_priority AS ENUM ('normal', 'high', 'urgent');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.donation_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- ─────────────────────────────────────────────────────────────
-- 2. TABLES
-- ─────────────────────────────────────────────────────────────

-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user'
);

-- Announcements
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  content TEXT NOT NULL,
  content_ne TEXT,
  category TEXT DEFAULT 'general',
  priority announcement_priority DEFAULT 'normal',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  description_ne TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  contact_person TEXT,
  max_attendees INTEGER,
  registration_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event Registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  tole TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budget Categories
CREATE TABLE public.budget_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ne TEXT,
  description TEXT,
  financial_year TEXT NOT NULL,
  allocated_amount NUMERIC NOT NULL DEFAULT 0,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budget Transactions
CREATE TABLE public.budget_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.budget_categories(id),
  description TEXT NOT NULL,
  description_ne TEXT,
  amount NUMERIC NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Community Issues
CREATE TABLE public.community_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority issue_priority DEFAULT 'medium',
  status issue_status DEFAULT 'open',
  location TEXT,
  image_url TEXT,
  reported_by UUID NOT NULL,
  assigned_to UUID,
  likes_count INTEGER DEFAULT 0,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Issue Comments
CREATE TABLE public.issue_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.community_issues(id),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Issue Likes
CREATE TABLE public.issue_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.community_issues(id),
  user_id UUID NOT NULL
);

-- Discussions
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  author_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discussion Replies (with threading via parent_reply_id)
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id),
  parent_reply_id UUID REFERENCES public.discussion_replies(id),
  author_name TEXT NOT NULL,
  avatar_url TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussion_replies_parent ON public.discussion_replies(parent_reply_id);

-- Documents
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  download_count INTEGER DEFAULT 0,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notices
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  content TEXT,
  content_ne TEXT,
  image_url TEXT,
  file_url TEXT,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT true,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Donation Campaigns
CREATE TABLE public.donation_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  description_ne TEXT,
  recipient_name TEXT NOT NULL,
  recipient_account TEXT,
  qr_image_url TEXT,
  goal_amount NUMERIC DEFAULT 0,
  collected_amount NUMERIC DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.donation_campaigns(id),
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount NUMERIC NOT NULL,
  purpose TEXT,
  status donation_status DEFAULT 'pending',
  is_anonymous BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_reference TEXT,
  recipient_name TEXT,
  recipient_account TEXT,
  qr_data TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery Photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ward Representatives
CREATE TABLE public.ward_representatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  full_name_ne TEXT,
  position TEXT NOT NULL,
  position_ne TEXT,
  ward_number INTEGER,
  phone TEXT,
  email TEXT,
  address TEXT,
  bio TEXT,
  bio_ne TEXT,
  photo_url TEXT,
  achievements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Support Requests (Inquiries)
CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority issue_priority DEFAULT 'medium',
  status support_status DEFAULT 'open',
  admin_notes TEXT,
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site Settings (key-value JSON store)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. FUNCTIONS
-- ─────────────────────────────────────────────────────────────

-- Check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile + role on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Get public (non-anonymous) completed donations
CREATE OR REPLACE FUNCTION public.get_public_donations()
RETURNS TABLE(id UUID, donor_name TEXT, amount NUMERIC, purpose TEXT, status donation_status, created_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    d.id,
    CASE WHEN d.is_anonymous THEN 'Anonymous' ELSE d.donor_name END,
    d.amount, d.purpose, d.status, d.created_at
  FROM public.donations d
  WHERE d.status = 'completed'
  ORDER BY d.created_at DESC
$$;

-- Auto-update campaign collected amount on donation status change
CREATE OR REPLACE FUNCTION public.update_campaign_collected_amount()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET collected_amount = collected_amount + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;
  IF OLD.status = 'completed' AND NEW.status != 'completed' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET collected_amount = GREATEST(0, collected_amount - OLD.amount)
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 4. TRIGGERS
-- ─────────────────────────────────────────────────────────────

-- New user trigger (attach to auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_issues_updated_at BEFORE UPDATE ON public.community_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donation_campaigns_updated_at BEFORE UPDATE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ward_representatives_updated_at BEFORE UPDATE ON public.ward_representatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_requests_updated_at BEFORE UPDATE ON public.support_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Campaign donation tracking
CREATE TRIGGER update_campaign_amount
  AFTER UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_collected_amount();

-- ─────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ward_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ── User Roles ──
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Announcements ──
CREATE POLICY "Active announcements visible to all" ON public.announcements FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── News ──
CREATE POLICY "Published news visible to all" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage news" ON public.news FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Events ──
CREATE POLICY "Active events visible to all" ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Event Registrations ──
CREATE POLICY "Anyone can register for events" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view registrations" ON public.event_registrations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete registrations" ON public.event_registrations FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ── Budget Categories ──
CREATE POLICY "Budget categories visible to all" ON public.budget_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage budget categories" ON public.budget_categories FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Budget Transactions ──
CREATE POLICY "Budget transactions visible to all" ON public.budget_transactions FOR SELECT USING (true);
CREATE POLICY "Admins manage budget transactions" ON public.budget_transactions FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Community Issues ──
CREATE POLICY "Issues visible to all" ON public.community_issues FOR SELECT USING (true);
CREATE POLICY "Auth users can create issues" ON public.community_issues FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own issues" ON public.community_issues FOR UPDATE USING (auth.uid() = reported_by OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete issues" ON public.community_issues FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ── Issue Comments ──
CREATE POLICY "Comments visible to all" ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment" ON public.issue_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.issue_comments FOR DELETE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- ── Issue Likes ──
CREATE POLICY "Likes visible to all" ON public.issue_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can like" ON public.issue_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.issue_likes FOR DELETE USING (auth.uid() = user_id);

-- ── Discussions ──
CREATE POLICY "Discussions visible to all" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Anyone can create discussions" ON public.discussions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can close discussions" ON public.discussions FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ── Discussion Replies ──
CREATE POLICY "Replies visible to all" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can reply" ON public.discussion_replies FOR INSERT WITH CHECK (true);

-- ── Documents ──
CREATE POLICY "Documents visible to all" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Notices ──
CREATE POLICY "Published notices visible to all" ON public.notices FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage notices" ON public.notices FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Donation Campaigns ──
CREATE POLICY "Active campaigns visible to all" ON public.donation_campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage campaigns" ON public.donation_campaigns FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Donations ──
CREATE POLICY "Completed donations visible to all" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Anyone can create donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage donations" ON public.donations FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete donations" ON public.donations FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ── Gallery Photos ──
CREATE POLICY "Approved photos visible to all" ON public.gallery_photos FOR SELECT USING (is_approved = true);
CREATE POLICY "Auth users can upload photos" ON public.gallery_photos FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins manage gallery" ON public.gallery_photos FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Ward Representatives ──
CREATE POLICY "Active ward reps visible to all" ON public.ward_representatives FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage ward reps" ON public.ward_representatives FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ── Support Requests (Inquiries) ──
CREATE POLICY "Anyone can create support requests" ON public.support_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view support requests" ON public.support_requests FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage support requests" ON public.support_requests FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ── Site Settings ──
CREATE POLICY "Settings visible to all" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ─────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('issues', 'issues', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('campaigns', 'campaigns', true);

-- Public read access for all buckets
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read issues" ON storage.objects FOR SELECT USING (bucket_id = 'issues');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read news" ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "Public read campaigns" ON storage.objects FOR SELECT USING (bucket_id = 'campaigns');

-- Auth users can upload to buckets
CREATE POLICY "Auth upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload issues" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'issues' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload news" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload campaigns" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'campaigns' AND auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- 7. REALTIME (optional — enable for tables that need live updates)
-- ─────────────────────────────────────────────────────────────

-- ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_replies;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.community_issues;

-- ─────────────────────────────────────────────────────────────
-- ✅ Setup complete!
-- ─────────────────────────────────────────────────────────────
