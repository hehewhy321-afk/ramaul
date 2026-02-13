import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, ArrowRight, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const News = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const ref = useRef<HTMLDivElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await supabase.from('news').select('*').eq('is_published', true).order('created_at', { ascending: false });
      return data || [];
    },
  });

  useEffect(() => {
    if (!ref.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('.news-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <Layout>
      <SEOHead title="News" description="Latest news and updates from Ramaul Village, Siraha Municipality-04, Nepal." path="/news" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('news.title')}</h1>
          <p className="text-muted-foreground mb-10">{t('news.subtitle')}</p>
          {newsArticles.length === 0 && !isLoading && <p className="text-muted-foreground">{t('news.noNews')}</p>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map(article => (
              <Card
                key={article.id}
                className="news-item border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden"
                onClick={() => setSelectedArticle(article)}
              >
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"><span className="text-4xl">📰</span></div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{article.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{format(new Date(article.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {isNe && article.title_ne ? article.title_ne : article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {isNe && article.summary_ne ? article.summary_ne : article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.view_count} views</span>
                    <span className="text-primary flex items-center gap-1 group-hover:underline">{t('news.readMore')} <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Read More Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {selectedArticle && (isNe && selectedArticle.title_ne ? selectedArticle.title_ne : selectedArticle.title)}
            </DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div>
              {selectedArticle.image_url && (
                <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-56 object-cover rounded-lg mb-4" />
              )}
              <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{selectedArticle.category}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(selectedArticle.created_at), 'MMM dd, yyyy')}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{selectedArticle.view_count} views</span>
              </div>
              {selectedArticle.summary && (
                <p className="text-muted-foreground italic mb-4 border-l-2 border-primary/30 pl-3">
                  {isNe && selectedArticle.summary_ne ? selectedArticle.summary_ne : selectedArticle.summary}
                </p>
              )}
              <div
                className="prose prose-sm max-w-none text-foreground [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{
                  __html: isNe && selectedArticle.content_ne ? selectedArticle.content_ne : selectedArticle.content
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default News;
