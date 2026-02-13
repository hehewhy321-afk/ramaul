import { FileText, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const DocumentsPreview = () => {
  const { data: documents = [] } = useQuery({
    queryKey: ['documents-preview'],
    queryFn: async () => {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(4);
      return data || [];
    },
  });

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-village">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Document Samples</h2>
              <p className="text-muted-foreground max-w-lg">
                Download sample forms and templates to help you fill out official documents correctly.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/documents">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {documents.map((doc: any) => (
              <StaggerItem key={doc.id}>
                <Card className="border-border/50 hover:shadow-md transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{doc.title}</h3>
                        <Badge variant="outline" className="text-[10px] capitalize mt-0.5">{doc.category || 'general'}</Badge>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5 mr-1" />Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link to="/documents">View All Documents <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocumentsPreview;
