import { FileText, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const NoticesPreview = () => {
  const { i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: notices = [] } = useQuery({
    queryKey: ['notices-preview'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false })
        .limit(4);
      return data || [];
    },
  });

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-village">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">{isNe ? 'नवीनतम सूचनाहरू' : 'Latest Notices'}</h2>
              <p className="text-muted-foreground max-w-lg">
                {isNe
                  ? 'गाउँपालिकाका हालका सूचना र परिपत्रहरू।'
                  : 'Recent official notices and circulars from the village administration.'}
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/notices">
                {isNe ? 'सबै हेर्नुहोस्' : 'View All'} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {notices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">{isNe ? 'अहिलेसम्म कुनै सूचना छैन।' : 'No notices posted yet.'}</p>
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {notices.map((notice: any) => (
              <StaggerItem key={notice.id}>
                <Card className="border-border/50 hover:shadow-md transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{notice.category || 'general'}</Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {format(new Date(notice.published_date), 'MMM dd')}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {isNe && notice.title_ne ? notice.title_ne : notice.title}
                    </h3>
                    {notice.content && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {isNe && notice.content_ne ? notice.content_ne : notice.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link to="/notices">{isNe ? 'सबै सूचना हेर्नुहोस्' : 'View All Notices'} <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NoticesPreview;
