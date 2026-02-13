import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, Download, Eye, Filter } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const CATEGORIES = ['all', 'forms', 'certificates', 'guidelines', 'reports', 'templates', 'general'];

const Documents = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  useEffect(() => {
    if (!ref.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('.doc-item', { y: 20, opacity: 0, duration: 0.4, stagger: 0.06 });
    }, ref);
    return () => ctx.revert();
  }, [isLoading, search, category]);

  const filtered = documents.filter((doc: any) => {
    const matchesSearch = !search || doc.title?.toLowerCase().includes(search.toLowerCase()) || doc.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || doc.category === category;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType: string | null) => {
    return <FileText className="h-8 w-8 text-primary" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Layout>
      <SEOHead title="Documents" description="Access official documents, reports, and public records from Ramaul Village." path="/documents" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading mb-2">Document Samples</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse and download sample documents, forms, and templates to help you prepare and fill out official forms correctly.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
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
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found</p>

          {/* Documents Grid */}
          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No documents found.</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc: any) => (
              <Card key={doc.id} className="doc-item border-border/50 hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge variant="outline" className="capitalize text-xs">{doc.category || 'general'}</Badge>
                        {doc.file_type && <span className="text-xs text-muted-foreground uppercase">{doc.file_type}</span>}
                        {doc.file_size && <span className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button asChild variant="outline" size="sm">
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3.5 w-3.5 mr-1" />View
                          </a>
                        </Button>
                        <Button asChild variant="default" size="sm">
                          <a href={doc.file_url} download>
                            <Download className="h-3.5 w-3.5 mr-1" />Download
                          </a>
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Added {format(new Date(doc.created_at), 'MMM dd, yyyy')}
                        {doc.download_count ? ` · ${doc.download_count} downloads` : ''}
                      </p>
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

export default Documents;
