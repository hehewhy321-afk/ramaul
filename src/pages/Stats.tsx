import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Home, MapPin, TrendingUp, BookOpen, Globe, Landmark,
  Zap, Droplets, Building2, TreePine, BarChart3, ArrowLeft,
  Plane, Heart, GraduationCap, Stethoscope, Baby, Activity,
  Download
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import {
  censusData, CHART_COLORS, populationGrowth, literacyComparison,
  infrastructureComparison, migrationGrowth, healthComparison,
  enrollmentComparison, type CensusYear
} from '@/lib/statsData';

// Animated counter hook
const useCounter = (target: number, duration = 1500, shouldAnimate = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldAnimate) { setCount(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, shouldAnimate, duration]);
  return count;
};

const AnimatedStatCard = ({ icon: Icon, label, value, sub, isNumeric, numValue }: {
  icon: any; label: string; value: string; sub?: string; isNumeric?: boolean; numValue?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const animatedVal = useCounter(numValue || 0, 1200, visible && !!isNumeric);

  return (
    <Card ref={ref} className="border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold font-heading text-card-foreground">
            {isNumeric && numValue ? animatedVal.toLocaleString() : value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <AnimatedStatCard icon={Icon} label={label} value={value} sub={sub} />
);

const Stats = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<CensusYear>(2021);
  const data = censusData[selectedYear];

  const handleDownloadPDF = () => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        header, footer, nav, .no-print { display: none !important; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .recharts-wrapper { page-break-inside: avoid; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 500);
  };

  const genderData = [
    { name: 'Male', value: data.demographics.male },
    { name: 'Female', value: data.demographics.female },
  ];

  const ageData = [
    { name: '0–14 yrs', value: data.demographics.age0_14 },
    { name: '15–59 yrs', value: data.demographics.age15_59 },
    { name: '60+ yrs', value: data.demographics.age60plus },
  ];

  const economyData = [
    { name: 'Foreign Emp.', value: data.economy.foreignEmployment },
    { name: 'Business', value: data.economy.business },
    { name: 'Informal', value: data.economy.informalLabor },
    { name: 'Agriculture', value: data.economy.agriculture },
  ];

  const infraRadar = [
    { metric: 'Electricity', value: data.infrastructure.electricity },
    { metric: 'Water', value: data.infrastructure.drinkingWater },
    { metric: 'Roads', value: data.infrastructure.roadAccess },
    { metric: 'Internet', value: data.infrastructure.internetAccess },
  ];

  const enrollmentBreakdown = [
    { name: 'School', value: data.education.schoolStudents },
    { name: 'Madrasa', value: data.education.madrasaStudents },
  ];

  const genderEnrollment = [
    { name: 'Male', value: data.education.maleEnrollment },
    { name: 'Female', value: data.education.femaleEnrollment },
  ];

  return (
    <Layout>
      <SEOHead title="Statistics" description="Demographic data, population stats, and development indicators for Ramaul Village." path="/stats" />
      {/* Hero */}
      <div className="bg-primary text-primary-foreground pt-20 pb-12 md:pt-24 md:pb-16 px-4">
        <div className="container-village">
          <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground mb-4 -ml-3" onClick={() => navigate('/about')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to About
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-accent" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading">
              Ramaul — Statistics
            </h1>
          </div>
          <p className="text-primary-foreground/70 max-w-xl text-sm md:text-base">
            Demographic & Development Profile based on Census data & local estimates
          </p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-0">
              National Population & Housing Census 2078 (2021)
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent border-0">
              "Estimated" where not officially separated
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground/70 border-0">
              Last updated: 2026
            </Badge>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 no-print bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border-0"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-1.5" /> Download as PDF
          </Button>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-village">
          {/* Year selector */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground mr-2">Census Year:</span>
            {([2021, 2011, 2001] as CensusYear[]).map(yr => (
              <Button
                key={yr}
                variant={selectedYear === yr ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear(yr)}
              >
                {yr} ({censusData[yr].bsYear} BS)
              </Button>
            ))}
          </div>

          {/* General Overview Grid */}
          <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> General Overview — {data.label}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <StatCard icon={Users} label="Estimated Population" value={data.general.population} />
            <StatCard icon={Home} label="Estimated Households" value={data.general.households} />
            <StatCard icon={TreePine} label="Area" value={data.general.area} />
            <StatCard icon={TrendingUp} label="Pop. Density" value={data.general.populationDensity} />
            <StatCard icon={Users} label="Avg. Household Size" value={data.general.avgHouseholdSize} />
            <StatCard icon={MapPin} label="Province" value={data.general.province} />
            <StatCard icon={MapPin} label="Location" value={data.general.location} />
            <StatCard icon={MapPin} label="Elevation" value={data.general.elevation} />
          </div>

          {/* Tabs for detailed sections */}
          <Tabs defaultValue="demographics" className="mb-10">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="migration">Migration</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="compare">Compare Years</TabsTrigger>
            </TabsList>

            {/* DEMOGRAPHICS */}
            <TabsContent value="demographics">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gender Distribution</CardTitle>
                    <CardDescription>Sex ratio: {data.demographics.sexRatio} males per 100 females</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={genderData} cx="50%" cy="55%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                          {genderData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Age Structure</CardTitle>
                    <CardDescription>Population by age group (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(152, 45%, 28%)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Annual Growth Rate', value: `${data.demographics.growthRate}%` },
                      { label: 'Male %', value: `${data.demographics.male}%` },
                      { label: 'Female %', value: `${data.demographics.female}%` },
                      { label: 'Sex Ratio', value: `${data.demographics.sexRatio} per 100` },
                      { label: 'Youth (0-14)', value: `${data.demographics.age0_14}%` },
                      { label: 'Working Age (15-59)', value: `${data.demographics.age15_59}%` },
                      { label: 'Elderly (60+)', value: `${data.demographics.age60plus}%` },
                    ].map(m => (
                      <div key={m.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-semibold text-card-foreground">{m.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* EDUCATION */}
            <TabsContent value="education">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Literacy Rate</CardTitle>
                    <CardDescription>Municipal average ({data.year})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Overall Literacy', value: data.education.literacyRate },
                        { label: 'Male Literacy', value: data.education.maleLiteracy },
                        { label: 'Female Literacy', value: data.education.femaleLiteracy },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-bold text-card-foreground">{item.value}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Educational Institutions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Building2, label: 'Government Schools', value: data.education.governmentSchools },
                      { icon: Building2, label: 'Private Schools', value: data.education.privateSchools },
                      { icon: BookOpen, label: 'Madrasas', value: data.education.madrasas },
                      { icon: BookOpen, label: 'Higher Secondary Access', value: data.education.higherSecondary ? 'Yes' : 'No' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <item.icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
                        <span className="font-semibold text-card-foreground text-sm">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Enrollment Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" /> Enrollment Breakdown
                    </CardTitle>
                    <CardDescription>School vs Madrasa students (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={enrollmentBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                          {enrollmentBreakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold text-card-foreground">{data.education.enrollmentRate}%</p>
                        <p className="text-xs text-muted-foreground">Enrollment Rate</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold text-card-foreground">{data.education.dropoutRate}%</p>
                        <p className="text-xs text-muted-foreground">Dropout Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gender-wise enrollment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gender-wise Enrollment</CardTitle>
                    <CardDescription>Male vs Female student ratio (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={genderEnrollment}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {genderEnrollment.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3">
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={enrollmentComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="enrollment" name="Enrollment %" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="dropout" name="Dropout %" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="femaleRate" name="Female %" fill="hsl(38, 85%, 50%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-muted-foreground text-center mt-1">Enrollment trends across census years</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ECONOMY */}
            <TabsContent value="economy">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Occupation Distribution</CardTitle>
                    <CardDescription>Primary livelihood sources (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={economyData} cx="50%" cy="45%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                          {economyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Economic Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>🌍 <strong className="text-card-foreground">Foreign Employment</strong> — the primary income source. Majority of working-age men are employed in Gulf countries (Saudi Arabia, Qatar, UAE), Malaysia, and India, sending remittances that drive the local economy.</p>
                    <p>🏪 <strong className="text-card-foreground">Business & Retail</strong> — the second major livelihood. Ramaul Chowk hosts grocery shops, tailoring, mobile repair, electronics, and small trading businesses.</p>
                    <p>💼 <strong className="text-card-foreground">Informal Labor</strong> — construction work, daily wage labor, and transport services form a significant portion of local employment.</p>
                    <p>🌾 <strong className="text-card-foreground">Agriculture</strong> — once dominant, now a minor occupation. Some families still cultivate rice, wheat, and maize on the Terai plains, but dependency has reduced significantly.</p>
                    <p>🏦 <strong className="text-card-foreground">Cooperatives & Microfinance</strong> — growing presence, supporting small entrepreneurs and families of foreign workers.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* MIGRATION & REMITTANCE */}
            <TabsContent value="migration">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" /> Destination Countries
                    </CardTitle>
                    <CardDescription>Where Ramaul's workers go ({data.year})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={data.migration.destinations} cx="50%" cy="45%" outerRadius={80} dataKey="pct" nameKey="country" label={({ country, pct }) => `${country} ${pct}%`}>
                          {data.migration.destinations.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Migration Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-xl bg-primary/10">
                        <p className="text-2xl font-bold text-primary">{data.migration.totalMigrants.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Est. Total Migrants</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-accent/10">
                        <p className="text-2xl font-bold text-accent">{data.migration.remittanceDependency}%</p>
                        <p className="text-xs text-muted-foreground">Remittance Dependency</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                      <p className="text-sm font-semibold text-card-foreground">Est. Annual Remittance</p>
                      <p className="text-xl font-bold text-primary">NPR {data.migration.estimatedRemittanceNPR}</p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>🌍 Foreign employment has transformed Ramaul's economy — from a subsistence farming village to one heavily driven by remittances.</p>
                      <p>✈️ Gulf countries (Saudi Arabia, Qatar, UAE) are the top destinations, followed by Malaysia and seasonal migration to India.</p>
                      <p>💰 Remittances fund new housing, education, healthcare, and small businesses across the village.</p>
                      <p>⚠️ However, this creates dependency risks — families can struggle when workers face contract issues or return without savings.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Migration Growth Trend */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Migration & Remittance Growth (2001–2021)</CardTitle>
                    <CardDescription>Number of migrants and remittance dependency over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={migrationGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="migrants" name="Total Migrants" stroke="hsl(152, 45%, 28%)" fill="hsl(152, 45%, 28%)" fillOpacity={0.2} strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="remittancePct" name="Remittance Dep. %" stroke="hsl(38, 85%, 50%)" strokeWidth={3} dot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* HEALTH & SANITATION */}
            <TabsContent value="health">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" /> Health Indicators ({data.year})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Toilet Coverage', value: data.health.toiletCoverage, icon: '🚽' },
                        { label: 'Child Vaccination', value: data.health.childVaccination, icon: '💉' },
                        { label: 'Maternal Health Access', value: data.health.maternalHealthAccess, icon: '🤰' },
                        { label: 'Birth by Professional', value: data.health.birthAttendedByProfessional, icon: '👩‍⚕️' },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.icon} {item.label}</span>
                            <span className="font-bold text-card-foreground">{item.value}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Stethoscope, label: 'Health Posts / Clinics', value: `${data.infrastructure.healthPosts}` },
                      { icon: MapPin, label: 'Nearest Hospital', value: `${data.health.nearestHospitalKm} km`, sub: 'Siraha District Hospital' },
                      { icon: Baby, label: 'Under-5 Mortality', value: `${data.health.underFiveMortality} per 1,000`, sub: 'Estimated rate' },
                      { icon: Activity, label: 'Vaccination Coverage', value: `${data.health.childVaccination}%`, sub: 'DPT/Polio/BCG coverage' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <item.icon className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          {'sub' in item && item.sub && <p className="text-[10px] text-muted-foreground/60">{item.sub}</p>}
                        </div>
                        <span className="font-semibold text-card-foreground text-sm">{item.value}</span>
                      </div>
                    ))}
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p>🏥 Healthcare access has improved significantly since 2001, but gaps remain in maternal care and professional birth attendance.</p>
                      <p>💊 Most residents rely on the Siraha District Hospital for serious conditions. Local health posts provide basic treatment and immunization services.</p>
                      <p>🚰 Sanitation improvements driven by government programs and remittance-funded household upgrades have pushed toilet coverage from 15% (2001) to 85% (2021).</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Comparison Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Health Indicators Comparison (2001–2021)</CardTitle>
                    <CardDescription>Progress in sanitation, vaccination, and maternal care (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={healthComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="2001" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="2011" fill="hsl(38, 85%, 50%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="2021" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* INFRASTRUCTURE */}
            <TabsContent value="infrastructure">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Infrastructure Coverage (%)</CardTitle>
                    <CardDescription>Municipal average coverage rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={infraRadar}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Coverage" dataKey="value" stroke="hsl(152, 45%, 28%)" fill="hsl(152, 45%, 28%)" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Zap, label: 'Electricity Coverage', value: `${data.infrastructure.electricity}%` },
                      { icon: Droplets, label: 'Drinking Water Access', value: `${data.infrastructure.drinkingWater}%`, sub: 'Hand pumps / pipeline' },
                      { icon: MapPin, label: 'Road Access', value: `${data.infrastructure.roadAccess}%`, sub: 'Blacktop & gravel mix' },
                      { icon: Globe, label: 'Internet Access', value: `${data.infrastructure.internetAccess}%`, sub: 'Mobile data dominant' },
                      { icon: Building2, label: 'Health Posts / Clinics', value: `${data.infrastructure.healthPosts}` },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <item.icon className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          {item.sub && <p className="text-[10px] text-muted-foreground/60">{item.sub}</p>}
                        </div>
                        <span className="font-semibold text-card-foreground text-sm">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CULTURE */}
            <TabsContent value="culture">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Languages</CardTitle>
                    <CardDescription>Primary languages spoken (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={data.languages} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="pct" nameKey="name" label={({ name, pct }) => `${name} ${pct}%`}>
                          {data.languages.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Religion</CardTitle>
                    <CardDescription>Religious composition (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={data.religions} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="pct" nameKey="name" label={({ name, pct }) => `${name} ${pct}%`}>
                          {data.religions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Festivals & Traditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.festivals.map((f: string) => (
                        <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                          <Landmark className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm text-card-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            {/* COMPARE YEARS */}
            <TabsContent value="compare">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Population Growth (1991–2021)</CardTitle>
                    <CardDescription>Estimated population trend over decades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={populationGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="population" stroke="hsl(152, 45%, 28%)" strokeWidth={3} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Literacy Trend (2001–2021)</CardTitle>
                    <CardDescription>Total, Male & Female literacy rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={literacyComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="Overall" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="male" name="Male" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="female" name="Female" fill="hsl(38, 85%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Infrastructure Comparison (2001 vs 2011 vs 2021)</CardTitle>
                    <CardDescription>Coverage rates across census years (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={infrastructureComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="2001" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="2011" fill="hsl(38, 85%, 50%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="2021" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Summary table */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">At a Glance — All Years</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Metric</th>
                            <th className="text-center py-2 px-3 text-muted-foreground font-medium">2001</th>
                            <th className="text-center py-2 px-3 text-muted-foreground font-medium">2011</th>
                            <th className="text-center py-2 px-3 text-muted-foreground font-medium">2021</th>
                          </tr>
                        </thead>
                        <tbody className="text-card-foreground">
                          {[
                            { metric: 'Population', k2001: censusData[2001].general.population, k2011: censusData[2011].general.population, k2021: censusData[2021].general.population },
                            { metric: 'Households', k2001: censusData[2001].general.households, k2011: censusData[2011].general.households, k2021: censusData[2021].general.households },
                            { metric: 'Literacy Rate', k2001: `${censusData[2001].education.literacyRate}%`, k2011: `${censusData[2011].education.literacyRate}%`, k2021: `${censusData[2021].education.literacyRate}%` },
                            { metric: 'Male Literacy', k2001: `${censusData[2001].education.maleLiteracy}%`, k2011: `${censusData[2011].education.maleLiteracy}%`, k2021: `${censusData[2021].education.maleLiteracy}%` },
                            { metric: 'Female Literacy', k2001: `${censusData[2001].education.femaleLiteracy}%`, k2011: `${censusData[2011].education.femaleLiteracy}%`, k2021: `${censusData[2021].education.femaleLiteracy}%` },
                            { metric: 'Electricity', k2001: `${censusData[2001].infrastructure.electricity}%`, k2011: `${censusData[2011].infrastructure.electricity}%`, k2021: `${censusData[2021].infrastructure.electricity}%` },
                            { metric: 'Drinking Water', k2001: `${censusData[2001].infrastructure.drinkingWater}%`, k2011: `${censusData[2011].infrastructure.drinkingWater}%`, k2021: `${censusData[2021].infrastructure.drinkingWater}%` },
                            { metric: 'Growth Rate', k2001: `${censusData[2001].demographics.growthRate}%`, k2011: `${censusData[2011].demographics.growthRate}%`, k2021: `${censusData[2021].demographics.growthRate}%` },
                            { metric: 'Foreign Workers', k2001: `${censusData[2001].migration.totalMigrants}`, k2011: `${censusData[2011].migration.totalMigrants}`, k2021: `${censusData[2021].migration.totalMigrants}` },
                            { metric: 'Toilet Coverage', k2001: `${censusData[2001].health.toiletCoverage}%`, k2011: `${censusData[2011].health.toiletCoverage}%`, k2021: `${censusData[2021].health.toiletCoverage}%` },
                            { metric: 'Enrollment Rate', k2001: `${censusData[2001].education.enrollmentRate}%`, k2011: `${censusData[2011].education.enrollmentRate}%`, k2021: `${censusData[2021].education.enrollmentRate}%` },
                          ].map(row => (
                            <tr key={row.metric} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="py-2 px-3 font-medium">{row.metric}</td>
                              <td className="py-2 px-3 text-center">{row.k2001}</td>
                              <td className="py-2 px-3 text-center">{row.k2011}</td>
                              <td className="py-2 px-3 text-center font-semibold">{row.k2021}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Land Use section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" /> Land Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Agricultural Land', desc: 'Majority — rice, wheat, maize' },
                  { label: 'Residential', desc: 'Expanding with population growth' },
                  { label: 'Forest / Open', desc: 'Limited forest land remaining' },
                  { label: 'Elevation', desc: '80–100m above sea level' },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                    <h4 className="font-semibold text-card-foreground text-sm">{item.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
