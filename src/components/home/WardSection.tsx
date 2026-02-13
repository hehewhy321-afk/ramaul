import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const WardSection = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: wardReps = [] } = useQuery({
    queryKey: ['ward-reps-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('ward_representatives').select('*').eq('is_active', true).order('created_at');
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  return (
    <section className="section-padding">
      <div className="container-village">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3">{t('ward.title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('ward.subtitle')}</p>
        </FadeIn>
        {wardReps.length === 0 && <p className="text-center text-muted-foreground">No ward representatives added yet.</p>}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
          {wardReps.map((rep) => (
            <StaggerItem key={rep.id}>
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6 text-center">
                  {rep.photo_url ? (
                    <img src={rep.photo_url} alt={rep.full_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-village-green-light mx-auto mb-4 flex items-center justify-center text-primary-foreground text-2xl font-bold font-heading">
                      {rep.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <h3 className="font-semibold text-card-foreground mb-1">{isNe && rep.full_name_ne ? rep.full_name_ne : rep.full_name}</h3>
                  <p className="text-sm text-accent font-medium mb-4">{isNe && rep.position_ne ? rep.position_ne : rep.position}</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {rep.phone && <div className="flex items-center justify-center gap-1.5"><Phone className="h-3 w-3" />{rep.phone}</div>}
                    {rep.email && <div className="flex items-center justify-center gap-1.5"><Mail className="h-3 w-3" />{rep.email}</div>}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default WardSection;
