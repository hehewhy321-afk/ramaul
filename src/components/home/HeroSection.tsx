import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import defaultHeroImage from '@/assets/hero-village.jpg';
import { ArrowRight, MapPin, Sparkles, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FadeIn from '@/components/motion/FadeIn';

const HeroSection = () => {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { data: heroContent, isLoading: isHeroLoading } = useQuery({
    queryKey: ['site-settings', 'hero_content'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_content').maybeSingle();
      return data?.value as Record<string, any> | null;
    }
  });

  const heroImage = heroContent?.image_url || defaultHeroImage;

  return (
    <section className="relative min-h-[100vh] lg:min-h-[110vh] flex items-center overflow-hidden bg-[#050505] perspective-1000">
      {/* Background Layering */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(20,184,166,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Abstract Image Mask */}
        <div
          className="absolute right-[-5%] top-[10%] w-[60%] h-[80%] rounded-[40px] md:rounded-[80px] overflow-hidden rotate-[-2deg] transition-transform duration-700 ease-out hidden lg:block border-8 border-white/5"
          style={{ transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px) rotate(-2deg)` }}
        >
          {!isHeroLoading && (
            <img
              src={heroImage}
              alt="Ramaul Life"
              className="w-full h-full object-cover scale-110 motion-safe:animate-[subtle-drift_30s_infinite_alternate]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505]/80" />
        </div>
      </div>

      <div className="container-village relative z-10 w-full pt-20 lg:pt-0">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Content: Editorial Typography */}
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <FadeIn delay={0.1} x={-20}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-accent/50 hidden lg:block" />
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent/80 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Siraha, Nepal
                </span>
                <div className="h-[1px] w-12 bg-accent/50 lg:hidden" />
              </div>
            </FadeIn>

            <FadeIn delay={0.2} y={30}>
              <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter text-white mb-8">
                <span className="block italic font-serif text-accent drop-shadow-sm lg:translate-x-[-0.05em]">Explore</span>
                <span className="relative z-20 mix-blend-difference drop-shadow-2xl">
                  Ramaul<span className="text-accent/20">.</span>
                </span>
                <div className="absolute -top-10 -right-20 text-[12rem] opacity-[0.03] font-black select-none pointer-events-none hidden xl:block">
                  VILLAGE
                </div>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="max-w-xl mb-12 relative">
                <div className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:-left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/40 to-transparent rounded-full hidden lg:block" />
                <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light lg:pl-4">
                  Experience the heart of Siraha through a <span className="text-white/80 font-medium italic">digital lens</span>. Transparent, connected, and evolving.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                <Button asChild variant="hero" size="xl" className="group rounded-none px-10 border-b-4 border-accent-foreground/20 hover:border-accent-foreground/0 transition-all">
                  <Link to="/about" className="flex items-center gap-3">
                    <span className="text-lg uppercase tracking-widest font-bold">Explore Ramaul</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Link to="/issues" className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors duration-500 py-3 px-6">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/40 transition-all">
                    <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-bold font-heading">Report Issues</span>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Floating Glass Snaps (Mobile: Hidden, Tablet: Visible) */}
          <div className="lg:col-span-4 xl:col-span-5 relative hidden sm:flex flex-col gap-6 items-end lg:items-center">
            {/* Card 1 */}
            <div
              className="glass-snap group p-6 rotate-2 hover:rotate-0 translate-x-12 hover:translate-x-0"
              style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px) rotate(2deg)` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-accent/20 rounded-xl text-accent"><Sparkles className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Tradition</h3>
                  <p className="text-white/40 text-xs">Cultural Heritage</p>
                </div>
              </div>
              <div className="w-24 h-1 bg-accent/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-accent animate-pulse" />
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="glass-snap group p-6 rotate-[-3deg] hover:rotate-0 translate-x-4 hover:translate-x-0 translate-y-4"
              style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px) rotate(-3deg)` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-white/40"><Heart className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Unity</h3>
                  <p className="text-white/40 text-xs tracking-tighter italic">Growing Together</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Digital/Global */}
            <div
              className="glass-snap group p-6 rotate-1 hover:rotate-0 translate-x-20 hover:translate-x-0 lg:mt-8"
              style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px) rotate(1deg)` }}
            >
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Live Integration</span>
                <Globe className="h-3 w-3 text-white/20 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modernized Bottom Navigation/Scroll */}
      <div className="absolute bottom-12 left-0 w-full px-8 flex justify-between items-end pointer-events-none">
        <FadeIn delay={1} x={-20} className="hidden md:block">
          <div className="text-[10px] text-white/20 font-bold uppercase tracking-[0.5em] vertical-text transform rotate-180 mb-20 origin-center">
            Ramaul Digital Hub 2026
          </div>
        </FadeIn>

        <FadeIn delay={1.2} y={20} className="w-full flex-1 flex justify-center pointer-events-auto">
          <button className="group flex flex-col items-center gap-4 hover:opacity-80 transition-opacity">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Dive In</span>
            <div className="w-[1.5px] h-12 bg-gradient-to-b from-accent to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scan-line" />
            </div>
          </button>
        </FadeIn>

        <div className="hidden md:flex gap-6 pointer-events-auto">
          {['FB', 'IG', 'TW'].map(social => (
            <button key={social} className="text-[10px] font-bold text-white/20 hover:text-accent transition-colors tracking-widest uppercase">{social}</button>
          ))}
        </div>
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
        .glass-snap {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          min-width: 220px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-snap:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(20, 184, 166, 0.3);
          transform: translateY(-5px) scale(1.02);
        }
        @keyframes subtle-drift {
          from { transform: scale(1.1) translate(0, 0); }
          to { transform: scale(1.2) translate(-2%, -2%); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan-line {
          animation: scan-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;