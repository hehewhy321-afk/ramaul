import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Phone, Siren, Stethoscope, Shield, Flame, Droplets,
  Building2, Baby, HeartPulse, Truck, AlertTriangle, MapPin
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  nameNe: string;
  phone: string;
  altPhone?: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  descriptionNe: string;
  available: string;
  priority: 'critical' | 'high' | 'normal';
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Nepal Police (Emergency)',
    nameNe: 'नेपाल प्रहरी (आपतकालीन)',
    phone: '100',
    category: 'police',
    icon: <Shield className="h-6 w-6" />,
    description: 'National emergency police helpline',
    descriptionNe: 'राष्ट्रिय आपतकालीन प्रहरी हेल्पलाइन',
    available: '24/7',
    priority: 'critical',
  },
  {
    id: '2',
    name: 'Ambulance Service',
    nameNe: 'एम्बुलेन्स सेवा',
    phone: '102',
    category: 'medical',
    icon: <Truck className="h-6 w-6" />,
    description: 'National ambulance emergency service',
    descriptionNe: 'राष्ट्रिय एम्बुलेन्स आपतकालीन सेवा',
    available: '24/7',
    priority: 'critical',
  },
  {
    id: '3',
    name: 'Fire Brigade',
    nameNe: 'दमकल सेवा',
    phone: '101',
    category: 'fire',
    icon: <Flame className="h-6 w-6" />,
    description: 'Fire emergency and rescue',
    descriptionNe: 'आगलागी आपतकालीन र उद्धार',
    available: '24/7',
    priority: 'critical',
  },
  {
    id: '4',
    name: 'Siraha District Hospital',
    nameNe: 'सिरहा जिल्ला अस्पताल',
    phone: '033-520111',
    category: 'medical',
    icon: <Stethoscope className="h-6 w-6" />,
    description: 'Nearest district hospital for major treatments',
    descriptionNe: 'ठूला उपचारका लागि निकटतम जिल्ला अस्पताल',
    available: '24/7',
    priority: 'high',
  },
  {
    id: '5',
    name: 'Ramaul Health Post',
    nameNe: 'रामौल स्वास्थ्य चौकी',
    phone: '033-XXXXXX',
    category: 'medical',
    icon: <HeartPulse className="h-6 w-6" />,
    description: 'Local health post for basic medical services',
    descriptionNe: 'आधारभूत स्वास्थ्य सेवाका लागि स्थानीय स्वास्थ्य चौकी',
    available: 'Sun–Fri, 10AM–5PM',
    priority: 'high',
  },
  {
    id: '6',
    name: 'Siraha Municipality Office',
    nameNe: 'सिरहा नगरपालिका कार्यालय',
    phone: '033-520158',
    altPhone: '033-520206',
    category: 'government',
    icon: <Building2 className="h-6 w-6" />,
    description: 'Ward 4 municipal office for official services',
    descriptionNe: 'वडा ४ नगरपालिका कार्यालय',
    available: 'Sun–Fri, 10AM–5PM',
    priority: 'normal',
  },
  {
    id: '7',
    name: 'Child Helpline',
    nameNe: 'बाल हेल्पलाइन',
    phone: '1098',
    category: 'helpline',
    icon: <Baby className="h-6 w-6" />,
    description: 'National child protection helpline',
    descriptionNe: 'राष्ट्रिय बाल संरक्षण हेल्पलाइन',
    available: '24/7',
    priority: 'high',
  },
  {
    id: '8',
    name: 'Women Helpline',
    nameNe: 'महिला हेल्पलाइन',
    phone: '1145',
    category: 'helpline',
    icon: <Phone className="h-6 w-6" />,
    description: 'National women\'s helpline for safety',
    descriptionNe: 'सुरक्षाका लागि राष्ट्रिय महिला हेल्पलाइन',
    available: '24/7',
    priority: 'high',
  },
  {
    id: '9',
    name: 'Disaster Management (NEOC)',
    nameNe: 'विपद् व्यवस्थापन (NEOC)',
    phone: '1155',
    category: 'disaster',
    icon: <AlertTriangle className="h-6 w-6" />,
    description: 'National Emergency Operation Center for floods, earthquakes',
    descriptionNe: 'बाढी, भूकम्पका लागि राष्ट्रिय आपतकालीन सञ्चालन केन्द्र',
    available: '24/7',
    priority: 'critical',
  },
  {
    id: '10',
    name: 'Drinking Water Complaint',
    nameNe: 'खानेपानी उजुरी',
    phone: '1144',
    category: 'utility',
    icon: <Droplets className="h-6 w-6" />,
    description: 'Report water supply issues',
    descriptionNe: 'खानेपानी आपूर्ति समस्या रिपोर्ट',
    available: 'Sun–Fri, 10AM–5PM',
    priority: 'normal',
  },
];

