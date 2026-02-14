import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/home/HeroSection';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import StatsSection from '@/components/home/StatsSection';
import NewsEventsPreview from '@/components/home/NewsEventsPreview';
import BudgetOverview from '@/components/home/BudgetOverview';
import WardSection from '@/components/home/WardSection';
import BusinessDirectoryPreview from '@/components/home/BusinessDirectoryPreview';
import CitizenCharterPreview from '@/components/home/CitizenCharterPreview';
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
      <BusinessDirectoryPreview />
      <CitizenCharterPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;