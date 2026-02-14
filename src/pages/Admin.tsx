import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  LayoutDashboard, Newspaper, CalendarDays, Megaphone, Wallet, Users2,
  ImageIcon, FileText, LifeBuoy, Heart, UserCog, LogOut, Plus, Trash2, Pencil, ArrowLeft, Upload,
  MessageSquare, Lock, ChevronLeft, ChevronRight, Target, Settings2,
  TrendingUp, BarChart3, Bold, Italic, List, Heading, Eye, Phone, X,
  Store, BookOpen,
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { useAdminBadges } from '@/hooks/useAdminBadges';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

type Section = 'dashboard' | 'news' | 'events' | 'announcements' | 'budget' | 'ward' | 'gallery' | 'issues' | 'support' | 'donations' | 'campaigns' | 'users' | 'discussions' | 'content' | 'documents' | 'notices' | 'businesses' | 'charter';

const Admin = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const badges = useAdminBadges();

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  if (!user || !isAdmin) { navigate('/auth'); return null; }

  const sidebarItems: { key: Section; icon: any; label: string; badge?: number }[] = [
    { key: 'dashboard', icon: LayoutDashboard, label: t('nav.home') === 'Home' ? 'Dashboard' : 'ड्यासबोर्ड' },
    { key: 'news', icon: Newspaper, label: t('nav.news') },
    { key: 'events', icon: CalendarDays, label: t('nav.events') },
    { key: 'announcements', icon: Megaphone, label: t('nav.home') === 'Home' ? 'Announcements' : 'सूचनाहरू' },
    { key: 'budget', icon: Wallet, label: t('nav.budget') || 'Budget' },
    { key: 'ward', icon: Users2, label: t('ward.title') || 'Ward Reps' },
    { key: 'gallery', icon: ImageIcon, label: t('nav.gallery') },
    { key: 'issues', icon: LifeBuoy, label: t('nav.issues') || 'Issues', badge: badges.issues },
    { key: 'support', icon: FileText, label: t('nav.home') === 'Home' ? 'Inquiries' : 'सोधपुछ', badge: badges.support },
    { key: 'campaigns', icon: Target, label: t('nav.home') === 'Home' ? 'Campaigns' : 'अभियान' },
    { key: 'donations', icon: Heart, label: t('nav.donate') || 'Donations', badge: badges.donations },
    { key: 'discussions', icon: MessageSquare, label: t('nav.discussions') },
    { key: 'users', icon: UserCog, label: t('nav.home') === 'Home' ? 'Users' : 'प्रयोगकर्ता' },
    { key: 'documents', icon: FileText, label: 'Documents' },
    { key: 'notices', icon: Megaphone, label: 'Notices' },
    { key: 'businesses', icon: Store, label: 'Businesses' },
    { key: 'charter', icon: BookOpen, label: 'Citizen Charter' },
    { key: 'content', icon: Settings2, label: t('nav.home') === 'Home' ? 'Manage Content' : 'सामग्री व्यवस्थापन' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar with collapse */}
      <aside className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h2 className="font-heading font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Ramaul Village</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="shrink-0">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${section === item.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              {!sidebarCollapsed && item.badge && item.badge > 0 ? (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                  {item.badge}
                </span>
              ) : null}
              {sidebarCollapsed && item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-3.5 min-w-3.5 flex items-center justify-center px-1" />
              ) : null}
            </button>
          ))}
        </nav>
        <div className={`p-3 border-t border-border space-y-2 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          )}
          {sidebarCollapsed && <ThemeToggle />}
          <Button variant="ghost" size={sidebarCollapsed ? 'icon' : 'sm'} className={sidebarCollapsed ? '' : 'w-full justify-start'} onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />{!sidebarCollapsed && <span className="ml-2">Back to Site</span>}
          </Button>
          <Button variant="ghost" size={sidebarCollapsed ? 'icon' : 'sm'} className={`text-destructive ${sidebarCollapsed ? '' : 'w-full justify-start'}`} onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="h-4 w-4" />{!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex overflow-x-auto px-2 py-1 gap-1">
          {sidebarItems.slice(0, 8).map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium rounded-lg min-w-[56px] relative ${section === item.key ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label.slice(0, 6)}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
        {section === 'dashboard' && <DashboardSection />}
        {section === 'news' && <NewsAdminSection />}
        {section === 'events' && <EventsAdminSection />}
        {section === 'announcements' && <CrudSection table="announcements" title="Announcements" fields={['title', 'content', 'priority', 'category', 'is_active', 'expires_at']} />}
        {section === 'budget' && <BudgetSection />}
        {section === 'ward' && <WardSection />}
        {section === 'gallery' && <GallerySection />}
        {section === 'issues' && <IssuesSection />}
        {section === 'support' && <SupportSection />}
        {section === 'campaigns' && <CampaignsSection />}
        {section === 'donations' && <DonationsSection />}
        {section === 'users' && <UsersSection />}
        {section === 'discussions' && <DiscussionsAdminSection />}
        {section === 'documents' && <DocumentsAdminSection />}
        {section === 'notices' && <NoticesAdminSection />}
        {section === 'content' && <ManageContentSection />}
        {section === 'businesses' && <BusinessesAdminSection />}
        {section === 'charter' && <CharterAdminSection />}
      </main>
    </div>
  );
};

/* ===================== DASHBOARD WITH CHARTS ===================== */
const CHART_COLORS = ['hsl(152, 45%, 28%)', 'hsl(38, 85%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(220, 60%, 50%)', 'hsl(280, 50%, 50%)', 'hsl(180, 50%, 40%)'];

const DashboardSection = () => {
  const { t } = useTranslation();
  useRealtimeSubscription('community_issues', [['admin-stats']]);
  useRealtimeSubscription('donations', [['admin-stats']]);
  useRealtimeSubscription('support_requests', [['admin-stats']]);

  const counts = ['news', 'events', 'community_issues', 'donations', 'support_requests', 'gallery_photos'] as const;
  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const results: Record<string, number> = {};
      for (const table of counts) {
        const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
        results[table] = count || 0;
      }
      return results;
    },
  });

  // Fetch issues by status for pie chart
  const { data: issuesByStatus = [] } = useQuery({
    queryKey: ['admin-issues-chart'],
    queryFn: async () => {
      const { data } = await supabase.from('community_issues').select('status');
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((d: any) => { counts[d.status || 'open'] = (counts[d.status || 'open'] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });

  // Budget categories for bar chart
  const { data: budgetData = [] } = useQuery({
    queryKey: ['admin-budget-chart'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_categories').select('name, allocated_amount, spent_amount').order('allocated_amount', { ascending: false }).limit(6);
      return (data || []).map((d: any) => ({ name: d.name?.slice(0, 12), allocated: Number(d.allocated_amount), spent: Number(d.spent_amount) }));
    },
  });

  // Donations over time
  const { data: donationTrend = [] } = useQuery({
    queryKey: ['admin-donation-trend'],
    queryFn: async () => {
      const { data } = await supabase.from('donations').select('amount, created_at, status').order('created_at');
      if (!data) return [];
      const monthly: Record<string, number> = {};
      data.filter((d: any) => d.status === 'completed').forEach((d: any) => {
        const month = format(new Date(d.created_at), 'MMM yy');
        monthly[month] = (monthly[month] || 0) + Number(d.amount);
      });
      return Object.entries(monthly).map(([month, total]) => ({ month, total }));
    },
  });

  const cards = [
    { label: t('nav.news'), count: stats.news || 0, icon: Newspaper, trend: '+12%' },
    { label: t('nav.events'), count: stats.events || 0, icon: CalendarDays, trend: '+5%' },
    { label: t('nav.issues') || 'Issues', count: stats.community_issues || 0, icon: LifeBuoy, trend: '' },
    { label: t('nav.donate') || 'Donations', count: stats.donations || 0, icon: Heart, trend: '+18%' },
    { label: 'Support', count: stats.support_requests || 0, icon: FileText, trend: '' },
    { label: t('nav.gallery'), count: stats.gallery_photos || 0, icon: ImageIcon, trend: '' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map(c => (
          <Card key={c.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <c.icon className="h-5 w-5 text-primary" />
                {c.trend && <span className="text-xs text-primary flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{c.trend}</span>}
              </div>
              <p className="text-2xl font-bold">{c.count}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Budget Bar Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {budgetData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" fill="hsl(152, 45%, 28%)" name="Allocated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="hsl(38, 85%, 50%)" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">No budget data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Issues Pie Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><LifeBuoy className="h-4 w-4" /> Issues by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {issuesByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={issuesByStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    {issuesByStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-12 text-center">No issues yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donation Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Donation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {donationTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={donationTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="hsl(152, 45%, 28%)" strokeWidth={2} dot={{ r: 4 }} name="Amount (NPR)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm py-8 text-center">No completed donations yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/* ===================== NEWS ADMIN SECTION ===================== */
const NewsAdminSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', title_ne: '', summary: '', summary_ne: '', content: '', content_ne: '', category: 'general', is_published: false, image_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (contentRef.current) {
      setForm(p => ({ ...p, content: contentRef.current!.innerHTML }));
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let image_url = form.image_url || null;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `news-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('news').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('news').getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
      const payload: any = { ...form, image_url };
      delete payload.image_url_input;
      if (!editId) payload.author_id = user?.id;
      if (editId) {
        const { error } = await supabase.from('news').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert(payload);
        if (error) throw error;
      }
      setUploading(false);
    },
    onSuccess: () => {
      toast.success('Saved!');
      setOpen(false); setEditId(null); setImageFile(null);
      setForm({ title: '', title_ne: '', summary: '', summary_ne: '', content: '', content_ne: '', category: 'general', is_published: false, image_url: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
    onError: (e: Error) => { setUploading(false); toast.error(e.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('news').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-news'] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id); setImageFile(null);
    setForm({ title: item.title || '', title_ne: item.title_ne || '', summary: item.summary || '', summary_ne: item.summary_ne || '', content: item.content || '', content_ne: item.content_ne || '', category: item.category || 'general', is_published: item.is_published ?? false, image_url: item.image_url || '' });
    setOpen(true);
    setTimeout(() => { if (contentRef.current) contentRef.current.innerHTML = item.content || ''; }, 100);
  };

  const openNew = () => {
    setEditId(null); setImageFile(null);
    setForm({ title: '', title_ne: '', summary: '', summary_ne: '', content: '', content_ne: '', category: 'general', is_published: false, image_url: '' });
    setOpen(true);
    setTimeout(() => { if (contentRef.current) contentRef.current.innerHTML = ''; }, 100);
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : form.image_url || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">{t('news.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />{t('common.create')}</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? t('common.edit') : t('common.create')} News</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {/* Image */}
              <div>
                <Label>Image</Label>
                <div className="flex items-center gap-3 mt-1">
                  {previewUrl && <img src={previewUrl} alt="Preview" className="h-20 w-32 object-cover rounded border border-border" />}
                  <div className="space-y-2">
                    <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setForm(p => ({ ...p, image_url: '' })); } }} />
                    <Button type="button" variant="outline" size="sm" onClick={() => imgRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-1" />{imageFile ? 'Change' : 'Upload'}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Or paste URL:</p>
                <Input placeholder="https://..." value={imageFile ? '' : form.image_url} disabled={!!imageFile} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="mt-1" />
              </div>
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Title (Nepali)</Label><Input value={form.title_ne} onChange={e => setForm(p => ({ ...p, title_ne: e.target.value }))} /></div>
              <div><Label>Summary</Label><Textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={2} /></div>
              <div><Label>Summary (Nepali)</Label><Textarea value={form.summary_ne} onChange={e => setForm(p => ({ ...p, summary_ne: e.target.value }))} rows={2} /></div>
              {/* Rich Text Editor */}
              <div>
                <Label>Content (Rich Text) *</Label>
                <div className="flex gap-1 mb-1 mt-1">
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCmd('bold')}><Bold className="h-3 w-3" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCmd('italic')}><Italic className="h-3 w-3" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCmd('insertUnorderedList')}><List className="h-3 w-3" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => execCmd('formatBlock', 'h3')}><Heading className="h-3 w-3" /></Button>
                </div>
                <div
                  ref={contentRef}
                  contentEditable
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onInput={() => { if (contentRef.current) setForm(p => ({ ...p, content: contentRef.current!.innerHTML })); }}
                />
              </div>
              <div><Label>Content (Nepali)</Label><Textarea value={form.content_ne} onChange={e => setForm(p => ({ ...p, content_ne: e.target.value }))} rows={4} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label>Published</Label></div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || uploading || !form.title} className="w-full">
                {saveMutation.isPending || uploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.image_url ? <img src={item.image_url} className="h-8 w-12 object-cover rounded" /> : <span className="text-muted-foreground text-xs">None</span>}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant={item.is_published ? 'default' : 'secondary'}>{item.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(item.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== EVENTS ADMIN SECTION ===================== */
const EventsAdminSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', title_ne: '', description: '', description_ne: '', location: '', category: 'general', event_date: '', max_attendees: '', is_active: true, contact_person: '', image_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [regDialogEvent, setRegDialogEvent] = useState<any>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['event-registrations', regDialogEvent?.id],
    enabled: !!regDialogEvent,
    queryFn: async () => {
      const { data } = await supabase.from('event_registrations' as any).select('*').eq('event_id', regDialogEvent.id).order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url = form.image_url || null;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `event-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('news').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('news').getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
      const payload: any = {
        title: form.title, title_ne: form.title_ne || null, description: form.description || null, description_ne: form.description_ne || null,
        location: form.location || null, category: form.category, event_date: form.event_date, image_url,
        max_attendees: form.max_attendees ? Number(form.max_attendees) : null, is_active: form.is_active, contact_person: form.contact_person || null,
      };
      if (editId) {
        const { error } = await supabase.from('events').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        payload.created_by = user?.id;
        const { error } = await supabase.from('events').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Saved!'); setOpen(false); setEditId(null); setImageFile(null);
      setForm({ title: '', title_ne: '', description: '', description_ne: '', location: '', category: 'general', event_date: '', max_attendees: '', is_active: true, contact_person: '', image_url: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('events').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-events'] }); },
  });

  const deleteRegMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('event_registrations' as any).delete().eq('id', id); },
    onSuccess: () => { toast.success('Removed!'); queryClient.invalidateQueries({ queryKey: ['event-registrations', regDialogEvent?.id] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id); setImageFile(null);
    setForm({
      title: item.title || '', title_ne: item.title_ne || '', description: item.description || '', description_ne: item.description_ne || '',
      location: item.location || '', category: item.category || 'general', event_date: item.event_date?.slice(0, 16) || '',
      max_attendees: item.max_attendees?.toString() || '', is_active: item.is_active ?? true, contact_person: item.contact_person || '', image_url: item.image_url || '',
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null); setImageFile(null);
    setForm({ title: '', title_ne: '', description: '', description_ne: '', location: '', category: 'general', event_date: '', max_attendees: '', is_active: true, contact_person: '', image_url: '' });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">{t('events.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />{t('common.create')}</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? t('common.edit') : t('common.create')} Event</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {/* Image */}
              <div>
                <Label>Image</Label>
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setForm(p => ({ ...p, image_url: '' })); } }} />
                <Button type="button" variant="outline" size="sm" onClick={() => imgRef.current?.click()} className="mt-1">
                  <Upload className="h-4 w-4 mr-1" />{imageFile ? 'Change' : 'Upload'}
                </Button>
                <Input placeholder="Or paste URL" value={imageFile ? '' : form.image_url} disabled={!!imageFile} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="mt-1" />
              </div>
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Title (Nepali)</Label><Input value={form.title_ne} onChange={e => setForm(p => ({ ...p, title_ne: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
              <div><Label>Description (Nepali)</Label><Textarea value={form.description_ne} onChange={e => setForm(p => ({ ...p, description_ne: e.target.value }))} rows={3} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              <div><Label>Event Date *</Label><Input type="datetime-local" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} /></div>
              <div><Label>Max Attendees (optional)</Label><Input type="number" placeholder="Leave empty for unlimited" value={form.max_attendees} onChange={e => setForm(p => ({ ...p, max_attendees: e.target.value }))} /></div>
              <div><Label>Contact Person</Label><Input placeholder="Name & phone" value={form.contact_person} onChange={e => setForm(p => ({ ...p, contact_person: e.target.value }))} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title || !form.event_date} className="w-full">
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Registrations</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.event_date ? format(new Date(item.event_date), 'MMM dd, yyyy') : '-'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setRegDialogEvent(item)}>
                    <Eye className="h-3 w-3 mr-1" />{item.registration_count || 0} registered
                  </Button>
                </TableCell>
                <TableCell><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Registrations Dialog */}
      <Dialog open={!!regDialogEvent} onOpenChange={() => setRegDialogEvent(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Registrations: {regDialogEvent?.title}</DialogTitle></DialogHeader>
          {(registrations as any[]).length === 0 ? (
            <p className="text-muted-foreground text-sm">No registrations yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Tole</TableHead><TableHead>Date</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {(registrations as any[]).map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>{r.tole || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(r.created_at), 'MMM dd')}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => deleteRegMutation.mutate(r.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ===================== MANAGE CONTENT (FRIENDLY FORMS) ===================== */
const ManageContentSection = () => {
  const queryClient = useQueryClient();
  const [activeKey, setActiveKey] = useState('about_content');

  const contentKeys = [
    { key: 'about_content', label: 'About Page' },
    { key: 'hero_content', label: 'Hero Section' },
    { key: 'stats_data', label: 'Village Stats' },
    { key: 'formspree_config', label: 'Formspree (Email)' },
  ];

  const { data: content, isLoading } = useQuery({
    queryKey: ['site-settings', activeKey],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('key', activeKey).maybeSingle();
      return data;
    },
  });

  const currentVal = (content?.value || {}) as Record<string, any>;

  const [formData, setFormData] = useState<Record<string, any>>({});

  // Reset form when content changes
  useEffect(() => {
    if (content?.value) {
      setFormData(content.value as Record<string, any>);
    } else {
      setFormData({});
    }
  }, [content]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let dataToSave = { ...formData };
      // Handle hero image upload if needed
      if (activeKey === 'hero_content' && heroImgFile) {
        const uploadedUrl = await handleHeroImageUpload();
        dataToSave = { ...dataToSave, image_url: uploadedUrl };
      }
      if (content?.id) {
        const { error } = await supabase.from('site_settings').update({ value: dataToSave as any }).eq('id', content.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert({ key: activeKey, value: dataToSave as any });
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success('Content saved!'); setHeroImgFile(null); queryClient.invalidateQueries({ queryKey: ['site-settings', activeKey] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateField = (key: string, val: any) => setFormData(p => ({ ...p, [key]: val }));

  const renderAboutForm = () => (
    <div className="space-y-4">
      <div><Label>Page Title</Label><Input value={formData.title || ''} onChange={e => updateField('title', e.target.value)} placeholder="About Our Village" /></div>
      <div><Label>Subtitle</Label><Input value={formData.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} placeholder="Discover the heritage..." /></div>
      <div><Label>Banner Image URL</Label><Input value={formData.image_url || ''} onChange={e => updateField('image_url', e.target.value)} placeholder="https://... (leave empty for default)" /></div>
      <div><Label>Description</Label><Textarea value={formData.description || ''} onChange={e => updateField('description', e.target.value)} rows={5} placeholder="Main description paragraph..." /></div>
      <div>
        <Label>Stats</Label>
        <p className="text-xs text-muted-foreground mb-2">Edit the stats shown on the About page</p>
        {(formData.stats || []).map((s: any, i: number) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <Input className="w-24" placeholder="Icon" value={s.icon || ''} onChange={e => { const st = [...(formData.stats || [])]; st[i] = { ...st[i], icon: e.target.value }; updateField('stats', st); }} />
            <Input className="w-28" placeholder="Value" value={s.value || ''} onChange={e => { const st = [...(formData.stats || [])]; st[i] = { ...st[i], value: e.target.value }; updateField('stats', st); }} />
            <Input className="flex-1" placeholder="Label" value={s.label || ''} onChange={e => { const st = [...(formData.stats || [])]; st[i] = { ...st[i], label: e.target.value }; updateField('stats', st); }} />
            <Button variant="ghost" size="icon" onClick={() => { const st = (formData.stats || []).filter((_: any, j: number) => j !== i); updateField('stats', st); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => updateField('stats', [...(formData.stats || []), { icon: 'Users', value: '', label: '' }])}><Plus className="h-3 w-3 mr-1" />Add Stat</Button>
      </div>
    </div>
  );

  const heroImgRef = useRef<HTMLInputElement>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);

  const handleHeroImageUpload = async () => {
    if (!heroImgFile) return formData.image_url || null;
    setHeroUploading(true);
    const ext = heroImgFile.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('news').upload(fileName, heroImgFile);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('news').getPublicUrl(fileName);
    setHeroUploading(false);
    return urlData.publicUrl;
  };

  const renderHeroForm = () => {
    const heroPreview = heroImgFile ? URL.createObjectURL(heroImgFile) : formData.image_url || null;
    return (
      <div className="space-y-4">
        <div><Label>Title</Label><Input value={formData.title || ''} onChange={e => updateField('title', e.target.value)} placeholder="Welcome to Ramaul" /></div>
        <div><Label>Subtitle</Label><Textarea value={formData.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} rows={3} placeholder="A vibrant community..." /></div>
        <div><Label>CTA Button Text</Label><Input value={formData.cta_text || ''} onChange={e => updateField('cta_text', e.target.value)} placeholder="Explore" /></div>
        <div>
          <Label>Hero Background Image</Label>
          <div className="flex items-center gap-3 mt-1">
            {heroPreview && <img src={heroPreview} alt="Preview" className="h-20 w-32 object-cover rounded border border-border" />}
            <div className="space-y-2">
              <input ref={heroImgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setHeroImgFile(f); updateField('image_url', ''); } }} />
              <Button type="button" variant="outline" size="sm" onClick={() => heroImgRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" />{heroImgFile ? 'Change' : 'Upload'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Or paste URL:</p>
          <Input value={heroImgFile ? '' : (formData.image_url || '')} disabled={!!heroImgFile} onChange={e => updateField('image_url', e.target.value)} placeholder="https://... (leave empty for default)" className="mt-1" />
        </div>
      </div>
    );
  };

  const renderStatsForm = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Edit the stats displayed on the homepage</p>
      {(formData.items || []).map((s: any, i: number) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <Input className="w-24" placeholder="Icon" value={s.icon || ''} onChange={e => { const st = [...(formData.items || [])]; st[i] = { ...st[i], icon: e.target.value }; updateField('items', st); }} />
          <Input className="w-28" placeholder="Value" value={s.value || ''} onChange={e => { const st = [...(formData.items || [])]; st[i] = { ...st[i], value: e.target.value }; updateField('items', st); }} />
          <Input className="flex-1" placeholder="Label" value={s.label || ''} onChange={e => { const st = [...(formData.items || [])]; st[i] = { ...st[i], label: e.target.value }; updateField('items', st); }} />
          <Button variant="ghost" size="icon" onClick={() => { const st = (formData.items || []).filter((_: any, j: number) => j !== i); updateField('items', st); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => updateField('items', [...(formData.items || []), { icon: 'Users', value: '', label: '' }])}><Plus className="h-3 w-3 mr-1" />Add Stat</Button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Manage Content</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {contentKeys.map(ck => (
          <Button key={ck.key} variant={activeKey === ck.key ? 'default' : 'outline'} size="sm" onClick={() => setActiveKey(ck.key)}>
            {ck.label}
          </Button>
        ))}
      </div>
      <Card className="border-border/50">
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <>
              {activeKey === 'about_content' && renderAboutForm()}
              {activeKey === 'hero_content' && renderHeroForm()}
              {activeKey === 'stats_data' && renderStatsForm()}
              {activeKey === 'formspree_config' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Configure Formspree to receive contact form submissions as email notifications. Get your Form ID from <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">formspree.io</a></p>
                  <div><Label>Formspree Form ID</Label><Input value={formData.form_id || ''} onChange={e => updateField('form_id', e.target.value)} placeholder="e.g. mwvnlyew" /></div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.enabled ?? false} onCheckedChange={v => updateField('enabled', v)} />
                    <Label>Enable Formspree email notifications</Label>
                  </div>
                  {formData.form_id && formData.enabled && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                      <p className="text-primary font-medium">✓ Formspree is active</p>
                      <p className="text-muted-foreground">Contact form submissions will also be sent to your Formspree-linked email.</p>
                    </div>
                  )}
                </div>
              )}
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="mt-6">
                {saveMutation.isPending ? 'Saving...' : 'Save Content'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/* ===================== GENERIC CRUD ===================== */
const CrudSection = ({ table, title, fields }: { table: string; title: string; fields: string[] }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const { data: items = [] } = useQuery({
    queryKey: [`admin-${table}`],
    queryFn: async () => {
      const { data } = await supabase.from(table as any).select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      if (!editId) {
        if (table === 'news') payload.author_id = user?.id;
        if (['events', 'announcements'].includes(table)) payload.created_by = user?.id;
      }
      if (editId) {
        const { error } = await supabase.from(table as any).update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success(t('common.save') + '!'); setOpen(false); setEditId(null); setForm({}); queryClient.invalidateQueries({ queryKey: [`admin-${table}`] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(t('common.delete') + '!'); queryClient.invalidateQueries({ queryKey: [`admin-${table}`] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id);
    const f: Record<string, any> = {};
    fields.forEach(key => { f[key] = item[key] ?? ''; });
    setForm(f);
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    const f: Record<string, any> = {};
    fields.forEach(key => { f[key] = ''; });
    setForm(f);
    setOpen(true);
  };

  const renderField = (key: string) => {
    if (key === 'is_published' || key === 'is_active') {
      return (
        <div key={key} className="flex items-center gap-2">
          <Switch checked={!!form[key]} onCheckedChange={v => setForm(p => ({ ...p, [key]: v }))} />
          <Label>{key.replace('_', ' ')}</Label>
        </div>
      );
    }
    if (key === 'priority') {
      return (
        <div key={key}><Label>Priority</Label>
          <Select value={form[key] || ''} onValueChange={v => setForm(p => ({ ...p, [key]: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    if (key === 'content' || key === 'description') {
      return <div key={key}><Label>{key}</Label><Textarea value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={4} /></div>;
    }
    if (key === 'event_date' || key === 'expires_at') {
      return <div key={key}><Label>{key.replace('_', ' ')}</Label><Input type="datetime-local" value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} /></div>;
    }
    if (key === 'max_attendees') {
      return <div key={key}><Label>Max Attendees</Label><Input type="number" value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value ? Number(e.target.value) : '' }))} /></div>;
    }
    return <div key={key}><Label>{key.replace('_', ' ')}</Label><Input value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} /></div>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">{title}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />{t('common.create')}</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? t('common.edit') : t('common.create')} {title}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {fields.map(renderField)}
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full">
                {saveMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  {item.is_published !== undefined && <Badge variant={item.is_published ? 'default' : 'secondary'}>{item.is_published ? 'Published' : 'Draft'}</Badge>}
                  {item.is_active !== undefined && <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(item.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== CAMPAIGNS SECTION ===================== */
const CampaignsSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', recipient_name: '', recipient_account: '', goal_amount: '', start_date: '', end_date: '', is_active: true,
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const { data } = await supabase.from('donation_campaigns').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let qr_image_url = editId ? campaigns.find((c: any) => c.id === editId)?.qr_image_url : null;

      if (qrFile) {
        const fileName = `campaign-qr-${Date.now()}.${qrFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('campaigns').upload(fileName, qrFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('campaigns').getPublicUrl(fileName);
        qr_image_url = urlData.publicUrl;
      }

      const payload: any = {
        title: form.title,
        description: form.description || null,
        recipient_name: form.recipient_name,
        recipient_account: form.recipient_account || null,
        goal_amount: form.goal_amount ? Number(form.goal_amount) : 0,
        start_date: form.start_date || new Date().toISOString(),
        end_date: form.end_date || null,
        is_active: form.is_active,
        qr_image_url,
      };

      if (editId) {
        const { error } = await supabase.from('donation_campaigns').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        payload.created_by = user?.id;
        const { error } = await supabase.from('donation_campaigns').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Campaign saved!');
      setOpen(false);
      setEditId(null);
      setQrFile(null);
      setForm({ title: '', description: '', recipient_name: '', recipient_account: '', goal_amount: '', start_date: '', end_date: '', is_active: true });
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('donation_campaigns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      recipient_name: item.recipient_name || '',
      recipient_account: item.recipient_account || '',
      goal_amount: item.goal_amount?.toString() || '',
      start_date: item.start_date ? item.start_date.slice(0, 16) : '',
      end_date: item.end_date ? item.end_date.slice(0, 16) : '',
      is_active: item.is_active ?? true,
    });
    setQrFile(null);
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm({ title: '', description: '', recipient_name: '', recipient_account: '', goal_amount: '', start_date: '', end_date: '', is_active: true });
    setQrFile(null);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Donation Campaigns</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Campaign</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Create'} Campaign</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
              <div><Label>Recipient Name *</Label><Input value={form.recipient_name} onChange={e => setForm(p => ({ ...p, recipient_name: e.target.value }))} /></div>
              <div><Label>Recipient Account/ID</Label><Input value={form.recipient_account} onChange={e => setForm(p => ({ ...p, recipient_account: e.target.value }))} /></div>
              <div><Label>Goal Amount (NPR)</Label><Input type="number" value={form.goal_amount} onChange={e => setForm(p => ({ ...p, goal_amount: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date</Label><Input type="datetime-local" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="datetime-local" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} /></div>
              </div>
              <div>
                <Label>QR Code Image</Label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setQrFile(e.target.files?.[0] || null)} />
                <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />{qrFile ? qrFile.name : 'Upload QR Image'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
                <Label>Active</Label>
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title || !form.recipient_name} className="w-full">
                {saveMutation.isPending ? 'Saving...' : 'Save Campaign'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((c: any) => (
          <Card key={c.id} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-heading font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.recipient_name}</p>
                </div>
                <Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              {c.goal_amount > 0 && (
                <p className="text-sm">Goal: NPR {Number(c.goal_amount).toLocaleString()} | Collected: NPR {Number(c.collected_amount).toLocaleString()}</p>
              )}
              {c.qr_image_url && <img src={c.qr_image_url} alt="QR" className="h-16 w-16 mt-2 rounded border border-border" />}
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="h-3 w-3 mr-1" />Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="h-3 w-3 mr-1 text-destructive" />Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {campaigns.length === 0 && <p className="text-muted-foreground col-span-2">No campaigns yet.</p>}
      </div>
    </div>
  );
};

/* ===================== BUDGET SECTION (ADVANCED) ===================== */
const BudgetSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [catOpen, setCatOpen] = useState(false);
  const [spentOpen, setSpentOpen] = useState(false);
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ name: '', name_ne: '', allocated_amount: '', financial_year: '2082/83', description: '' });
  const [spentForm, setSpentForm] = useState({ category_id: '', amount: '', description: '', description_ne: '', transaction_date: new Date().toISOString().split('T')[0] });
  const [activeTab, setActiveTab] = useState<'categories' | 'transactions'>('categories');

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-budget'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_categories').select('*').order('allocated_amount', { ascending: false });
      return data || [];
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-budget-transactions'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_transactions').select('*, budget_categories(name, name_ne)').order('transaction_date', { ascending: false });
      return data || [];
    },
  });

  const totalAllocated = categories.reduce((s: number, c: any) => s + Number(c.allocated_amount), 0);
  const totalSpent = categories.reduce((s: number, c: any) => s + Number(c.spent_amount), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const spentPct = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : '0';

  const saveCatMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: catForm.name, name_ne: catForm.name_ne || null,
        allocated_amount: Number(catForm.allocated_amount),
        financial_year: catForm.financial_year, description: catForm.description || null,
      };
      if (editCatId) {
        const { error } = await supabase.from('budget_categories').update(payload).eq('id', editCatId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('budget_categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Category saved!'); setCatOpen(false); setEditCatId(null);
      setCatForm({ name: '', name_ne: '', allocated_amount: '', financial_year: '2082/83', description: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-budget'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveSpentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('budget_transactions').insert({
        category_id: spentForm.category_id, amount: Number(spentForm.amount),
        description: spentForm.description, description_ne: spentForm.description_ne || null,
        transaction_date: spentForm.transaction_date, created_by: user?.id || null,
      });
      if (error) throw error;
      // Update the spent_amount on the category
      const cat = categories.find((c: any) => c.id === spentForm.category_id);
      if (cat) {
        const newSpent = Number(cat.spent_amount) + Number(spentForm.amount);
        await supabase.from('budget_categories').update({ spent_amount: newSpent }).eq('id', spentForm.category_id);
      }
    },
    onSuccess: () => {
      toast.success('Spending recorded!'); setSpentOpen(false);
      setSpentForm({ category_id: '', amount: '', description: '', description_ne: '', transaction_date: new Date().toISOString().split('T')[0] });
      queryClient.invalidateQueries({ queryKey: ['admin-budget'] });
      queryClient.invalidateQueries({ queryKey: ['admin-budget-transactions'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteCatMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('budget_categories').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-budget'] }); },
  });

  const deleteTxMutation = useMutation({
    mutationFn: async (tx: any) => {
      await supabase.from('budget_transactions').delete().eq('id', tx.id);
      // Subtract from spent_amount
      const cat = categories.find((c: any) => c.id === tx.category_id);
      if (cat) {
        const newSpent = Math.max(0, Number(cat.spent_amount) - Number(tx.amount));
        await supabase.from('budget_categories').update({ spent_amount: newSpent }).eq('id', tx.category_id);
      }
    },
    onSuccess: () => {
      toast.success('Transaction removed!');
      queryClient.invalidateQueries({ queryKey: ['admin-budget'] });
      queryClient.invalidateQueries({ queryKey: ['admin-budget-transactions'] });
    },
  });

  const openEditCat = (c: any) => {
    setEditCatId(c.id);
    setCatForm({ name: c.name, name_ne: c.name_ne || '', allocated_amount: String(c.allocated_amount), financial_year: c.financial_year, description: c.description || '' });
    setCatOpen(true);
  };

  const openNewCat = () => {
    setEditCatId(null);
    setCatForm({ name: '', name_ne: '', allocated_amount: '', financial_year: '2082/83', description: '' });
    setCatOpen(true);
  };

  const fmtNPR = (v: number) => `NPR ${v.toLocaleString()}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Budget Management</h1>
          <p className="text-sm text-muted-foreground">Manage categories, allocations & spending</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogTrigger asChild><Button onClick={openNewCat}><Plus className="h-4 w-4 mr-2" />Add Category</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editCatId ? 'Edit' : 'Add'} Budget Category</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Category Name *</Label><Input value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Education, Infrastructure" /></div>
                <div><Label>Category Name (Nepali)</Label><Input value={catForm.name_ne} onChange={e => setCatForm(p => ({ ...p, name_ne: e.target.value }))} /></div>
                <div><Label>Allocated Amount (NPR) *</Label><Input type="number" value={catForm.allocated_amount} onChange={e => setCatForm(p => ({ ...p, allocated_amount: e.target.value }))} placeholder="e.g. 5000000" /></div>
                <div><Label>Financial Year</Label><Input value={catForm.financial_year} onChange={e => setCatForm(p => ({ ...p, financial_year: e.target.value }))} /></div>
                <div><Label>Description</Label><Textarea value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
                <Button onClick={() => saveCatMutation.mutate()} disabled={saveCatMutation.isPending || !catForm.name || !catForm.allocated_amount} className="w-full">
                  {saveCatMutation.isPending ? 'Saving...' : (editCatId ? 'Update Category' : 'Add Category')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={spentOpen} onOpenChange={setSpentOpen}>
            <DialogTrigger asChild><Button variant="secondary"><Wallet className="h-4 w-4 mr-2" />Record Spending</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Spending</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={spentForm.category_id} onValueChange={v => setSpentForm(p => ({ ...p, category_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} (Remaining: {fmtNPR(Number(c.allocated_amount) - Number(c.spent_amount))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (NPR) *</Label><Input type="number" value={spentForm.amount} onChange={e => setSpentForm(p => ({ ...p, amount: e.target.value }))} placeholder="Amount spent" /></div>
                <div><Label>Description *</Label><Input value={spentForm.description} onChange={e => setSpentForm(p => ({ ...p, description: e.target.value }))} placeholder="What was this spending for?" /></div>
                <div><Label>Description (Nepali)</Label><Input value={spentForm.description_ne} onChange={e => setSpentForm(p => ({ ...p, description_ne: e.target.value }))} /></div>
                <div><Label>Date</Label><Input type="date" value={spentForm.transaction_date} onChange={e => setSpentForm(p => ({ ...p, transaction_date: e.target.value }))} /></div>
                {spentForm.category_id && spentForm.amount && (() => {
                  const cat = categories.find((c: any) => c.id === spentForm.category_id);
                  if (!cat) return null;
                  const remaining = Number(cat.allocated_amount) - Number(cat.spent_amount);
                  const overBudget = Number(spentForm.amount) > remaining;
                  return (
                    <div className={`p-3 rounded-lg text-sm ${overBudget ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {overBudget ? '⚠️ Warning: This exceeds the remaining budget!' : `✓ Remaining after this: ${fmtNPR(remaining - Number(spentForm.amount))}`}
                    </div>
                  );
                })()}
                <Button onClick={() => saveSpentMutation.mutate()} disabled={saveSpentMutation.isPending || !spentForm.category_id || !spentForm.amount || !spentForm.description} className="w-full">
                  {saveSpentMutation.isPending ? 'Saving...' : 'Record Spending'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
            <p className="text-xl font-bold text-foreground">{fmtNPR(totalAllocated)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-bold text-primary">{fmtNPR(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-xl font-bold text-accent">{fmtNPR(totalRemaining)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Utilization</p>
            <p className="text-xl font-bold">{spentPct}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Number(spentPct))}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button variant={activeTab === 'categories' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('categories')}>Categories ({categories.length})</Button>
        <Button variant={activeTab === 'transactions' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('transactions')}>Transactions ({transactions.length})</Button>
      </div>

      {activeTab === 'categories' && (
        <Card className="border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c: any) => {
                const alloc = Number(c.allocated_amount);
                const spent = Number(c.spent_amount);
                const rem = alloc - spent;
                const pct = alloc > 0 ? ((spent / alloc) * 100).toFixed(1) : '0';
                const isOver = spent > alloc;
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{c.name}</span>
                        {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{fmtNPR(alloc)}</TableCell>
                    <TableCell>{fmtNPR(spent)}</TableCell>
                    <TableCell className={isOver ? 'text-destructive font-medium' : ''}>{fmtNPR(rem)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${isOver ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min(100, Number(pct))}%` }} />
                        </div>
                        <span className="text-xs">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{c.financial_year}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditCat(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteCatMutation.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'transactions' && (
        <Card className="border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No transactions recorded yet. Click "Record Spending" to add one.</TableCell></TableRow>
              )}
              {transactions.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm">{tx.transaction_date}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell><Badge variant="outline">{(tx.budget_categories as any)?.name || '—'}</Badge></TableCell>
                  <TableCell className="font-bold text-primary">{fmtNPR(Number(tx.amount))}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteTxMutation.mutate(tx)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

/* ===================== WARD SECTION ===================== */
const WardSection = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: '', position: '', phone: '', email: '', bio: '', ward_number: '', photo_url: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const { data: reps = [] } = useQuery({
    queryKey: ['admin-ward'],
    queryFn: async () => { const { data } = await supabase.from('ward_representatives').select('*').order('created_at'); return data || []; },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let photo_url = form.photo_url || null;

      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const fileName = `ward-rep-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, photoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }

      const payload = {
        full_name: form.full_name, position: form.position, phone: form.phone || null,
        email: form.email || null, bio: form.bio || null, ward_number: form.ward_number ? Number(form.ward_number) : null,
        photo_url,
      };
      if (editId) {
        const { error } = await supabase.from('ward_representatives').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ward_representatives').insert(payload);
        if (error) throw error;
      }
      setUploading(false);
    },
    onSuccess: () => { toast.success('Saved!'); setOpen(false); setEditId(null); setPhotoFile(null); setForm({ full_name: '', position: '', phone: '', email: '', bio: '', ward_number: '', photo_url: '' }); queryClient.invalidateQueries({ queryKey: ['admin-ward'] }); },
    onError: (e: Error) => { setUploading(false); toast.error(e.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('ward_representatives').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-ward'] }); },
  });

  const openEdit = (r: any) => {
    setEditId(r.id);
    setPhotoFile(null);
    setForm({
      full_name: r.full_name || '', position: r.position || '', phone: r.phone || '',
      email: r.email || '', bio: r.bio || '', ward_number: r.ward_number?.toString() || '', photo_url: r.photo_url || '',
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setPhotoFile(null);
    setForm({ full_name: '', position: '', phone: '', email: '', bio: '', ward_number: '', photo_url: '' });
    setOpen(true);
  };

  const previewUrl = photoFile ? URL.createObjectURL(photoFile) : form.photo_url || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Ward Representatives</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Representative</Button></DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Ward Representative</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {/* Photo upload or URL */}
              <div>
                <Label>Photo (optional)</Label>
                <div className="flex items-center gap-4 mt-1">
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-border" />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
                          setPhotoFile(file);
                          setForm(p => ({ ...p, photo_url: '' }));
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => photoRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-1" />{photoFile ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {(photoFile || form.photo_url) && (
                      <Button type="button" variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => { setPhotoFile(null); setForm(p => ({ ...p, photo_url: '' })); }}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Or paste an image URL:</p>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  value={photoFile ? '' : form.photo_url}
                  disabled={!!photoFile}
                  onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div><Label>Full Name</Label><Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
              <div><Label>Position</Label>
                <Select value={form.position} onValueChange={v => setForm(p => ({ ...p, position: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ward Chairperson">Ward Chairperson</SelectItem>
                    <SelectItem value="Vice Chairperson">Vice Chairperson</SelectItem>
                    <SelectItem value="Ward Member">Ward Member</SelectItem>
                    <SelectItem value="Dalit Member">Dalit Member</SelectItem>
                    <SelectItem value="Women Member">Women Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Ward Number</Label><Input type="number" value={form.ward_number} onChange={e => setForm(p => ({ ...p, ward_number: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              </div>
              <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} /></div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || uploading} className="w-full">
                {saveMutation.isPending || uploading ? 'Saving...' : (editId ? 'Update' : 'Save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Photo</TableHead><TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead>Ward</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {reps.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell>
                  {r.photo_url ? (
                    <img src={r.photo_url} alt={r.full_name} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {r.full_name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{r.full_name}</TableCell>
                <TableCell>{r.position}</TableCell>
                <TableCell>{r.ward_number || '-'}</TableCell>
                <TableCell>{r.phone || '-'}</TableCell>
                <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== GALLERY SECTION ===================== */
const GallerySection = () => {
  const queryClient = useQueryClient();
  const { data: photos = [] } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => { const { data } = await supabase.from('gallery_photos').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const toggleApprove = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      await supabase.from('gallery_photos').update({ is_approved: approved }).eq('id', id);
    },
    onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('gallery_photos').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p: any) => (
          <Card key={p.id} className="overflow-hidden border-border/50">
            <img src={p.image_url} alt={p.title} className="aspect-square object-cover w-full" />
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">{p.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={p.is_approved ? 'default' : 'secondary'}>{p.is_approved ? 'Approved' : 'Pending'}</Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleApprove.mutate({ id: p.id, approved: !p.is_approved })}>
                  {p.is_approved ? 'Unapprove' : 'Approve'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ===================== ISSUES SECTION ===================== */
const IssuesSection = () => {
  const queryClient = useQueryClient();
  useRealtimeSubscription('community_issues', [['admin-issues']]);

  const { data: issues = [] } = useQuery({
    queryKey: ['admin-issues'],
    queryFn: async () => { const { data } = await supabase.from('community_issues').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const update: any = { status };
      if (status === 'resolved') update.resolved_at = new Date().toISOString();
      await supabase.from('community_issues').update(update).eq('id', id);
    },
    onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-issues'] }); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Community Issues</h1>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {issues.map((issue: any) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{issue.title}</TableCell>
                <TableCell><Badge variant="outline">{issue.category}</Badge></TableCell>
                <TableCell><Badge variant="outline">{issue.priority}</Badge></TableCell>
                <TableCell>
                  <Select value={issue.status} onValueChange={v => updateStatus.mutate({ id: issue.id, status: v })}>
                    <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{format(new Date(issue.created_at), 'MMM dd')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== SUPPORT / INQUIRIES SECTION ===================== */
const SupportSection = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  useRealtimeSubscription('support_requests', [['admin-support']]);

  const { data: requests = [] } = useQuery({
    queryKey: ['admin-support'],
    queryFn: async () => { const { data } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const update: any = { status };
      if (status === 'resolved') update.resolved_at = new Date().toISOString();
      await supabase.from('support_requests').update(update).eq('id', id);
    },
    onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-support'] }); },
  });

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      await supabase.from('support_requests').update({ admin_notes: notes }).eq('id', id);
    },
    onSuccess: () => { toast.success('Notes saved!'); queryClient.invalidateQueries({ queryKey: ['admin-support'] }); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Inquiries (Contact Us)</h1>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {requests.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.email}</TableCell>
                <TableCell className="max-w-[180px] truncate">{r.subject}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.category}</Badge></TableCell>
                <TableCell>
                  <Select value={r.status} onValueChange={v => updateStatus.mutate({ id: r.id, status: v })}>
                    <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(r.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(r)}>
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No inquiries yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Inquiry Details</DialogTitle></DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="font-medium text-muted-foreground">Name</p><p>{selectedRequest.name}</p></div>
                <div><p className="font-medium text-muted-foreground">Email</p><p>{selectedRequest.email}</p></div>
                {selectedRequest.phone && <div><p className="font-medium text-muted-foreground">Phone</p><p>{selectedRequest.phone}</p></div>}
                <div><p className="font-medium text-muted-foreground">Category</p><Badge variant="outline" className="capitalize">{selectedRequest.category}</Badge></div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm mb-1">Subject</p>
                <p className="font-semibold">{selectedRequest.subject}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm mb-1">Message</p>
                <p className="text-sm bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">{selectedRequest.message}</p>
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  defaultValue={selectedRequest.admin_notes || ''}
                  rows={3}
                  placeholder="Add internal notes..."
                  onBlur={e => {
                    if (e.target.value !== (selectedRequest.admin_notes || '')) {
                      updateNotes.mutate({ id: selectedRequest.id, notes: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Received: {format(new Date(selectedRequest.created_at), 'MMM dd, yyyy HH:mm')}
                {selectedRequest.resolved_at && <> | Resolved: {format(new Date(selectedRequest.resolved_at), 'MMM dd, yyyy')}</>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ===================== DONATIONS SECTION ===================== */
const DonationsSection = () => {
  const queryClient = useQueryClient();
  useRealtimeSubscription('donations', [['admin-donations']]);

  const { data: donations = [] } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => { const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'completed' | 'failed' }) => {
      await supabase.from('donations').update({ status }).eq('id', id);
    },
    onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-donations'] }); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Donations</h1>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Donor</TableHead><TableHead>Amount</TableHead><TableHead>Purpose</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {donations.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell>{d.is_anonymous ? 'Anonymous' : d.donor_name || 'N/A'}</TableCell>
                <TableCell className="font-bold">NPR {Number(d.amount).toLocaleString()}</TableCell>
                <TableCell>{d.purpose}</TableCell>
                <TableCell>
                  <Select value={d.status} onValueChange={v => updateStatus.mutate({ id: d.id, status: v as 'pending' | 'completed' | 'failed' })}>
                    <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(d.created_at), 'MMM dd')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== USERS SECTION ===================== */
const UsersSection = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!profiles) return [];
      const results = [];
      for (const p of profiles) {
        const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', p.user_id).maybeSingle();
        results.push({ ...p, role: roleData?.role || 'user' });
      }
      return results;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'moderator' | 'user' }) => {
      const { data: existing } = await supabase.from('user_roles').select('id').eq('user_id', userId).maybeSingle();
      if (existing) {
        await supabase.from('user_roles').update({ role }).eq('id', existing.id);
      } else {
        await supabase.from('user_roles').insert([{ user_id: userId, role }]);
      }
    },
    onSuccess: () => { toast.success('Role updated!'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Users</h1>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.full_name || 'Unnamed'}</TableCell>
                <TableCell>
                  <Select value={u.role} onValueChange={v => updateRole.mutate({ userId: u.user_id, role: v as 'admin' | 'moderator' | 'user' })}>
                    <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(u.created_at), 'MMM dd, yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== DISCUSSIONS ADMIN ===================== */
const DiscussionsAdminSection = () => {
  const queryClient = useQueryClient();
  useRealtimeSubscription('discussions', [['admin-discussions']]);

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ['admin-discussions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('discussions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const closeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('discussions').update({ status: 'closed' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Discussion closed');
      queryClient.invalidateQueries({ queryKey: ['admin-discussions'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reopenMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('discussions').update({ status: 'open' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Discussion reopened');
      queryClient.invalidateQueries({ queryKey: ['admin-discussions'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCount = discussions.filter((d: any) => d.status === 'open').length;
  const closedCount = discussions.filter((d: any) => d.status === 'closed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Discussions</h1>
        <div className="flex gap-2">
          <Badge variant="default">{openCount} Open</Badge>
          <Badge variant="secondary">{closedCount} Closed</Badge>
        </div>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : discussions.length === 0 ? (
        <p className="text-muted-foreground">No discussions yet.</p>
      ) : (
        <Card className="border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discussions.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{d.title}</TableCell>
                  <TableCell className="text-sm">{d.author_name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{d.category}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={d.status === 'open' ? 'default' : 'destructive'} className="flex items-center gap-1 w-fit">
                      {d.status === 'closed' && <Lock className="h-3 w-3" />}
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(d.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    {d.status === 'open' ? (
                      <Button variant="outline" size="sm" onClick={() => closeMutation.mutate(d.id)} disabled={closeMutation.isPending}>
                        <Lock className="h-3 w-3 mr-1" /> Close
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => reopenMutation.mutate(d.id)} disabled={reopenMutation.isPending}>
                        Reopen
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

/* ===================== DOCUMENTS ADMIN SECTION ===================== */
const DOC_CATEGORIES = ['forms', 'certificates', 'guidelines', 'reports', 'templates', 'general'];

const DocumentsAdminSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', title_ne: '', description: '', category: 'general', file_url: '' });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: docs = [] } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let file_url = form.file_url || '';
      let file_type: string | null = null;
      let file_size: number | null = null;

      if (docFile) {
        const ext = docFile.name.split('.').pop() || '';
        const fileName = `doc-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, docFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
        file_url = urlData.publicUrl;
        file_type = ext.toUpperCase();
        file_size = docFile.size;
      }

      if (!file_url) throw new Error('Please upload a file or provide a URL');

      const payload: any = {
        title: form.title,
        title_ne: form.title_ne || null,
        description: form.description || null,
        category: form.category,
        file_url,
        file_type: file_type || form.file_url?.split('.').pop()?.toUpperCase() || null,
        file_size,
        uploaded_by: user?.id,
      };

      if (editId) {
        const { error } = await supabase.from('documents').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('documents').insert(payload);
        if (error) throw error;
      }
      setUploading(false);
    },
    onSuccess: () => {
      toast.success('Document saved!');
      setOpen(false); setEditId(null); setDocFile(null);
      setForm({ title: '', title_ne: '', description: '', category: 'general', file_url: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    },
    onError: (e: Error) => { setUploading(false); toast.error(e.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('documents').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-documents'] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id); setDocFile(null);
    setForm({ title: item.title || '', title_ne: item.title_ne || '', description: item.description || '', category: item.category || 'general', file_url: item.file_url || '' });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null); setDocFile(null);
    setForm({ title: '', title_ne: '', description: '', category: 'general', file_url: '' });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Documents</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Document</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Document</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Citizenship Application Form" /></div>
              <div><Label>Title (Nepali)</Label><Input value={form.title_ne} onChange={e => setForm(p => ({ ...p, title_ne: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Brief description of the document" /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOC_CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>File</Label>
                <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setDocFile(f); setForm(p => ({ ...p, file_url: '' })); } }} />
                <Button type="button" variant="outline" className="w-full mt-1" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />{docFile ? docFile.name : 'Upload File'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Or paste URL:</p>
                <Input placeholder="https://..." value={docFile ? '' : form.file_url} disabled={!!docFile} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} className="mt-1" />
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || uploading || !form.title} className="w-full">
                {saveMutation.isPending || uploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {docs.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.title}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{d.category}</Badge></TableCell>
                <TableCell className="text-xs uppercase text-muted-foreground">{d.file_type || '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(d.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== NOTICES ADMIN SECTION ===================== */
const NOTICE_CATEGORIES = ['general', 'meeting', 'election', 'tax', 'development', 'health', 'education', 'emergency'];

const NoticesAdminSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', title_ne: '', content: '', content_ne: '', category: 'general', published_date: new Date().toISOString().split('T')[0], is_published: true, image_url: '', file_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const { data: notices = [] } = useQuery({
    queryKey: ['admin-notices'],
    queryFn: async () => {
      const { data } = await supabase.from('notices').select('*').order('published_date', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let image_url = form.image_url || null;
      let file_url = form.file_url || null;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `notice-img-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('documents').upload(fileName, imageFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }

      if (pdfFile) {
        const ext = pdfFile.name.split('.').pop();
        const fileName = `notice-file-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('documents').upload(fileName, pdfFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
        file_url = urlData.publicUrl;
      }

      const payload: any = {
        title: form.title,
        title_ne: form.title_ne || null,
        content: form.content || null,
        content_ne: form.content_ne || null,
        category: form.category,
        published_date: form.published_date,
        is_published: form.is_published,
        image_url,
        file_url,
        created_by: user?.id,
      };

      if (editId) {
        const { error } = await supabase.from('notices').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notices').insert(payload);
        if (error) throw error;
      }
      setUploading(false);
    },
    onSuccess: () => {
      toast.success('Notice saved!');
      setOpen(false); setEditId(null); setImageFile(null); setPdfFile(null);
      setForm({ title: '', title_ne: '', content: '', content_ne: '', category: 'general', published_date: new Date().toISOString().split('T')[0], is_published: true, image_url: '', file_url: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
    },
    onError: (e: Error) => { setUploading(false); toast.error(e.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('notices').delete().eq('id', id); },
    onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-notices'] }); },
  });

  const openEdit = (item: any) => {
    setEditId(item.id); setImageFile(null); setPdfFile(null);
    setForm({
      title: item.title || '', title_ne: item.title_ne || '',
      content: item.content || '', content_ne: item.content_ne || '',
      category: item.category || 'general',
      published_date: item.published_date || new Date().toISOString().split('T')[0],
      is_published: item.is_published ?? true,
      image_url: item.image_url || '', file_url: item.file_url || '',
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null); setImageFile(null); setPdfFile(null);
    setForm({ title: '', title_ne: '', content: '', content_ne: '', category: 'general', published_date: new Date().toISOString().split('T')[0], is_published: true, image_url: '', file_url: '' });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Notices</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Notice</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Notice</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Notice title" /></div>
              <div><Label>Title (Nepali)</Label><Input value={form.title_ne} onChange={e => setForm(p => ({ ...p, title_ne: e.target.value }))} /></div>
              <div><Label>Content (Text)</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Notice content..." /></div>
              <div><Label>Content (Nepali)</Label><Textarea value={form.content_ne} onChange={e => setForm(p => ({ ...p, content_ne: e.target.value }))} rows={3} /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NOTICE_CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Published Date</Label><Input type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} />
                <Label>Published</Label>
              </div>
              <div>
                <Label>Image (optional)</Label>
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
                <Button type="button" variant="outline" className="w-full mt-1" onClick={() => imgRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />{imageFile ? imageFile.name : 'Upload Image'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Or paste image URL:</p>
                <Input placeholder="https://..." value={imageFile ? '' : form.image_url} disabled={!!imageFile} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>PDF / Document (optional)</Label>
                <input ref={pdfRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }} />
                <Button type="button" variant="outline" className="w-full mt-1" onClick={() => pdfRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />{pdfFile ? pdfFile.name : 'Upload File'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Or paste file URL:</p>
                <Input placeholder="https://..." value={pdfFile ? '' : form.file_url} disabled={!!pdfFile} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} className="mt-1" />
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || uploading || !form.title} className="w-full">
                {saveMutation.isPending || uploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {notices.map((n: any) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{n.category}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(n.published_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell><Badge variant={n.is_published ? 'default' : 'secondary'}>{n.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== BUSINESSES ADMIN ===================== */
const BusinessesAdminSection = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ business_name: '', business_name_ne: '', category: 'general', contact_person: '', contact_person_ne: '', phone: '', email: '', location: '', location_ne: '', description: '', description_ne: '', is_verified: false, is_active: true });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: async () => {
      const { data } = await supabase.from('local_businesses').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const resetForm = () => { setForm({ business_name: '', business_name_ne: '', category: 'general', contact_person: '', contact_person_ne: '', phone: '', email: '', location: '', location_ne: '', description: '', description_ne: '', is_verified: false, is_active: true }); setEditId(null); };

  const openEdit = (item: any) => {
    setForm({ business_name: item.business_name || '', business_name_ne: item.business_name_ne || '', category: item.category || 'general', contact_person: item.contact_person || '', contact_person_ne: item.contact_person_ne || '', phone: item.phone || '', email: item.email || '', location: item.location || '', location_ne: item.location_ne || '', description: item.description || '', description_ne: item.description_ne || '', is_verified: item.is_verified || false, is_active: item.is_active !== false });
    setEditId(item.id);
    setOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('local_businesses').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('local_businesses').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-businesses'] }); toast.success('Business saved!'); setOpen(false); resetForm(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('local_businesses').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-businesses'] }); toast.success('Deleted!'); },
  });

  const categories = ['electrician', 'plumber', 'tailor', 'farmer', 'grocery', 'pharmacy', 'mechanic', 'teacher', 'carpenter', 'other'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Business Directory</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Business</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Business</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Business Name *</Label><Input value={form.business_name} onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))} /></div>
                <div><Label>Name (नेपाली)</Label><Input value={form.business_name_ne} onChange={e => setForm(p => ({ ...p, business_name_ne: e.target.value }))} /></div>
              </div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Contact Person</Label><Input value={form.contact_person} onChange={e => setForm(p => ({ ...p, contact_person: e.target.value }))} /></div>
                <div><Label>Contact (नेपाली)</Label><Input value={form.contact_person_ne} onChange={e => setForm(p => ({ ...p, contact_person_ne: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                <div><Label>Location (नेपाली)</Label><Input value={form.location_ne} onChange={e => setForm(p => ({ ...p, location_ne: e.target.value }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div><Label>Description (नेपाली)</Label><Textarea value={form.description_ne} onChange={e => setForm(p => ({ ...p, description_ne: e.target.value }))} rows={2} /></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_verified} onCheckedChange={v => setForm(p => ({ ...p, is_verified: v }))} /><Label>Verified</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.business_name} className="w-full">{saveMutation.isPending ? 'Saving...' : 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Category</TableHead><TableHead>Contact</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.business_name}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{b.category}</Badge></TableCell>
                <TableCell className="text-sm">{b.contact_person}</TableCell>
                <TableCell className="text-sm">{b.phone}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {b.is_verified && <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>}
                    <Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ===================== CITIZEN CHARTER ADMIN ===================== */
const CharterAdminSection = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ service_name: '', service_name_ne: '', category: 'certificate', description: '', description_ne: '', required_documents: '', required_documents_ne: '', process_steps: '', process_steps_ne: '', processing_time: '', processing_time_ne: '', fee: '', fee_ne: '', official_link: '', is_active: true, sort_order: 0 });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-charter'],
    queryFn: async () => {
      const { data } = await supabase.from('citizen_charter').select('*').order('sort_order').order('service_name');
      return data || [];
    },
  });

  const resetForm = () => { setForm({ service_name: '', service_name_ne: '', category: 'certificate', description: '', description_ne: '', required_documents: '', required_documents_ne: '', process_steps: '', process_steps_ne: '', processing_time: '', processing_time_ne: '', fee: '', fee_ne: '', official_link: '', is_active: true, sort_order: 0 }); setEditId(null); };

  const openEdit = (item: any) => {
    setForm({ service_name: item.service_name || '', service_name_ne: item.service_name_ne || '', category: item.category || 'certificate', description: item.description || '', description_ne: item.description_ne || '', required_documents: item.required_documents || '', required_documents_ne: item.required_documents_ne || '', process_steps: item.process_steps || '', process_steps_ne: item.process_steps_ne || '', processing_time: item.processing_time || '', processing_time_ne: item.processing_time_ne || '', fee: item.fee || '', fee_ne: item.fee_ne || '', official_link: item.official_link || '', is_active: item.is_active !== false, sort_order: item.sort_order || 0 });
    setEditId(item.id);
    setOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('citizen_charter').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('citizen_charter').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-charter'] }); toast.success('Service saved!'); setOpen(false); resetForm(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('citizen_charter').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-charter'] }); toast.success('Deleted!'); },
  });

  const categories = ['certificate', 'registration', 'recommendation', 'permit', 'other'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Citizen Charter</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Service Name *</Label><Input value={form.service_name} onChange={e => setForm(p => ({ ...p, service_name: e.target.value }))} /></div>
                <div><Label>Name (नेपाली)</Label><Input value={form.service_name_ne} onChange={e => setForm(p => ({ ...p, service_name_ne: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div><Label>Description (नेपाली)</Label><Textarea value={form.description_ne} onChange={e => setForm(p => ({ ...p, description_ne: e.target.value }))} rows={2} /></div>
              <div><Label>Required Documents</Label><Textarea value={form.required_documents} onChange={e => setForm(p => ({ ...p, required_documents: e.target.value }))} rows={3} placeholder="List each document on a new line" /></div>
              <div><Label>Required Documents (नेपाली)</Label><Textarea value={form.required_documents_ne} onChange={e => setForm(p => ({ ...p, required_documents_ne: e.target.value }))} rows={3} /></div>
              <div><Label>Process Steps</Label><Textarea value={form.process_steps} onChange={e => setForm(p => ({ ...p, process_steps: e.target.value }))} rows={3} placeholder="Step-by-step process" /></div>
              <div><Label>Process Steps (नेपाली)</Label><Textarea value={form.process_steps_ne} onChange={e => setForm(p => ({ ...p, process_steps_ne: e.target.value }))} rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Processing Time</Label><Input value={form.processing_time} onChange={e => setForm(p => ({ ...p, processing_time: e.target.value }))} placeholder="e.g. 3-5 days" /></div>
                <div><Label>Time (नेपाली)</Label><Input value={form.processing_time_ne} onChange={e => setForm(p => ({ ...p, processing_time_ne: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Fee</Label><Input value={form.fee} onChange={e => setForm(p => ({ ...p, fee: e.target.value }))} placeholder="e.g. NPR 100" /></div>
                <div><Label>Fee (नेपाली)</Label><Input value={form.fee_ne} onChange={e => setForm(p => ({ ...p, fee_ne: e.target.value }))} /></div>
              </div>
              <div><Label>Official Link</Label><Input value={form.official_link} onChange={e => setForm(p => ({ ...p, official_link: e.target.value }))} placeholder="https://..." /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.service_name} className="w-full">{saveMutation.isPending ? 'Saving...' : 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>Category</TableHead><TableHead>Fee</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.service_name}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{item.category}</Badge></TableCell>
                <TableCell className="text-sm">{item.fee || '—'}</TableCell>
                <TableCell className="text-sm">{item.processing_time || '—'}</TableCell>
                <TableCell><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Admin;
