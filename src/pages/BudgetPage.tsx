import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['hsl(152, 45%, 28%)', 'hsl(38, 85%, 50%)', 'hsl(200, 60%, 45%)', 'hsl(25, 70%, 45%)', 'hsl(280, 45%, 45%)', 'hsl(340, 55%, 50%)'];
const formatNPR = (val: number) => `NPR ${(val / 100000).toFixed(1)}L`;

const BudgetPage = () => {
  const { t, i18n } = useTranslation();
  const isNe = i18n.language === 'ne';
  const ref = useRef<HTMLDivElement>(null);

  const { data: budgetData = [] } = useQuery({
    queryKey: ['budget-full'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_categories').select('*').order('allocated_amount', { ascending: false });
      return (data || []).map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['budget-transactions'],
    queryFn: async () => {
      const { data } = await supabase.from('budget_transactions').select('*, budget_categories(name, name_ne)').order('transaction_date', { ascending: false }).limit(20);
      return data || [];
    },
  });

  const totalAllocated = budgetData.reduce((s, d) => s + Number(d.allocated_amount), 0);
  const totalSpent = budgetData.reduce((s, d) => s + Number(d.spent_amount), 0);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.budget-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead title="Budget" description="Transparent budget overview and financial reports of Ramaul Village." path="/budget" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('budget.title')}</h1>
          <p className="text-muted-foreground mb-10">{t('budget.subtitle')}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="budget-item border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.allocated')}</p>
                <p className="text-3xl font-bold text-foreground">{formatNPR(totalAllocated)}</p>
              </CardContent>
            </Card>
            <Card className="budget-item border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.spent')}</p>
                <p className="text-3xl font-bold text-primary">{formatNPR(totalSpent)}</p>
              </CardContent>
            </Card>
            <Card className="budget-item border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('budget.remaining')}</p>
                <p className="text-3xl font-bold text-accent">{formatNPR(totalAllocated - totalSpent)}</p>
              </CardContent>
            </Card>
          </div>

          {budgetData.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="budget-item border-border/50">
                <CardHeader><CardTitle>{t('budget.categories')}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={budgetData} dataKey="allocated_amount" nameKey={isNe ? 'name_ne' : 'name'} cx="50%" cy="50%" outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                        {budgetData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatNPR(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="budget-item border-border/50">
                <CardHeader><CardTitle>{t('budget.allocated')} vs {t('budget.spent')}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                      <XAxis dataKey={isNe ? 'name_ne' : 'name'} tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={70} />
                      <YAxis tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => formatNPR(v)} />
                      <Legend />
                      <Bar dataKey="allocated_amount" fill="hsl(152, 45%, 28%)" name={t('budget.allocated')} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent_amount" fill="hsl(38, 85%, 50%)" name={t('budget.spent')} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <h2 className="text-2xl font-bold font-heading mb-4">{t('budget.categories')}</h2>
          <div className="space-y-3 mb-8">
            {budgetData.map(cat => {
              const pct = Number(cat.allocated_amount) > 0 ? (Number(cat.spent_amount) / Number(cat.allocated_amount) * 100).toFixed(1) : '0';
              return (
                <Card key={cat.id} className="budget-item border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-card-foreground">{isNe && cat.name_ne ? cat.name_ne : cat.name}</span>
                      <span className="text-sm text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cat.fill }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{t('budget.spent')}: {formatNPR(Number(cat.spent_amount))}</span>
                      <span>{t('budget.allocated')}: {formatNPR(Number(cat.allocated_amount))}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {transactions.length > 0 && (
            <>
              <h2 className="text-2xl font-bold font-heading mb-4">{t('budget.transactions')}</h2>
              <div className="space-y-2">
                {transactions.map(tx => (
                  <Card key={tx.id} className="border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{isNe && tx.description_ne ? tx.description_ne : tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.transaction_date} • {(tx.budget_categories as any)?.name}</p>
                      </div>
                      <span className="font-bold text-primary">{formatNPR(Number(tx.amount))}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BudgetPage;
