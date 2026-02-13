import { Button } from '@/components/ui/button';
import { Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '@/components/motion/FadeIn';

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-village">
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn>
            <div className="rounded-2xl bg-gradient-to-br from-primary to-village-green-light p-8 md:p-10 text-primary-foreground h-full">
              <Heart className="h-10 w-10 mb-4 text-accent" />
              <h3 className="text-2xl font-bold font-heading mb-3">{t('donate.title')}</h3>
              <p className="text-primary-foreground/80 mb-6">{t('donate.subtitle')}</p>
              <Button asChild variant="accent" size="lg">
                <Link to="/donate">{t('donate.submit')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-2xl bg-gradient-to-br from-accent to-village-gold p-8 md:p-10 text-accent-foreground h-full">
              <HelpCircle className="h-10 w-10 mb-4" />
              <h3 className="text-2xl font-bold font-heading mb-3">{t('issues.report')}</h3>
              <p className="text-accent-foreground/80 mb-6">{t('issues.subtitle')}</p>
              <Button asChild variant="default" size="lg">
                <Link to="/issues">{t('issues.report')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
