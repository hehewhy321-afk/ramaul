import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, BookOpen, Building2, Landmark, Droplets, TreePine, GraduationCap, ShoppingBag, Handshake, Mountain, BarChart3 } from 'lucide-react';
import defaultHeroImage from '@/assets/hero-village.jpg';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const { data: aboutContent } = useQuery({
    queryKey: ['site-settings', 'about_content'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'about_content').maybeSingle();
      return data?.value as Record<string, any> | null;
    },
  });

  const defaultStats = [
    { icon: 'Users', value: '20,000–25,000', label: 'Population' },
    { icon: 'Building2', value: '10+', label: 'Mosques' },
    { icon: 'BookOpen', value: '6', label: 'Madrasas' },
    { icon: 'GraduationCap', value: '4+', label: 'Schools' },
    { icon: 'Landmark', value: '5', label: 'Tolas (Areas)' },
    { icon: 'Droplets', value: '1.6 km', label: 'From Siraha HQ' },
  ];

  const iconMap: Record<string, any> = { Users, Building2, BookOpen, GraduationCap, Landmark, Droplets, MapPin, TreePine, ShoppingBag, Handshake, Mountain };

  const stats = aboutContent?.stats || defaultStats;
  const heroImage = aboutContent?.image_url || defaultHeroImage;

  const highlights = [
    {
      icon: Landmark,
      title: 'Heritage & Faith',
      desc: 'A predominantly Muslim village with 10+ mosques including the historic Jama Masjid, and Eidgah grounds for community prayers during Eid-ul-Fitr and Eid-ul-Azha.',
    },
    {
      icon: BookOpen,
      title: 'Education',
      desc: 'Home to 6 Madrasas offering Islamic education, plus government and private schools including Secondary School Ramaul and Nepal Avalanche Academy.',
    },
    {
      icon: Users,
      title: 'Community',
      desc: 'Divided into five tolas — Purab (East), Uttar (North), Paschim (West), Dakshin (South-West), and Mansoori (South-East) — each with its own character.',
    },
    {
      icon: MapPin,
      title: 'Geography',
      desc: 'Located in the Terai plains of Madhesh Province, bordered by the Kamala River to the west. Surrounded by Makhanaha, Basbitta, Manpur, and Madar.',
    },
    {
      icon: TreePine,
      title: 'Culture & Language',
      desc: 'Residents speak Mithila Urdu as their mother tongue — a unique dialect spoken by Muslims in the region. Traditional foods include rice, roti, pulao, and biryani.',
    },
    {
      icon: Droplets,
      title: 'Connectivity',
      desc: 'Just 1.6 km from Siraha district headquarters with easy access to goods from both the border and Siraha Bazaar. Known for Ramaul Chowk, the village center.',
    },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-item', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead title="About" description="Learn about Ramaul Village – its history, geography, culture, and people in Siraha, Nepal." path="/about" />
      <div ref={ref}>
        {/* Hero Banner */}
        <div className="relative h-80 md:h-[28rem] overflow-hidden">
          <img src={heroImage} alt="Ramaul Village panorama" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 flex items-end justify-center text-center">
            <div className="container-village pb-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-accent mb-4 backdrop-blur-md border border-accent/25">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Madhesh Province, Nepal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary-foreground mb-2">
                {aboutContent?.title || t('about.title')}
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-xl text-center">
                {aboutContent?.subtitle || 'Discover the heritage, community, and spirit of Ramaul Village'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-card border-b border-border">
          <div className="container-village py-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {(stats as any[]).map((s: any, i: number) => {
                const IconComp = iconMap[s.icon] || [Users, Building2, BookOpen, GraduationCap, Landmark, Droplets][i] || Users;
                return (
                  <div key={i} className="about-item text-center">
                    <IconComp className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xl font-bold font-heading text-card-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="hero" size="lg" onClick={() => navigate('/stats')} className="gap-2">
              <BarChart3 className="h-5 w-5" />
              View All Statistics
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="section-padding">
          <div className="container-village">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="about-item text-3xl font-bold font-heading mb-4">About Our Village</h2>
              <p className="about-item text-muted-foreground leading-relaxed">
                {aboutContent?.description ||
                  'Ramaul is a vibrant Muslim-dominated village in Siraha Municipality (Wards 3, 4 & 5) in the Madhesh Province of south-eastern Nepal. With a population of 20,000–25,000 people, it is a thriving community known for its rich Islamic heritage, educational institutions, and the bustling Ramaul Chowk — the social and commercial heart of the village. The village is bordered by the Kamala River to the west, connecting Nepal and India.'}
              </p>
            </div>

            {/* Highlights Grid */}
            {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {highlights.map((item) => (
                <Card key={item.title} className="about-item border-border/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-1.5 text-card-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div> */}

            {/* Daily Life & Economy */}
            <div className="about-item max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-accent/10"><ShoppingBag className="h-5 w-5 text-accent" /></div>
                <h2 className="text-2xl font-bold font-heading">Daily Life & Economy</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The economy of Ramaul is primarily agrarian, with rice, wheat, and maize as staple crops cultivated across the fertile Terai plains. Many families also engage in small-scale businesses — from grocery shops and tailoring to mobile repair and cycle workshops — especially around the bustling Ramaul Chowk, the commercial nerve center of the village.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A significant portion of the working-age population contributes through remittances from employment in Gulf countries, India, and Malaysia — a pattern common across Madhesh Province. The daily rhythm of life revolves around five-time prayers at the local mosques, agricultural work, and children attending schools and madrasas.
              </p>
            </div>

            {/* Religious Harmony */}
            <div className="about-item max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10"><Handshake className="h-5 w-5 text-primary" /></div>
                <h2 className="text-2xl font-bold font-heading">Religious Composition</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ramaul is a predominantly Muslim village — the vast majority of the population follows Islam, making it one of the notable Muslim settlements in Siraha district. There is a very small Hindu minority who have coexisted peacefully with the Muslim majority for generations. The village's identity is deeply rooted in Islamic traditions, with festivals like Eid-ul-Fitr, Eid-ul-Azha, Shab-e-Barat, and Milad-un-Nabi celebrated with great communal spirit. The Eidgah grounds serve as the gathering point for large community prayers during Eid.
              </p>
            </div>

            {/* Notable Landmarks */}
            <div className="about-item max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-accent/10"><Mountain className="h-5 w-5 text-accent" /></div>
                <h2 className="text-2xl font-bold font-heading">Notable Landmarks</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'Ramaul Chowk', desc: 'The central hub for commerce, social gatherings, and daily village life' },
                  { name: 'Eidgah Grounds', desc: 'Open prayer grounds used for large Eid congregational prayers' },
                  { name: 'Kamala River Bank', desc: 'Western border of the village, connecting Nepal and India' },
                  { name: 'Jama Masjid (Purab)', desc: 'One of the oldest and largest mosques in the village' },
                ].map(l => (
                  <div key={l.name} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <h4 className="font-semibold text-card-foreground text-sm">{l.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notable Mosques */}
            <div>
              <h2 className="about-item text-2xl font-bold font-heading mb-6 text-center">Notable Mosques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  'Jama Masjid (East)',
                  'Makki Masjid (North)',
                  'Madni Masjid (North)',
                  'Masjid-e-Belal (West)',
                  'Jama Masjid Ahle Hadith (SE)',
                  'Makki Masjid (South)',
                ].map((m) => (
                  <div key={m} className="about-item flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-card-foreground">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Institutes */}
            <div className="mt-12">
              <h2 className="about-item text-2xl font-bold font-heading mb-6 text-center">Educational Institutes</h2>
              <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {[
                  'Secondary School, Ramaul (Siraha-04)',
                  'Nepal Avalanche Academy (Siraha-05)',
                  'Iqra Educational Academy (Siraha-04)',
                  'Madarasa Arabiya Makhjunool Uloom Assalfiya',
                  'Madarsa Hussainiya (North)',
                  'Madarsa Darrutalim wa Tarbiyat (South-West)',
                  'Madarsa Sultanul-uloom (West)',
                  'Madarasa Almahadul Ilmi Assalafi (South)',
                  'Al Madrasatul Muhammadiyatus Salafiyah',
                  'Jamia Aaesha Siddiqah Banat',
                ].map((s) => (
                  <div key={s} className="about-item flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <GraduationCap className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm text-card-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
