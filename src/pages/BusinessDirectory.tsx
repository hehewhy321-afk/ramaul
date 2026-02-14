import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Search, CheckCircle2, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const CATEGORIES = [
  'all', 'electrician', 'plumber', 'tailor', 'farmer', 'grocery', 'pharmacy', 'mechanic', 'teacher', 'carpenter', 'other',
];

const BusinessDirectory = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const { data: businesses = [] } = useQuery({
    queryKey: ['local-businesses'],
    queryFn: async () => {
      const { data } = await supabase.from('local_businesses').select('*').eq('is_active', true).order('is_verified', { ascending: false }).order('business_name');
      return data || [];
    },
  });

  const filtered = businesses.filter((b: any) => {
    const matchCat = selectedCat === 'all' || b.category === selectedCat;
    const matchSearch = !search || b.business_name.toLowerCase().includes(search.toLowerCase()) || b.contact_person?.toLowerCase().includes(search.toLowerCase()) || b.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <SEOHead title="Business Directory" description="Find local businesses, services and skilled professionals in Ramaul village." path="/business-directory" />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-village">
          <FadeIn className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
              {isNe ? 'स्थानीय व्यापार निर्देशिका' : 'Ramaul Business Hub'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isNe ? 'स्थानीय सेवाहरू र दक्ष पेशेवरहरू खोज्नुहोस्' : 'Find local services, shops and skilled professionals in our village'}
            </p>
          </FadeIn>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isNe ? 'खोज्नुहोस्...' : 'Search by name, person, location...'} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <Button key={cat} variant={selectedCat === cat ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCat(cat)} className="capitalize">
                {cat === 'all' ? (isNe ? 'सबै' : 'All') : cat}
              </Button>
            ))}
          </div>

          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">{isNe ? 'कुनै व्यापार फेला परेन।' : 'No businesses found.'}</p>}

          <StaggerContainer key={filtered.length} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.06}>
            {filtered.map((b: any) => (
              <StaggerItem key={b.id}>
                <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">{isNe && b.business_name_ne ? b.business_name_ne : b.business_name}</h3>
                          <Badge variant="outline" className="capitalize text-xs mt-0.5">{b.category}</Badge>
                        </div>
                      </div>
                      {b.is_verified && (
                        <Badge className="bg-primary/10 text-primary border-0 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {isNe ? 'प्रमाणित' : 'Verified'}
                        </Badge>
                      )}
                    </div>
                    {b.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{isNe && b.description_ne ? b.description_ne : b.description}</p>}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {b.contact_person && <div className="flex items-center gap-2"><span className="font-medium text-foreground">{isNe && b.contact_person_ne ? b.contact_person_ne : b.contact_person}</span></div>}
                      {b.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{b.phone}</div>}
                      {b.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{b.email}</div>}
                      {b.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{isNe && b.location_ne ? b.location_ne : b.location}</div>}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDirectory;
