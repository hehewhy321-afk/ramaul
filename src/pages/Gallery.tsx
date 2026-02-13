import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Gallery = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const { data: galleryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery_photos').select('*').eq('is_approved', true).order('created_at', { ascending: false });
      return data || [];
    },
  });

  useEffect(() => {
    if (!ref.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.08 });
    }, ref);
    return () => ctx.revert();
  }, [isLoading, galleryItems]);

  const handleUpload = async () => {
    if (!file || !title.trim() || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file);
    if (uploadError) { toast.error('Upload failed'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path);
    await supabase.from('gallery_photos').insert({ title, image_url: publicUrl, uploaded_by: user.id, is_approved: false });
    toast.success('Photo submitted for approval!');
    setTitle(''); setFile(null); setOpen(false); setUploading(false);
    refetch();
  };

  return (
    <Layout>
      <SEOHead title="Gallery" description="Photo gallery showcasing life, culture, and events in Ramaul Village." path="/gallery" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">{t('gallery.title')}</h1>
              <p className="text-muted-foreground">{t('gallery.subtitle')}</p>
            </div>
            {user && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button><Upload className="h-4 w-4 mr-2" />{t('gallery.upload')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{t('gallery.upload')}</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Photo title" /></div>
                    <div><Label>Photo</Label><Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></div>
                    <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()} className="w-full">
                      {uploading ? t('common.loading') : t('gallery.upload')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {galleryItems.length === 0 && !isLoading && <p className="text-muted-foreground">{t('gallery.noPhotos')}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map(item => (
              <Card key={item.id} className="gallery-item overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-card-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
