import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/home/HeroSection';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import StatsSection from '@/components/home/StatsSection';
import NewsEventsPreview from '@/components/home/NewsEventsPreview';
import BudgetOverview from '@/components/home/BudgetOverview';
import WardSection from '@/components/home/WardSection';
import DocumentsPreview from '@/components/home/DocumentsPreview';
import NoticesPreview from '@/components/home/NoticesPreview';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout transparentHeader>
      <SEOHead path="/" />
      <HeroSection />
      <AnnouncementBanner />
      <StatsSection />
      <NewsEventsPreview />
      <BudgetOverview />
      <NoticesPreview />
      <DocumentsPreview />
      <WardSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
