import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const NewsEventsPreview = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: latestNews = [] } = useQuery({
    queryKey: ['news-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('news').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3);
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['events-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').eq('is_active', true).gte('event_date', new Date().toISOString()).order('event_date', { ascending: true }).limit(3);
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  return (
    <section className="section-padding">
      <div className="container-village">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <FadeIn>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-heading text-foreground">{t('news.title')}</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/news">{t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerContainer className="space-y-4" stagger={0.1}>
              {latestNews.length === 0 && <p className="text-muted-foreground">{t('news.noNews')}</p>}
              {latestNews.map((news) => (
                <StaggerItem key={news.id}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{news.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{format(new Date(news.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1">{isNe && news.title_ne ? news.title_ne : news.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{isNe && news.summary_ne ? news.summary_ne : news.summary}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <div>
            <FadeIn>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-heading text-foreground">{t('events.title')}</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/events">{t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerContainer className="space-y-4" stagger={0.1} delay={0.2}>
              {upcomingEvents.length === 0 && <p className="text-muted-foreground">{t('events.noEvents')}</p>}
              {upcomingEvents.map((event) => {
                const d = new Date(event.event_date);
                return (
                  <StaggerItem key={event.id}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50">
                      <CardContent className="p-5 flex gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-accent/10 flex flex-col items-center justify-center text-accent">
                          <span className="text-xs font-medium">{format(d, 'MMM')}</span>
                          <span className="text-lg font-bold leading-none">{format(d, 'dd')}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground mb-1">{isNe && event.title_ne ? event.title_ne : event.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(d, 'hh:mm a')}</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsEventsPreview;
