import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const COLORS = ['hsl(152, 45%, 28%)', 'hsl(38, 85%, 50%)', 'hsl(200, 60%, 45%)', 'hsl(25, 70%, 45%)', 'hsl(280, 45%, 45%)', 'hsl(340, 55%, 50%)'];
const formatNPR = (val: number) => `NPR ${(val / 100000).toFixed(1)}L`;

const BudgetOverview = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';

  const { data: budgetData = [] } = useQuery({
    queryKey: ['budget-overview'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_categories').select('*').order('allocated_amount', { ascending: false });
      return (data || []).map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
    },
  });

  const totalAllocated = budgetData.reduce((s, d) => s + Number(d.allocated_amount), 0);
  const totalSpent = budgetData.reduce((s, d) => s + Number(d.spent_amount), 0);

  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-village">
        <FadeIn>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground">{t('budget.title')}</h2>
              <p className="text-muted-foreground mt-1">{t('budget.subtitle')}</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/budget">{t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-4 mb-8" stagger={0.1}>
          <StaggerItem>
            <Card className="border-border/50">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.allocated')}</p>
                <p className="text-2xl font-bold text-foreground">{formatNPR(totalAllocated)}</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-border/50">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.spent')}</p>
                <p className="text-2xl font-bold text-primary">{formatNPR(totalSpent)}</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-border/50">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.remaining')}</p>
                <p className="text-2xl font-bold text-accent">{formatNPR(totalAllocated - totalSpent)}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {budgetData.length > 0 && (
          <StaggerContainer className="grid lg:grid-cols-2 gap-8" stagger={0.15} delay={0.3}>
            <StaggerItem>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg">{t('budget.categories')}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={budgetData} dataKey="allocated_amount" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                        {budgetData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatNPR(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg">{t('budget.allocated')} vs {t('budget.spent')}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                      <XAxis dataKey={isNe ? 'name_ne' : 'name'} tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: number) => formatNPR(val)} />
                      <Legend />
                      <Bar dataKey="allocated_amount" fill="hsl(152, 45%, 28%)" name={t('budget.allocated')} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent_amount" fill="hsl(38, 85%, 50%)" name={t('budget.spent')} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        )}
      </div>
    </section>
  );
};

export default BudgetOverview;
