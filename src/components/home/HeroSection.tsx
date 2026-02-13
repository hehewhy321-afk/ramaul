import { Button } from '@/components/ui/button';
import defaultHeroImage from '@/assets/hero-village.jpg';
import { ArrowRight, MapPin, Users, Building2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const HeroSection = () => {
  const { t } = useTranslation();

  const { data: heroContent, isLoading: isHeroLoading } = useQuery({
    queryKey: ['site-settings', 'hero_content'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_content').maybeSingle();
      return data?.value as Record<string, any> | null;
    }
  });

  const heroImage = heroContent?.image_url || defaultHeroImage;

  const stats = [
  { icon: Users, value: '20,000+', label: t('stats.population') },
  { icon: Building2, value: '10', label: 'Mosques' },
  { icon: BookOpen, value: '10+', label: 'Schools' }];


  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background with parallax-like layers */}
      <div className="absolute inset-0 bg-black">
        {!isHeroLoading &&
        <img src={heroImage} alt="Ramaul Village panorama" className="w-full h-full object-cover scale-105 animate-fade-in" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Decorative geometric shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 border border-accent/20 rounded-full animate-float hidden lg:block" />
      <div className="absolute top-40 right-32 w-32 h-32 border border-primary-foreground/10 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }} />

      <div className="container-village relative z-10 pb-12 md:pb-20 pt-32">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          {/* Left content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-accent mb-6 backdrop-blur-md border border-accent/25">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Ramaul, Siraha Municipality  </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} y={30}>
              <div className="overflow-hidden mb-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground font-heading leading-[1.1]">
                  {t('hero.title').split('Ramaul')[0]}
                </h1>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} y={30}>
              <div className="overflow-hidden mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1]">
                  <span className="text-accent">Ramaul</span>{' '}
                  <span className="text-primary-foreground">Village</span>
                </h1>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base md:text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 mb-12 items-center lg:items-start">
                <Button asChild variant="hero" size="xl" className="w-full sm:w-auto min-w-[200px]">
                  <Link to="/about">
                    {t('hero.explore')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl" className="w-full sm:w-auto min-w-[200px]">
                  <Link to="/issues">{t('hero.report')}</Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right: Stats strip */}
          <div className="lg:col-span-5">
            <StaggerContainer className="grid grid-cols-3 gap-3" stagger={0.1} delay={0.5}>
              {stats.map((stat) =>
              <StaggerItem key={stat.label}>
                  <div className="group backdrop-blur-lg bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-4 text-center hover:bg-primary-foreground/10 transition-all duration-300">
                    <stat.icon className="h-5 w-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xl md:text-2xl font-bold text-primary-foreground font-heading">{stat.value}</p>
                    <p className="text-[11px] md:text-xs text-primary-foreground/60 mt-0.5">{stat.label}</p>
                  </div>
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={0.8} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary-foreground/40 to-transparent" />
        </FadeIn>
      </div>
    </section>);

};

export default HeroSection;