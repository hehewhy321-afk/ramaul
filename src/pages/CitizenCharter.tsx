import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, FileText, Clock, IndianRupee, ExternalLink, ClipboardList, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const CHARTER_CATEGORIES = ['all', 'certificate', 'registration', 'recommendation', 'permit', 'other'];

const CitizenCharter = () => {
  const { i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const { data: items = [] } = useQuery({
    queryKey: ['citizen-charter'],
    queryFn: async () => {
      const { data } = await supabase.from('citizen_charter').select('*').eq('is_active', true).order('sort_order').order('service_name');
      return data || [];
    },
  });

  const filtered = items.filter((item: any) => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchSearch = !search || item.service_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <SEOHead title="Citizen Charter" description="Government service guide for Ramaul residents — required documents, processes, fees and official links." path="/citizen-charter" />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-village">
          <FadeIn className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
              {isNe ? 'नागरिक बडापत्र' : 'Citizen Charter'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isNe ? 'सरकारी सेवाहरूको लागि आवश्यक कागजात, प्रक्रिया र शुल्क जान्नुहोस्' : 'Your guide to government services — required documents, processes, fees and official links'}
            </p>
          </FadeIn>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isNe ? 'सेवा खोज्नुहोस्...' : 'Search services...'} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {CHARTER_CATEGORIES.map(cat => (
              <Button key={cat} variant={selectedCat === cat ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCat(cat)} className="capitalize">
                {cat === 'all' ? (isNe ? 'सबै' : 'All') : cat}
              </Button>
            ))}
          </div>

          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">{isNe ? 'कुनै सेवा फेला परेन।' : 'No services found.'}</p>}

          <StaggerContainer key={filtered.length} className="space-y-4" stagger={0.06}>
            {filtered.map((item: any) => (
              <StaggerItem key={item.id}>
                <Card className="border-border/50">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.id} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-card-foreground">{isNe && item.service_name_ne ? item.service_name_ne : item.service_name}</h3>
                            <Badge variant="outline" className="capitalize text-xs mt-1">{item.category}</Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {item.description && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" /> {isNe ? 'विवरण' : 'Description'}</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{isNe && item.description_ne ? item.description_ne : item.description}</p>
                            </div>
                          )}
                          {item.required_documents && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><ClipboardList className="h-4 w-4 text-primary" /> {isNe ? 'आवश्यक कागजातहरू' : 'Required Documents'}</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{isNe && item.required_documents_ne ? item.required_documents_ne : item.required_documents}</p>
                            </div>
                          )}
                          {item.process_steps && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary" /> {isNe ? 'प्रक्रिया' : 'Process Steps'}</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{isNe && item.process_steps_ne ? item.process_steps_ne : item.process_steps}</p>
                            </div>
                          )}
                          <div className="space-y-3">
                            {item.processing_time && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-accent" />
                                <span className="font-medium">{isNe ? 'समय:' : 'Time:'}</span>
                                <span className="text-muted-foreground">{isNe && item.processing_time_ne ? item.processing_time_ne : item.processing_time}</span>
                              </div>
                            )}
                            {item.fee && (
                              <div className="flex items-center gap-2 text-sm">
                                <IndianRupee className="h-4 w-4 text-accent" />
                                <span className="font-medium">{isNe ? 'शुल्क:' : 'Fee:'}</span>
                                <span className="text-muted-foreground">{isNe && item.fee_ne ? item.fee_ne : item.fee}</span>
                              </div>
                            )}
                            {item.official_link && (
                              <a href={item.official_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                                <ExternalLink className="h-3.5 w-3.5" /> {isNe ? 'आधिकारिक लिंक' : 'Official Link'}
                              </a>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenCharter;
