import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, AreaChart, Area, RadialBarChart, RadialBar,
} from 'recharts';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, Table as TableIcon, Activity } from 'lucide-react';
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';

const COLORS = ['hsl(152, 45%, 28%)', 'hsl(38, 85%, 50%)', 'hsl(200, 60%, 45%)', 'hsl(25, 70%, 45%)', 'hsl(280, 45%, 45%)', 'hsl(340, 55%, 50%)', 'hsl(160, 50%, 40%)', 'hsl(10, 70%, 50%)'];
const formatNPR = (val: number) => `NPR ${val.toLocaleString()}`;
const formatNPRShort = (val: number) => val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val.toLocaleString();

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
      const { data } = await supabase.from('budget_transactions').select('*, budget_categories(name, name_ne)').order('transaction_date', { ascending: false }).limit(50);
      return data || [];
    },
  });

  const totalAllocated = budgetData.reduce((s, d) => s + Number(d.allocated_amount), 0);
  const totalSpent = budgetData.reduce((s, d) => s + Number(d.spent_amount), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const spentPct = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100) : 0;

  // Data for donut chart
  const donutData = budgetData.map(d => ({
    name: isNe && d.name_ne ? d.name_ne : d.name,
    value: Number(d.allocated_amount),
    fill: d.fill,
  }));

  // Data for spent donut
  const spentDonutData = budgetData.filter(d => Number(d.spent_amount) > 0).map(d => ({
    name: isNe && d.name_ne ? d.name_ne : d.name,
    value: Number(d.spent_amount),
    fill: d.fill,
  }));

  // Radial bar for utilization per category
  const radialData = budgetData.map((d, i) => ({
    name: isNe && d.name_ne ? d.name_ne : d.name,
    utilization: Number(d.allocated_amount) > 0 ? Math.round((Number(d.spent_amount) / Number(d.allocated_amount)) * 100) : 0,
    fill: COLORS[i % COLORS.length],
  }));

  // Area chart: allocated vs spent per category
  const areaData = budgetData.map(d => ({
    name: (isNe && d.name_ne ? d.name_ne : d.name)?.slice(0, 15),
    allocated: Number(d.allocated_amount),
    spent: Number(d.spent_amount),
    remaining: Number(d.allocated_amount) - Number(d.spent_amount),
  }));

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.budget-item', { y: 30, opacity: 0, duration: 0.5, stagger: 0.08 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead title="Budget & Finance" description="Transparent budget overview, spending reports, and financial analytics of Ramaul Village." path="/budget" />
      <div ref={ref} className="pt-24 section-padding">
        <div className="container-village">
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-heading mb-2">{t('budget.title')}</h1>
              <p className="text-muted-foreground">{t('budget.subtitle')}</p>
            </div>
          </FadeIn>

          {/* Summary Cards */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" stagger={0.08}>
            <StaggerItem>
              <Card className="budget-item border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t('budget.allocated')}</p>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{formatNPR(totalAllocated)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{budgetData.length} {t('budget.categories')}</p>
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="budget-item border-border/50 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t('budget.spent')}</p>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-primary">{formatNPR(totalSpent)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{spentPct.toFixed(1)}% utilized</p>
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="budget-item border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t('budget.remaining')}</p>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{formatNPR(totalRemaining)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(100 - spentPct).toFixed(1)}% available</p>
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="budget-item border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Activity className="h-5 w-5 text-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{spentPct.toFixed(1)}%</p>
                  <div className="w-full bg-muted rounded-full h-3 mt-2">
                    <div className="h-3 rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.min(100, spentPct)}%` }} />
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>

          {/* Charts Tabs */}
          {budgetData.length > 0 && (
            <FadeIn delay={0.2}>
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="mb-4 flex-wrap">
                  <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Overview</TabsTrigger>
                  <TabsTrigger value="allocation" className="gap-1.5"><PieChartIcon className="h-3.5 w-3.5" />Allocation</TabsTrigger>
                  <TabsTrigger value="spending" className="gap-1.5"><TrendingDown className="h-3.5 w-3.5" />Spending</TabsTrigger>
                  <TabsTrigger value="comparison" className="gap-1.5"><Activity className="h-3.5 w-3.5" />Comparison</TabsTrigger>
                  <TabsTrigger value="table" className="gap-1.5"><TableIcon className="h-3.5 w-3.5" />Details</TabsTrigger>
                </TabsList>

                {/* Overview: Bar Chart */}
                <TabsContent value="overview">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">{t('budget.allocated')} vs {t('budget.spent')}</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={areaData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                            <YAxis tickFormatter={v => `${formatNPRShort(v)}`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: number) => formatNPR(v)} />
                            <Legend />
                            <Bar dataKey="allocated" fill="hsl(152, 45%, 28%)" name={t('budget.allocated')} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="spent" fill="hsl(38, 85%, 50%)" name={t('budget.spent')} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">Budget Flow</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={320}>
                          <AreaChart data={areaData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tickFormatter={v => `${formatNPRShort(v)}`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: number) => formatNPR(v)} />
                            <Legend />
                            <Area type="monotone" dataKey="allocated" fill="hsl(152, 45%, 28%)" fillOpacity={0.2} stroke="hsl(152, 45%, 28%)" name={t('budget.allocated')} />
                            <Area type="monotone" dataKey="spent" fill="hsl(38, 85%, 50%)" fillOpacity={0.3} stroke="hsl(38, 85%, 50%)" name={t('budget.spent')} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Allocation: Donut Charts */}
                <TabsContent value="allocation">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">Budget Allocation by Category</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <PieChart>
                            <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                              {donutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip formatter={(v: number) => formatNPR(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">Spending Distribution</CardTitle></CardHeader>
                      <CardContent>
                        {spentDonutData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                              <Pie data={spentDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                                {spentDonutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                              </Pie>
                              <Tooltip formatter={(v: number) => formatNPR(v)} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-center text-muted-foreground py-20">No spending recorded yet</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Spending: Category Progress */}
                <TabsContent value="spending">
                  <div className="space-y-3">
                    {budgetData.map(cat => {
                      const alloc = Number(cat.allocated_amount);
                      const spent = Number(cat.spent_amount);
                      const pct = alloc > 0 ? (spent / alloc * 100) : 0;
                      const isOver = spent > alloc;
                      return (
                        <Card key={cat.id} className="border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                                <span className="font-medium text-card-foreground">
                                  {isNe && cat.name_ne ? cat.name_ne : cat.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={isOver ? 'destructive' : pct > 75 ? 'default' : 'secondary'}>
                                  {pct.toFixed(1)}%
                                </Badge>
                                {cat.financial_year && <Badge variant="outline">{cat.financial_year}</Badge>}
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-700 ${isOver ? 'bg-destructive' : 'bg-primary'}`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>{t('budget.spent')}: {formatNPR(spent)}</span>
                              <span>{t('budget.allocated')}: {formatNPR(alloc)}</span>
                              <span>{t('budget.remaining')}: {formatNPR(alloc - spent)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Comparison: Radial + stacked */}
                <TabsContent value="comparison">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">Utilization Rate by Category</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                            <RadialBar background dataKey="utilization" label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} />
                            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" formatter={(value, entry: any) => entry?.payload?.name || value} />
                            <Tooltip formatter={(v: number) => `${v}%`} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50">
                      <CardHeader><CardTitle className="text-base">Remaining vs Spent</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={areaData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis type="number" tickFormatter={v => `${formatNPRShort(v)}`} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                            <Tooltip formatter={(v: number) => formatNPR(v)} />
                            <Legend />
                            <Bar dataKey="spent" stackId="a" fill="hsl(38, 85%, 50%)" name={t('budget.spent')} />
                            <Bar dataKey="remaining" stackId="a" fill="hsl(152, 45%, 28%)" name={t('budget.remaining')} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Table view */}
                <TabsContent value="table">
                  <Card className="border-border/50 overflow-x-auto mb-8">
                    <CardHeader><CardTitle className="text-base">{t('budget.categories')} Detail</CardTitle></CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">{t('budget.allocated')}</TableHead>
                            <TableHead className="text-right">{t('budget.spent')}</TableHead>
                            <TableHead className="text-right">{t('budget.remaining')}</TableHead>
                            <TableHead className="text-right">Utilization</TableHead>
                            <TableHead>Year</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetData.map(cat => {
                            const alloc = Number(cat.allocated_amount);
                            const spent = Number(cat.spent_amount);
                            const pct = alloc > 0 ? (spent / alloc * 100).toFixed(1) : '0';
                            return (
                              <TableRow key={cat.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                                    <span className="font-medium">{isNe && cat.name_ne ? cat.name_ne : cat.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{formatNPR(alloc)}</TableCell>
                                <TableCell className="text-right">{formatNPR(spent)}</TableCell>
                                <TableCell className="text-right">{formatNPR(alloc - spent)}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={Number(pct) > 90 ? 'destructive' : Number(pct) > 50 ? 'default' : 'secondary'}>{pct}%</Badge>
                                </TableCell>
                                <TableCell>{cat.financial_year}</TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow className="font-bold bg-muted/50">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-right">{formatNPR(totalAllocated)}</TableCell>
                            <TableCell className="text-right">{formatNPR(totalSpent)}</TableCell>
                            <TableCell className="text-right">{formatNPR(totalRemaining)}</TableCell>
                            <TableCell className="text-right">{spentPct.toFixed(1)}%</TableCell>
                            <TableCell>—</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </FadeIn>
          )}

          {/* Transactions */}
          {transactions.length > 0 && (
            <FadeIn delay={0.3}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">{t('budget.transactions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm text-muted-foreground">{tx.transaction_date}</TableCell>
                          <TableCell className="font-medium">{isNe && tx.description_ne ? tx.description_ne : tx.description}</TableCell>
                          <TableCell><Badge variant="outline">{(tx.budget_categories as any)?.name || '—'}</Badge></TableCell>
                          <TableCell className="text-right font-bold text-primary">{formatNPR(Number(tx.amount))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BudgetPage;
