import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(isNepali ? 'en' : 'ne')}
      className={`gap-1.5 ${className}`}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium">{isNepali ? 'EN' : 'ने'}</span>
    </Button>
  );
};

export default LanguageToggle;
