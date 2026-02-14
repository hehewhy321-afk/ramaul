import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImg from '@/assets/logo.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[hsl(222,20%,12%)] text-white dark:bg-[hsl(222,30%,6%)]">
      <div className="container-village section-padding pb-8">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Ramaul Logo" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="font-heading font-bold text-lg">Ramaul</span>
                <span className="block text-[10px] text-white/60">Village Portal</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{t('footer.tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              {[
                { name: t('nav.news'), path: '/news' },
                { name: t('nav.events'), path: '/events' },
                { name: t('nav.budget'), path: '/budget' },
                { name: t('nav.gallery'), path: '/gallery' },
                { name: t('nav.about'), path: '/about' },
              ].map(link => (
                <Link key={link.path} to={link.path} className="block text-sm text-white/60 hover:text-accent transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              {[
                { name: 'Business Directory', path: '/business-directory' },
                { name: 'Citizen Charter', path: '/citizen-charter' },
                { name: 'Documents', path: '/documents' },
                { name: 'Notices', path: '/notices' },
                { name: t('footer.election2082'), path: '/elections' },
              ].map(item => (
                <Link key={item.path} to={item.path} className="block text-sm text-white/60 hover:text-accent transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              {[
                { name: t('issues.title'), path: '/issues' },
                { name: t('nav.discussions'), path: '/discussions' },
                { name: t('donate.title'), path: '/donate' },
                { name: t('nav.faq'), path: '/faq' },
                { name: t('nav.contact'), path: '/contact' },
                { name: t('nav.emergency'), path: '/emergency' },
                { name: 'Ramaul Stats', path: '/stats' },
              ].map(item => (
                <Link key={item.path} to={item.path} className="block text-sm text-white/60 hover:text-accent transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t('footer.connect')}</h4>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>Ramaul, Siraha Municipality-04, Nepal</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" /><span>+977-33-XXXXXX</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0" /><span>info@ramaul.gov.np</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 flex-shrink-0" /><span>Sun-Fri: 10AM - 5PM</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Ramaul Village Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
