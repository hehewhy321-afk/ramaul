import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, QrCode, Target, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number().min(1),
  purpose: z.string().trim().min(1).max(200),
  donor_name: z.string().max(100).optional(),
  donor_email: z.string().email().max(255).optional().or(z.literal('')),
  donor_phone: z.string().max(20).optional(),
});

const Donate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [form, setForm] = useState({ amount: '', purpose: '', donor_name: '', donor_email: '', donor_phone: '' });
  const [anonymous, setAnonymous] = useState(false);
  const [step, setStep] = useState<'select' | 'form' | 'qr' | 'done'>('select');

  const { data: campaigns = [] } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: async () => {
      const { data } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_public_donations');
      return data || [];
    },
  });

  const submitDonation = useMutation({
    mutationFn: async () => {
      const parsed = donationSchema.safeParse({ ...form, amount: Number(form.amount) });
      if (!parsed.success) throw new Error(parsed.error.errors[0].message);
      const { error } = await supabase.from('donations').insert({
        amount: Number(form.amount),
        purpose: form.purpose,
        donor_name: anonymous ? null : form.donor_name || null,
        donor_email: form.donor_email || null,
        donor_phone: form.donor_phone || null,
        is_anonymous: anonymous,
        campaign_id: selectedCampaign?.id,
        recipient_name: selectedCampaign?.recipient_name,
        recipient_account: selectedCampaign?.recipient_account,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t('donate.submitted'));
      setStep('done');
      queryClient.invalidateQueries({ queryKey: ['public-donations'] });
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const selectCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setForm(f => ({ ...f, purpose: campaign.title }));
    setStep('form');
  };

  const proceedToQR = () => {
    const parsed = donationSchema.safeParse({ ...form, amount: Number(form.amount) });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setStep('qr');
  };

  const activeCampaigns = campaigns.filter((c: any) => {
    if (!c.is_active) return false;
    if (c.end_date && new Date(c.end_date) < new Date()) return false;
    return true;
  });

  return (
    <Layout>
      <SEOHead title="Donate" description="Support Ramaul Village development through donations and community fundraising campaigns." path="/donate" />
      <div className="pt-24 section-padding">
        <div className="container-village">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('donate.title')}</h1>
          <p className="text-muted-foreground mb-10">{t('donate.subtitle')}</p>

          {activeCampaigns.length === 0 ? (
            <Card className="border-border/50 text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-heading font-bold mb-2">{t('donate.noCampaigns')}</h2>
                <p className="text-muted-foreground">{t('donate.noCampaignsDesc')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {/* Step 1: Select Campaign */}
                {step === 'select' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold font-heading">{t('donate.selectCampaign')}</h2>
                    {activeCampaigns.map((c: any) => {
                      const progress = c.goal_amount > 0 ? Math.min(100, (Number(c.collected_amount) / Number(c.goal_amount)) * 100) : 0;
                      return (
                        <Card
                          key={c.id}
                          className="border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => selectCampaign(c)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-heading font-bold text-lg">{c.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                              </div>
                              <Badge variant="default">Active</Badge>
                            </div>
                            {c.goal_amount > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Target className="h-3 w-3" /> {t('donate.goal')}: NPR {Number(c.goal_amount).toLocaleString()}
                                  </span>
                                  <span className="font-medium text-primary">{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  NPR {Number(c.collected_amount).toLocaleString()} {t('donate.raised')}
                                </p>
                              </div>
                            )}
                            {c.end_date && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {t('donate.endsOn')}: {format(new Date(c.end_date), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Fill Form */}
                {step === 'form' && selectedCampaign && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-destructive" />
                        {selectedCampaign.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>{t('donate.amount')}</Label>
                        <Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="1000" />
                      </div>
                      <div>
                        <Label>{t('donate.purpose')}</Label>
                        <Input value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} />
                      </div>
                      {!anonymous && (
                        <>
                          <div>
                            <Label>{t('donate.donorName')}</Label>
                            <Input value={form.donor_name} onChange={e => setForm(p => ({ ...p, donor_name: e.target.value }))} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>{t('contact.email')}</Label>
                              <Input type="email" value={form.donor_email} onChange={e => setForm(p => ({ ...p, donor_email: e.target.value }))} />
                            </div>
                            <div>
                              <Label>{t('contact.phone')}</Label>
                              <Input value={form.donor_phone} onChange={e => setForm(p => ({ ...p, donor_phone: e.target.value }))} />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <Checkbox id="anon" checked={anonymous} onCheckedChange={(c) => setAnonymous(!!c)} />
                        <Label htmlFor="anon">{t('donate.anonymous')}</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep('select')} className="flex-1">{t('common.back')}</Button>
                        <Button onClick={proceedToQR} disabled={!form.amount || !form.purpose} className="flex-1">
                          {t('donate.showQR')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Show QR & Submit */}
                {step === 'qr' && selectedCampaign && (
                  <Card className="border-border/50">
                    <CardContent className="p-6 text-center">
                      <QrCode className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <p className="font-heading font-bold text-lg mb-1">{t('donate.scanQR')}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('donate.payAmount')}: NPR {Number(form.amount).toLocaleString()}
                      </p>
                      {selectedCampaign.qr_image_url ? (
                        <img
                          src={selectedCampaign.qr_image_url}
                          alt="Payment QR Code"
                          className="mx-auto rounded-lg shadow-md max-w-[280px] w-full"
                        />
                      ) : (
                        <div className="bg-muted rounded-lg p-8 mx-auto max-w-[280px]">
                          <QrCode className="h-32 w-32 mx-auto text-muted-foreground/50" />
                          <p className="text-xs text-muted-foreground mt-2">{t('donate.noQR')}</p>
                        </div>
                      )}
                      <div className="mt-4 text-sm text-muted-foreground space-y-1">
                        <p>{t('donate.recipient')}: {selectedCampaign.recipient_name}</p>
                        {selectedCampaign.recipient_account && <p>{t('donate.account')}: {selectedCampaign.recipient_account}</p>}
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" onClick={() => setStep('form')} className="flex-1">{t('common.back')}</Button>
                        <Button onClick={() => submitDonation.mutate()} disabled={submitDonation.isPending} className="flex-1">
                          {submitDonation.isPending ? t('common.loading') : t('donate.confirmPayment')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Done */}
                {step === 'done' && (
                  <Card className="border-border/50 text-center">
                    <CardContent className="p-8">
                      <Heart className="h-12 w-12 mx-auto text-primary mb-3" />
                      <h2 className="text-xl font-heading font-bold mb-2">{t('donate.thankYou')}</h2>
                      <p className="text-muted-foreground mb-4">{t('donate.thankYouDesc')}</p>
                      <Button onClick={() => { setStep('select'); setForm({ amount: '', purpose: '', donor_name: '', donor_email: '', donor_phone: '' }); setAnonymous(false); }}>
                        {t('donate.donateAgain')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Donation History */}
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">{t('donate.history')}</h2>
                <div className="space-y-3">
                  {donations.length === 0 && <p className="text-muted-foreground">{t('donate.noDonations')}</p>}
                  {donations.map((d: any) => (
                    <Card key={d.id} className="border-border/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-card-foreground">{d.donor_name}</p>
                          <p className="text-xs text-muted-foreground">{d.purpose} • {format(new Date(d.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                        <span className="font-bold text-primary">NPR {Number(d.amount).toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
