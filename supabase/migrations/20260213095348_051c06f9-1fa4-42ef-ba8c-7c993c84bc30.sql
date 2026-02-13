
-- Create a trigger function to update campaign collected_amount when donation status changes to completed
CREATE OR REPLACE FUNCTION public.update_campaign_collected_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- When status changes to 'completed', add the amount
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET collected_amount = collected_amount + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;

  -- When status changes FROM 'completed' to something else, subtract the amount
  IF OLD.status = 'completed' AND NEW.status != 'completed' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET collected_amount = GREATEST(0, collected_amount - OLD.amount)
    WHERE id = NEW.campaign_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on donations table
CREATE TRIGGER update_campaign_amount_on_donation_status
AFTER UPDATE OF status ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_campaign_collected_amount();
