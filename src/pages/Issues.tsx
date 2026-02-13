import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, ThumbsUp, MessageCircle, MapPin, Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { z } from 'zod';

const issueSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(10).max(2000),
  category: z.string(),
  priority: z.string(),
  location: z.string().max(200).optional(),
});

const statusColors: Record<string, string> = {
  open: 'bg-destructive/10 text-destructive',
  in_progress: 'bg-accent/10 text-accent',
  resolved: 'bg-primary/10 text-primary',
  closed: 'bg-muted text-muted-foreground',
};

const Issues = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium', location: '' });
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState('all');

  const { data: issues = [] } = useQuery({
    queryKey: ['issues', filter],
    queryFn: async () => {
      let q = supabase.from('community_issues').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') q = q.eq('status', filter as 'open' | 'in_progress' | 'resolved' | 'closed');
      const { data } = await q;
      return data || [];
    },
  });

  const createIssue = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Login required');
      const result = issueSchema.safeParse(form);
      if (!result.success) throw new Error(result.error.errors[0].message);

      let imageUrl = null;
      if (file) {
        const path = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('issues').upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from('issues').getPublicUrl(path);
          imageUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from('community_issues').insert({
        title: form.title, description: form.description, category: form.category,
        priority: form.priority as any, location: form.location || null,
        image_url: imageUrl, reported_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Issue reported!');
      setForm({ title: '', description: '', category: 'general', priority: 'medium', location: '' });
      setFile(null); setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const likeMutation = useMutation({
    mutationFn: async (issueId: string) => {
      if (!user) throw new Error('Login required');
      const { data: existing } = await supabase.from('issue_likes').select('id').eq('issue_id', issueId).eq('user_id', user.id).maybeSingle();
      if (existing) {
        await supabase.from('issue_likes').delete().eq('id', existing.id);
      } else {
        await supabase.from('issue_likes').insert({ issue_id: issueId, user_id: user.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  return (
    <Layout>
      <SEOHead title="Community Issues" description="Report and track community issues in Ramaul Village. Help improve your neighborhood." path="/issues" />
      <div className="pt-24 section-padding">
        <div className="container-village">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">{t('issues.title')}</h1>
              <p className="text-muted-foreground">{t('issues.subtitle')}</p>
            </div>
            {user && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button><AlertCircle className="h-4 w-4 mr-2" />{t('issues.report')}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{t('issues.report')}</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('news.category')}</Label>
                        <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="road">Road</SelectItem>
                            <SelectItem value="water">Water</SelectItem>
                            <SelectItem value="electricity">Electricity</SelectItem>
                            <SelectItem value="sanitation">Sanitation</SelectItem>
                            <SelectItem value="safety">Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t('issues.priority')}</Label>
                        <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Where is the issue?" /></div>
                    <div><Label>Photo (optional)</Label><Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></div>
                    <Button onClick={() => createIssue.mutate()} disabled={createIssue.isPending} className="w-full">
                      {createIssue.isPending ? t('common.loading') : t('common.submit')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
              <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
                {s === 'all' ? 'All' : t(`issues.${s === 'in_progress' ? 'inProgress' : s}`)}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {issues.map(issue => (
              <Card key={issue.id} className="border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {issue.image_url && (
                      <img src={issue.image_url} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={statusColors[issue.status || 'open']}>{issue.status}</Badge>
                        <Badge variant="outline">{issue.priority}</Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {issue.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{issue.location}</span>}
                        <span>{format(new Date(issue.created_at), 'MMM dd, yyyy')}</span>
                        <button onClick={() => user && likeMutation.mutate(issue.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <ThumbsUp className="h-3 w-3" />{issue.likes_count || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Issues;
