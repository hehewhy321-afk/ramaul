import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Events = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [registerEvent, setRegisterEvent] = useState<any>(null);
  const [regForm, setRegForm] = useState({ name: '', phone: '', tole: '' });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').eq('is_active', true).order('event_date', { ascending: true });
      return data || [];
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!registerEvent) throw new Error('No event selected');
      const { error } = await supabase.from('event_registrations' as any).insert({
        event_id: registerEvent.id,
        name: regForm.name,
        phone: regForm.phone,
        tole: regForm.tole || null,
      });
      if (error) throw error;
      // Increment registration count
      await supabase.from('events').update({
        registration_count: (registerEvent.registration_count || 0) + 1
      }).eq('id', registerEvent.id);
    },
    onSuccess: () => {
      toast.success('Registration successful!');
      setRegisterEvent(null);
      setRegForm({ name: '', phone: '', tole: '' });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!ref.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('.event-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <Layout>
      <SEOHead title="Events" description="Upcoming events and community gatherings in Ramaul Village." path="/events" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('events.title')}</h1>
          <p className="text-muted-foreground mb-10">{t('events.subtitle')}</p>
          {events.length === 0 && !isLoading && <p className="text-muted-foreground">{t('events.noEvents')}</p>}
          <div className="space-y-4">
            {events.map(event => {
              const d = new Date(event.event_date);
              const ev = event as any;
              return (
                <Card key={event.id} className="event-item border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    {/* Event Image or Date Block */}
                    {event.image_url ? (
                      <div className="flex-shrink-0 w-full md:w-48 h-40 md:h-auto relative">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white rounded-lg px-2.5 py-1 text-xs font-semibold">
                          {format(d, 'MMM dd, yyyy')}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-full md:w-48 h-40 md:h-auto bg-accent/10 flex flex-col items-center justify-center text-accent">
                        <span className="text-sm font-medium">{format(d, 'MMM')}</span>
                        <span className="text-3xl font-bold leading-none">{format(d, 'dd')}</span>
                        <span className="text-xs">{format(d, 'yyyy')}</span>
                      </div>
                    )}
                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{event.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">{isNe && event.title_ne ? event.title_ne : event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{isNe && event.description_ne ? event.description_ne : event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{format(d, 'MMM dd, yyyy · hh:mm a')}</span>
                        {event.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>}
                        {event.max_attendees && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />{event.registration_count || 0}/{event.max_attendees}
                          </span>
                        )}
                        {!event.max_attendees && event.registration_count != null && event.registration_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />{event.registration_count} registered
                          </span>
                        )}
                        {ev.contact_person && (
                          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{ev.contact_person}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <Button variant="default" size="sm" onClick={() => setRegisterEvent(event)}>
                        {t('events.register')}
                      </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={!!registerEvent} onOpenChange={() => setRegisterEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
          </DialogHeader>
          {registerEvent && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Registering for: <strong>{registerEvent.title}</strong>
              </p>
              <div><Label>Name *</Label><Input value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" /></div>
              <div><Label>Phone *</Label><Input value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} placeholder="Your phone number" /></div>
              <div><Label>Tole (Area)</Label><Input value={regForm.tole} onChange={e => setRegForm(p => ({ ...p, tole: e.target.value }))} placeholder="e.g. Purab Tola" /></div>
              <Button
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending || !regForm.name || !regForm.phone}
                className="w-full"
              >
                {registerMutation.isPending ? 'Registering...' : 'Submit Registration'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;
