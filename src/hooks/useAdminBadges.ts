import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export interface BadgeCounts {
  issues: number;
  donations: number;
  support: number;
}

export function useAdminBadges() {
  useRealtimeSubscription('community_issues', [['admin-badge-issues']]);
  useRealtimeSubscription('donations', [['admin-badge-donations']]);
  useRealtimeSubscription('support_requests', [['admin-badge-support']]);

  const { data: issueCount = 0 } = useQuery({
    queryKey: ['admin-badge-issues'],
    queryFn: async () => {
      const { count } = await supabase
        .from('community_issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');
      return count || 0;
    },
  });

  const { data: donationCount = 0 } = useQuery({
    queryKey: ['admin-badge-donations'],
    queryFn: async () => {
      const { count } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      return count || 0;
    },
  });

  const { data: supportCount = 0 } = useQuery({
    queryKey: ['admin-badge-support'],
    queryFn: async () => {
      const { count } = await supabase
        .from('support_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');
      return count || 0;
    },
  });

  return { issues: issueCount, donations: donationCount, support: supportCount };
}
