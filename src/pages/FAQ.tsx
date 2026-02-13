import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const faqs = [
  { q: 'How can I report a community issue?', a: 'You can report issues by logging into your account and navigating to the Community Issues section. Click "Report New Issue" and fill in the details.' },
  { q: 'How do I make a donation to the village?', a: 'Visit the Donations page to make a contribution. Scan the QR code to pay directly to the recipient account.' },
  { q: 'What documents can I access through the portal?', a: 'The Documents section provides access to public village records, meeting minutes, development plans, and financial reports.' },
  { q: 'How can I register for community events?', a: 'Browse upcoming events on the Events page and click the Register button for any event you wish to attend.' },
  { q: 'Who can I contact for urgent matters?', a: 'For urgent matters, contact the Ward Office directly at +977-33-XXXXXX during office hours (Sun-Fri, 10AM-5PM).' },
  { q: 'How is the village budget decided?', a: 'The village budget is decided through community participation meetings, ward council discussions, and final approval by the village council.' },
  { q: 'Can I volunteer for village projects?', a: 'Yes! Contact the ward office or submit a support request expressing your interest in volunteering.' },
  { q: 'How do I get updates about village activities?', a: 'Stay updated through our News section, follow the announcements banner on the homepage.' },
];

const FAQ = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => { gsap.from('.faq-item', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }); }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead title="FAQ" description="Frequently asked questions about Ramaul Village Portal services and features." path="/faq" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village max-w-3xl">
          <h1 className="text-4xl font-bold font-heading mb-2 text-center">{t('faq.title')}</h1>
          <p className="text-muted-foreground mb-10 text-center">{t('faq.subtitle')}</p>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="faq-item border border-border/50 rounded-lg px-6 data-[state=open]:bg-card">
                <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
