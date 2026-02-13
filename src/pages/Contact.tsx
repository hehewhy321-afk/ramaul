import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().max(20).optional(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  category: z.string().default('general'),
});

const Contact = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });

  // Fetch Formspree config from site_settings
  const { data: formspreeConfig } = useQuery({
    queryKey: ['formspree-config'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'formspree_config').maybeSingle();
      return (data?.value as { form_id?: string; enabled?: boolean } | null) || null;
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => { gsap.from('.contact-item', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }); }, ref);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) { toast.error(result.error.errors[0].message); return; }
    setLoading(true);

    // Save to Supabase
    const { error } = await supabase.from('support_requests').insert({
      name: form.name, email: form.email, phone: form.phone || null,
      subject: form.subject, message: form.message, category: form.category,
    });

    // Also submit to Formspree if configured
    if (formspreeConfig?.enabled && formspreeConfig?.form_id) {
      try {
        await fetch(`https://formspree.io/f/${formspreeConfig.form_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: form.name, email: form.email, phone: form.phone,
            subject: form.subject, message: form.message, category: form.category,
          }),
        });
      } catch {
        // Silently fail — DB submission is the primary
      }
    }

    setLoading(false);
    if (error) { toast.error(t('common.error')); return; }
    toast.success(t('contact.success'));
    setForm({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <Layout>
      <SEOHead title="Contact Us" description="Get in touch with Ramaul Village administration. Send inquiries, feedback, or requests." path="/contact" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('contact.title')}</h1>
          <p className="text-muted-foreground mb-10">{t('contact.subtitle')}</p>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="contact-item border-border/50">
                <CardHeader><CardTitle>{t('contact.send')}</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>{t('contact.name')}</Label><Input value={form.name} onChange={set('name')} required /></div>
                      <div className="space-y-2"><Label>{t('contact.email')}</Label><Input type="email" value={form.email} onChange={set('email')} required /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>{t('contact.phone')}</Label><Input value={form.phone} onChange={set('phone')} /></div>
                      <div className="space-y-2">
                        <Label>{t('news.category')}</Label>
                        <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="suggestion">Suggestion</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label>{t('contact.subject')}</Label><Input value={form.subject} onChange={set('subject')} required /></div>
                    <div className="space-y-2"><Label>{t('contact.message')}</Label><Textarea value={form.message} onChange={set('message')} rows={5} required /></div>
                    <Button type="submit" size="lg" disabled={loading}>{loading ? t('common.loading') : t('contact.send')}</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="contact-item border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-4">{t('footer.connect')}</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><p className="font-medium text-card-foreground">Address</p><p className="text-muted-foreground">Ramaul, Siraha Municipality-04, Province 2, Nepal</p></div></div>
                    <div className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><p className="font-medium text-card-foreground">Phone</p><p className="text-muted-foreground">+977-33-XXXXXX</p></div></div>
                    <div className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><p className="font-medium text-card-foreground">Email</p><p className="text-muted-foreground">info@ramaul.gov.np</p></div></div>
                    <div className="flex items-start gap-3"><Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /><div><p className="font-medium text-card-foreground">Office Hours</p><p className="text-muted-foreground">Sun - Fri: 10:00 AM - 5:00 PM</p></div></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
