
-- Discussions table
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  author_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Discussion replies table
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE RESTRICT,
  author_name TEXT NOT NULL,
  avatar_url TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Discussions: Everyone can read
CREATE POLICY "Discussions visible to all"
ON public.discussions FOR SELECT
USING (true);

-- Discussions: Anyone can create (no auth needed)
CREATE POLICY "Anyone can create discussions"
ON public.discussions FOR INSERT
WITH CHECK (true);

-- Discussions: Only admin can update (to close)
CREATE POLICY "Admins can close discussions"
ON public.discussions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- NO DELETE POLICY - nobody can delete discussions

-- Replies: Everyone can read
CREATE POLICY "Replies visible to all"
ON public.discussion_replies FOR SELECT
USING (true);

-- Replies: Anyone can create
CREATE POLICY "Anyone can reply"
ON public.discussion_replies FOR INSERT
WITH CHECK (true);

-- NO DELETE POLICY - nobody can delete replies
-- NO UPDATE POLICY - nobody can edit replies

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_replies;

-- Updated_at trigger for discussions
CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
