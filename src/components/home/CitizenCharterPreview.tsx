import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const CitizenCharterPreview = () => {
  const { i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: items = [] } = useQuery({
    queryKey: ['charter-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('citizen_charter').select('*').eq('is_active', true).order('sort_order').limit(4);
      return data || [];
    },
  });

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-village">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3">{isNe ? 'नागरिक बडापत्र' : 'Citizen Charter'}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{isNe ? 'सरकारी सेवा प्रक्रियाहरूको गाइड' : 'Your guide to government service procedures & requirements'}</p>
        </FadeIn>
        {items.length === 0 && <p className="text-center text-muted-foreground">{isNe ? 'अहिलेसम्म कुनै सेवा थपिएको छैन।' : 'No services listed yet.'}</p>}
        <StaggerContainer key={items.length} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
          {items.map((item: any) => (
            <StaggerItem key={item.id}>
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground text-sm mb-1">{isNe && item.service_name_ne ? item.service_name_ne : item.service_name}</h3>
                  <Badge variant="outline" className="capitalize text-[10px] mb-3">{item.category}</Badge>
                  {item.processing_time && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />{isNe && item.processing_time_ne ? item.processing_time_ne : item.processing_time}
                    </div>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <FadeIn className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/citizen-charter" className="gap-2">{isNe ? 'सबै सेवाहरू हेर्नुहोस्' : 'View All Services'} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
};

export default CitizenCharterPreview;
