import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const BusinessDirectoryPreview = () => {
  const { i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('local_businesses').select('*').eq('is_active', true).order('is_verified', { ascending: false }).limit(4);
      return data || [];
    },
  });

  return (
    <section className="section-padding">
      <div className="container-village">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3">{isNe ? 'स्थानीय व्यापार निर्देशिका' : 'Local Business Hub'}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{isNe ? 'हाम्रो गाउँका सेवा र पसलहरू खोज्नुहोस्' : 'Find local services, shops and skilled professionals'}</p>
        </FadeIn>
        {businesses.length === 0 && <p className="text-center text-muted-foreground">{isNe ? 'अहिलेसम्म कुनै व्यापार थपिएको छैन।' : 'No businesses listed yet.'}</p>}
        <StaggerContainer key={businesses.length} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
          {businesses.map((b: any) => (
            <StaggerItem key={b.id}>
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground text-sm truncate">{isNe && b.business_name_ne ? b.business_name_ne : b.business_name}</h3>
                      <Badge variant="outline" className="capitalize text-[10px]">{b.category}</Badge>
                    </div>
                    {b.is_verified && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {b.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{b.phone}</div>}
                    {b.location && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{isNe && b.location_ne ? b.location_ne : b.location}</div>}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <FadeIn className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/business-directory" className="gap-2">{isNe ? 'सबै व्यापारहरू हेर्नुहोस्' : 'View All Businesses'} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
};

export default BusinessDirectoryPreview;
