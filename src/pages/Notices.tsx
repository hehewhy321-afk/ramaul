import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, Download, Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const CATEGORIES = ['all', 'general', 'meeting', 'election', 'tax', 'development', 'health', 'education', 'emergency'];

const Notices = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });
      return data || [];
    },
  });

  useEffect(() => {
    if (!ref.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('.notice-item', { y: 20, opacity: 0, duration: 0.4, stagger: 0.06 });
    }, ref);
    return () => ctx.revert();
  }, [isLoading, search, category]);

  const filtered = notices
    .filter((n: any) => {
      const matchesSearch =
        !search ||
        n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || n.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      if (sortOrder === 'newest') return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
      return new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
    });

  const isImageUrl = (url: string | null) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <Layout>
      <SEOHead title="Notices" description="Official notices and announcements from Ramaul Village administration." path="/notices" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading mb-2">{isNe ? 'सूचनाहरू' : 'Notices'}</h1>
            <p className="text-muted-foreground max-w-2xl">
              {isNe
                ? 'गाउँपालिकाका नवीनतम सूचना र जानकारीहरू यहाँ हेर्नुहोस्।'
                : 'Stay informed with the latest official notices, circulars, and announcements from the village administration.'}
            </p>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isNe ? 'सूचना खोज्नुहोस्...' : 'Search notices...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="self-start"
            >
              <Calendar className="h-4 w-4 mr-1" />
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat === 'all' ? (isNe ? 'सबै' : 'All') : cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {isNe ? 'सूचना' : `notice${filtered.length !== 1 ? 's' : ''}`} {isNe ? 'भेटियो' : 'found'}
          </p>

          {/* Empty state */}
          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">{isNe ? 'कुनै सूचना भेटिएन।' : 'No notices found.'}</p>
            </div>
          )}

          {/* Notices List */}
          <div className="space-y-4">
            {filtered.map((notice: any) => (
              <Card key={notice.id} className="notice-item border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className={`flex flex-col ${notice.image_url ? 'md:flex-row' : ''}`}>
                    {/* Image preview */}
                    {notice.image_url && isImageUrl(notice.image_url) && (
                      <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                        <img
                          src={notice.image_url}
                          alt={notice.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-card-foreground">
                          {isNe && notice.title_ne ? notice.title_ne : notice.title}
                        </h3>
                        <Badge variant="outline" className="capitalize text-xs flex-shrink-0">
                          {notice.category || 'general'}
                        </Badge>
                      </div>

                      {/* Content preview */}
                      {notice.content && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {isNe && notice.content_ne ? notice.content_ne : notice.content}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(notice.published_date), 'MMM dd, yyyy')}
                        </span>

                        {/* Action buttons for files */}
                        {notice.file_url && (
                          <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <a href={notice.file_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5 mr-1" />{isNe ? 'हेर्नुहोस्' : 'View'}
                              </a>
                            </Button>
                            <Button asChild variant="default" size="sm">
                              <a href={notice.file_url} download>
                                <Download className="h-3.5 w-3.5 mr-1" />{isNe ? 'डाउनलोड' : 'Download'}
                              </a>
                            </Button>
                          </div>
                        )}
                        {notice.image_url && !isImageUrl(notice.image_url) && (
                          <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <a href={notice.image_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5 mr-1" />{isNe ? 'हेर्नुहोस्' : 'View File'}
                              </a>
                            </Button>
                          </div>
                        )}
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

export default Notices;
