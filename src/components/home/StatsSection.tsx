import { useEffect, useRef, useState } from 'react';
import { Users, Home, TreePine, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const StatsSection = () => {
  const { t } = useTranslation();
  const stats = [
    { icon: Users, label: t('stats.population'), value: 20000, suffix: '+' },
    { icon: Home, label: t('stats.households'), value: 3000, suffix: '+' },
    { icon: TreePine, label: 'Area (Hectares)', value: null, displayText: '300-600', suffix: '' },
    { icon: BookOpen, label: t('stats.literacy'), value: 63, suffix: '%', displayText: '63%' },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    setCounts(stats.map(() => 0));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounts(stats.map(stat => Math.floor(stat.value * eased)));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-primary">
      <div className="container-village">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" stagger={0.1}>
          {stats.map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div className="text-center text-primary-foreground">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
                <div className="text-3xl md:text-4xl font-bold font-heading mb-1">
                  {stat.displayText ? stat.displayText : `${counts[i].toLocaleString()}${stat.suffix}`}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default StatsSection;