const priorityConfig = {
  critical: { label: 'Critical', labelNe: 'अत्यन्त जरुरी', color: 'bg-destructive text-destructive-foreground' },
  high: { label: 'Important', labelNe: 'महत्वपूर्ण', color: 'bg-accent text-accent-foreground' },
  normal: { label: 'General', labelNe: 'सामान्य', color: 'bg-secondary text-secondary-foreground' },
};

const categoryIcons: Record<string, string> = {
  police: '🚔',
  medical: '🏥',
  fire: '🚒',
  government: '🏛️',
  helpline: '📞',
  disaster: '⚠️',
  utility: '💧',
};

const Emergency = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const criticalContacts = emergencyContacts.filter(c => c.priority === 'critical');
  const otherContacts = emergencyContacts.filter(c => c.priority !== 'critical');

  return (
    <Layout>
      <SEOHead title="Emergency Contacts" description="Emergency contact numbers and services for Ramaul Village residents." path="/emergency" />
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-destructive/10 via-background to-accent/10 pt-28 pb-12">
          <div className="container-village text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
                <Siren className="h-5 w-5" />
                <span className="font-semibold text-sm">{isNe ? 'आपतकालीन सम्पर्क' : 'Emergency Contacts'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                {isNe ? 'आपतकालीन सम्पर्क नम्बरहरू' : 'Emergency Contact Numbers'}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isNe
                  ? 'रामौल र सिरहा क्षेत्रका लागि महत्वपूर्ण आपतकालीन सम्पर्क नम्बरहरू। तुरुन्त कल गर्न नम्बरमा थिच्नुहोस्।'
                  : 'Important emergency contact numbers for Ramaul and Siraha area. Tap any number to call instantly.'}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{isNe ? 'रामौल, वडा ४, सिरहा नगरपालिका' : 'Ramaul, Ward 4, Siraha Municipality'}</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container-village py-8 space-y-8">
          {/* Critical Emergency - Large Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Siren className="h-5 w-5 text-destructive" />
              {isNe ? 'अत्यन्त जरुरी — तुरुन्त कल गर्नुहोस्' : 'Critical — Call Immediately'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {criticalContacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                >
                  <Card className="border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors h-full">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-card-foreground">
                          {isNe ? contact.nameNe : contact.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isNe ? contact.descriptionNe : contact.description}
                        </p>
                      </div>
                      <a href={`tel:${contact.phone}`} className="block">
                        <Button variant="destructive" size="lg" className="w-full text-lg font-bold gap-2">
                          <Phone className="h-5 w-5" />
                          {contact.phone}
                        </Button>
                      </a>
                      <Badge className="bg-destructive/20 text-destructive text-[10px]">{contact.available}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Other Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              {isNe ? 'अन्य महत्वपूर्ण सम्पर्कहरू' : 'Other Important Contacts'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherContacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {contact.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-card-foreground truncate">
                              {isNe ? contact.nameNe : contact.name}
                            </p>
                            <span className="text-base shrink-0">{categoryIcons[contact.category]}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {isNe ? contact.descriptionNe : contact.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <a href={`tel:${contact.phone}`}>
                              <Button variant="default" size="sm" className="gap-1.5 font-semibold">
                                <Phone className="h-3.5 w-3.5" />
                                {contact.phone}
                              </Button>
                            </a>
                            {contact.altPhone && (
                              <a href={`tel:${contact.altPhone}`}>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <Phone className="h-3.5 w-3.5" />
                                  {contact.altPhone}
                                </Button>
                              </a>
                            )}
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {contact.available}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground text-center">
                  {isNe
                    ? '⚠️ यी सम्पर्क नम्बरहरू सार्वजनिक स्रोतबाट संकलित गरिएका हुन्। कृपया कुनै विसंगति भेटिएमा हामीलाई सम्पर्क गर्नुहोस्।'
                    : '⚠️ These contact numbers are compiled from public sources. Please contact us if you find any discrepancy.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Emergency;
