
-- Add parent_reply_id column for threaded replies
ALTER TABLE public.discussion_replies 
ADD COLUMN parent_reply_id uuid REFERENCES public.discussion_replies(id) ON DELETE CASCADE DEFAULT NULL;

-- Add index for faster thread lookups
CREATE INDEX idx_discussion_replies_parent ON public.discussion_replies(parent_reply_id);
