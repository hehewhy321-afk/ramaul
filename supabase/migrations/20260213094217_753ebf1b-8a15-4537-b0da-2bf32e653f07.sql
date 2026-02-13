
-- Create donation_campaigns table
CREATE TABLE public.donation_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ne TEXT,
  description TEXT,
  description_ne TEXT,
  qr_image_url TEXT,
  recipient_name TEXT NOT NULL,
  recipient_account TEXT,
  goal_amount NUMERIC DEFAULT 0,
  collected_amount NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active campaigns visible to all" ON public.donation_campaigns
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage campaigns" ON public.donation_campaigns
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add campaign_id to donations
ALTER TABLE public.donations ADD COLUMN campaign_id UUID REFERENCES public.donation_campaigns(id);

-- Update trigger for donation_campaigns
CREATE TRIGGER update_donation_campaigns_updated_at
BEFORE UPDATE ON public.donation_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Create storage bucket for campaign QR images
INSERT INTO storage.buckets (id, name, public) VALUES ('campaigns', 'campaigns', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Campaign images publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'campaigns');

CREATE POLICY "Admins upload campaign images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'campaigns' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete campaign images" ON storage.objects
FOR DELETE USING (bucket_id = 'campaigns' AND has_role(auth.uid(), 'admin'::app_role));
