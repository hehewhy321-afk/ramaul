import { Bell, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AnnouncementBanner = () => {
  const { i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements-banner'],
    queryFn: async () => {
      const { data } = await supabase.from('announcements').select('*').eq('is_active', true).order('priority', { ascending: false }).limit(10);
      return data || [];
    },
  });

  if (announcements.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-primary-foreground/20">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-semibold whitespace-nowrap">{isNe ? 'सूचनाहरू' : 'Announcements'}</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...announcements, ...announcements].map((a, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
                {a.priority === 'urgent' && <AlertTriangle className="h-3.5 w-3.5 text-accent" />}
                {isNe && a.title_ne ? a.title_ne : a.title}
                <span className="text-primary-foreground/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
