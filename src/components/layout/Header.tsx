import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageToggle from '@/components/LanguageToggle';
import { Menu, LogOut, ChevronDown, Heart } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  path?: string;
  children?: { name: string; path: string }[];
}

const Header = ({ transparent = false }: { transparent?: boolean }) => {
  const { t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  const navItems: NavItem[] = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.events'), path: '/events' },
    {
      name: t('common.viewAll').replace('View All', 'Explore'),
      children: [
        { name: t('nav.gallery'), path: '/gallery' },
        { name: t('nav.budget'), path: '/budget' },
        { name: 'Documents', path: '/documents' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.faq'), path: '/faq' },
      ],
    },
    {
      name: 'Community',
      children: [
        { name: t('nav.discussions'), path: '/discussions' },
        { name: t('nav.issues'), path: '/issues' },
        { name: t('nav.contact'), path: '/contact' },
        { name: t('nav.emergency'), path: '/emergency' },
      ],
    },
    { name: t('nav.donate'), path: '/donate' },
  ];

  // Flatten for mobile
  const allLinks = navItems.flatMap(item =>
    item.path ? [{ name: item.name, path: item.path }] : (item.children || [])
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const isTransparent = transparent && !scrolled;

  const handleLogout = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
  };

  const isActive = (path?: string, children?: { path: string }[]) => {
    if (path) return location.pathname === path;
    return children?.some(c => location.pathname === c.path);
  };

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'glass shadow-sm'}`}>
      <div className="container-village flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="Ramaul Logo" className="w-30 h-20 rounded-full object-cover" />
          <div>
            {/* <span className={`font-heading font-bold text-lg leading-tight ${isTransparent ? 'text-primary-foreground' : 'text-foreground'}`}>Ramaul</span> */}

          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map(item =>
            item.path ? (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${item.path === '/donate'
                  ? 'text-accent hover:text-accent/80'
                  : isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : isTransparent
                      ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
              >
                {item.path === '/donate' && <Heart className="h-3.5 w-3.5" />}
                {item.name}
              </Link>
            ) : (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${isActive(undefined, item.children)
                    ? 'bg-primary/10 text-primary'
                    : isTransparent
                      ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    }`}
                >
                  {item.name}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg py-1 z-50">
                    {item.children?.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2.5 text-sm transition-colors ${location.pathname === child.path
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-popover-foreground hover:bg-muted'
                          }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          <ThemeToggle className={isTransparent ? 'text-primary-foreground' : ''} />
          <LanguageToggle className={isTransparent ? 'text-primary-foreground' : ''} />
          {user && (
            <div className="flex items-center gap-1 ml-1">
              {isAdmin && (
                <Button asChild variant="default" size="sm">
                  <Link to="/admin">{t('nav.admin')}</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className={isTransparent ? 'text-primary-foreground' : ''}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className={isTransparent ? 'text-primary-foreground' : 'text-foreground'}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-0.5 mt-8">
              {navItems.map(item =>
                item.path ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${item.path === '/donate'
                      ? 'text-accent'
                      : location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    {item.path === '/donate' && <Heart className="h-4 w-4" />}
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${isActive(undefined, item.children)
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === item.name && (
                      <div className="ml-4 border-l border-border pl-2 space-y-0.5">
                        {item.children?.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === child.path
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                              }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
              <div className="px-4 py-2 flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              {user && (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-muted">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted text-left">
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
