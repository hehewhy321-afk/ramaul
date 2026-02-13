import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis
} from '@/components/ui/pagination';
import { Users, Flag, MapPin, TrendingUp, Search, X, GitCompareArrows, GraduationCap, Calendar, User, Building, Briefcase, Home, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  Candidate, stateMap, translateState, translateGender,
  getQualificationGroup, MADHESH_STATE, SIRAHA_DISTRICT, DEFAULT_AREA,
  qualificationOrder, CHART_COLORS, PARTY_COLORS, getCandidateImageUrl,
  translateCandidateName, translatePartyName, ITEMS_PER_PAGE
} from '@/lib/electionUtils';

const Elections = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ne' ? 'ne' : 'en';

  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(MADHESH_STATE);
  const [selectedDistrict, setSelectedDistrict] = useState(SIRAHA_DISTRICT);
  const [selectedArea, setSelectedArea] = useState<string>(String(DEFAULT_AREA));
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedQualification, setSelectedQualification] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<number[]>([20, 90]);
  const [sortBy, setSortBy] = useState<string>('education_age');
  const [compareCandidates, setCompareCandidates] = useState<Candidate[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/data/election2082.json')
      .then(r => r.json())
      .then((data: Candidate[]) => {
        setAllCandidates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const states = useMemo(() => {
    const s = new Set(allCandidates.map(c => c.StateName));
    return Array.from(s).sort();
  }, [allCandidates]);

  const districts = useMemo(() => {
    const d = new Set(allCandidates.filter(c => c.StateName === selectedState).map(c => c.DistrictName));
    return Array.from(d).sort();
  }, [allCandidates, selectedState]);

  const areas = useMemo(() => {
    const a = new Set(
      allCandidates
        .filter(c => {
          if (c.StateName !== selectedState) return false;
          if (selectedDistrict !== 'all' && c.DistrictName !== selectedDistrict) return false;
          return true;
        })
        .map(c => String(c.ConstName))
    );
    return Array.from(a).sort((a, b) => Number(a) - Number(b));
  }, [allCandidates, selectedState, selectedDistrict]);

  const parties = useMemo(() => {
    let base = allCandidates.filter(c => {
      if (c.StateName !== selectedState) return false;
      if (selectedDistrict !== 'all' && c.DistrictName !== selectedDistrict) return false;
      return true;
    });
    if (selectedArea !== 'all') base = base.filter(c => String(c.ConstName) === selectedArea);
    const p = new Set(base.map(c => c.PoliticalPartyName));
    return Array.from(p).sort();
  }, [allCandidates, selectedState, selectedDistrict, selectedArea]);

  const filtered = useMemo(() => {
    let result = allCandidates.filter(c => {
      if (c.StateName !== selectedState) return false;
      if (selectedDistrict !== 'all' && c.DistrictName !== selectedDistrict) return false;
      if (selectedArea !== 'all' && String(c.ConstName) !== selectedArea) return false;
      if (selectedParty !== 'all' && c.PoliticalPartyName !== selectedParty) return false;
      if (selectedGender !== 'all' && c.Gender !== selectedGender) return false;
      if (selectedQualification !== 'all' && getQualificationGroup(c.QUALIFICATION) !== selectedQualification) return false;
      if (c.AGE_YR < ageRange[0] || c.AGE_YR > ageRange[1]) return false;
      if (search) {
        const s = search.toLowerCase();
        const candidateName = translateCandidateName(c.CandidateName, 'en').toLowerCase();
        const partyName = translatePartyName(c.PoliticalPartyName, 'en').toLowerCase();
        if (!c.CandidateName.toLowerCase().includes(s) && !c.PoliticalPartyName.toLowerCase().includes(s) && !candidateName.includes(s) && !partyName.includes(s)) return false;
      }
      return true;
    });

    if (sortBy === 'education_age') {
      result.sort((a, b) => {
        const qa = qualificationOrder.indexOf(getQualificationGroup(a.QUALIFICATION));
        const qb = qualificationOrder.indexOf(getQualificationGroup(b.QUALIFICATION));
        if (qa !== qb) return qa - qb;
        return a.AGE_YR - b.AGE_YR;
      });
    } else if (sortBy === 'age_asc') {
      result.sort((a, b) => a.AGE_YR - b.AGE_YR);
    } else if (sortBy === 'age_desc') {
      result.sort((a, b) => b.AGE_YR - a.AGE_YR);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.CandidateName.localeCompare(b.CandidateName));
    } else if (sortBy === 'party') {
      result.sort((a, b) => a.PoliticalPartyName.localeCompare(b.PoliticalPartyName));
    }

    return result;
  }, [allCandidates, selectedState, selectedDistrict, selectedArea, selectedParty, selectedGender, selectedQualification, ageRange, search, sortBy]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [selectedState, selectedDistrict, selectedArea, selectedParty, selectedGender, selectedQualification, ageRange, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const partyChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(c => { counts[c.PoliticalPartyName] = (counts[c.PoliticalPartyName] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
      const display = lang === 'en' ? translatePartyName(name, 'en') : name;
      return {
        name: display.length > 20 ? display.slice(0, 20) + '…' : display,
        fullName: lang === 'en' ? translatePartyName(name, 'en') : name,
        count,
        originalName: name
      };
    });
  }, [filtered, lang]);

  const qualChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(c => {
      const g = getQualificationGroup(c.QUALIFICATION);
      counts[g] = (counts[g] || 0) + 1;
    });
    return qualificationOrder.filter(q => counts[q]).map(q => ({ name: q, value: counts[q] }));
  }, [filtered]);

  const genderChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(c => { counts[c.Gender] = (counts[c.Gender] || 0) + 1; });
    const total = filtered.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name: lang === 'en' ? translateGender(name, 'en') : name,
      count,
      pct: ((count / total) * 100).toFixed(1),
    }));
  }, [filtered, lang]);

  const ageChartData = useMemo(() => {
    const brackets = [
      { label: '20-29', min: 20, max: 29 },
      { label: '30-39', min: 30, max: 39 },
      { label: '40-49', min: 40, max: 49 },
      { label: '50-59', min: 50, max: 59 },
      { label: '60-70', min: 60, max: 70 },
    ];

    const data = brackets.map(b => {
      const candidates = filtered.filter(c => c.AGE_YR >= b.min && c.AGE_YR <= b.max);
      return {
        name: b.label,
        count: candidates.length,
        candidates: candidates.map(c => ({
          id: c.CandidateID,
          name: lang === 'en' ? translateCandidateName(c.CandidateName, 'en') : c.CandidateName
        }))
      };
    });

    return data;
  }, [filtered, lang]);

  const AgeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-xl max-w-[240px] max-h-[300px] overflow-y-auto">
          <p className="font-bold text-xs mb-2 border-b pb-1">
            {data.name} {lang === 'en' ? 'Age Group' : 'उमेर समूह'} ({data.count})
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {data.candidates.map((c: any) => (
              <div key={c.id} className="flex items-center gap-2 text-[10px] leading-tight">
                <Avatar className="w-5 h-5 flex-shrink-0">
                  <AvatarImage src={getCandidateImageUrl(c.id)} alt={c.name} />
                  <AvatarFallback className="text-[8px]">{c.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate font-medium">{c.name}</span>
              </div>
            ))}
          </div>
          {data.count === 0 && <p className="text-muted-foreground text-[10px] italic">{lang === 'en' ? 'No candidates' : 'कोही छैन'}</p>}
        </div>
      );
    }
    return null;
  };

  const uniqueParties = new Set(filtered.map(c => c.PoliticalPartyName)).size;
  const uniqueDistricts = new Set(allCandidates.filter(c => c.StateName === selectedState).map(c => c.DistrictName)).size;

  const toggleCompare = (c: Candidate) => {
    setCompareCandidates(prev => {
      const exists = prev.find(x => x.CandidateID === c.CandidateID);
      if (exists) return prev.filter(x => x.CandidateID !== c.CandidateID);
      if (prev.length >= 3) return prev;
      return [...prev, c];
    });
  };

  const clearFilters = () => {
    setSelectedState(MADHESH_STATE);
    setSelectedDistrict(SIRAHA_DISTRICT);
    setSelectedArea(String(DEFAULT_AREA));
    setSelectedParty('all');
    setSelectedGender('all');
    setSelectedQualification('all');
    setAgeRange([20, 90]);
    setSearch('');
  };

  const activeFilterCount = [
    selectedParty !== 'all',
    selectedGender !== 'all',
    selectedQualification !== 'all',
    ageRange[0] !== 20 || ageRange[1] !== 90,
  ].filter(Boolean).length + 3;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === 'en' ? 'Loading election data...' : 'निर्वाचन डाटा लोड हुँदैछ...'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Elections 2082" description="Election results and candidate information for Ramaul Village local elections." path="/elections" />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container-village px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {lang === 'en' ? 'Nepal Election Candidates Dashboard' : 'निर्वाचन उम्मेदवार ड्यासबोर्ड'}
            </h1>
            <p className="text-base text-muted-foreground">
              {lang === 'en'
                ? 'Explore candidates by district, province, and party • Election 2082'
                : 'जिल्ला, प्रदेश र पार्टी अनुसार उम्मेदवारहरू अन्वेषण गर्नुहोस् • निर्वाचन २०८२'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Total Candidates' : 'जम्मा उम्मेदवार'}</p>
                    <p className="text-3xl font-bold text-foreground">{filtered.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Political Parties' : 'राजनीतिक दलहरू'}</p>
                    <p className="text-3xl font-bold text-foreground">{uniqueParties}</p>
                  </div>
                  <Flag className="h-8 w-8 text-accent/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Districts' : 'जिल्लाहरू'}</p>
                    <p className="text-3xl font-bold text-foreground">{uniqueDistricts}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Provinces' : 'प्रदेशहरू'}</p>
                    <p className="text-3xl font-bold text-foreground">{states.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground">{lang === 'en' ? 'Filters' : 'फिल्टर'}</h3>
                  <Badge variant="secondary" className="text-xs">{activeFilterCount}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm gap-1">
                  <X className="h-3.5 w-3.5" /> {lang === 'en' ? 'Clear all' : 'सबै हटाउनुहोस्'}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedDistrict(''); setSelectedArea('all'); setSelectedParty('all'); }}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Province' : 'प्रदेश'} /></SelectTrigger>
                  <SelectContent>
                    {states.map(s => <SelectItem key={s} value={s}>{lang === 'en' ? translateState(s, 'en') : s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedDistrict} onValueChange={(v) => { setSelectedDistrict(v); setSelectedArea('all'); setSelectedParty('all'); }}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'District' : 'जिल्ला'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === 'en' ? 'All Districts' : 'सबै जिल्ला'}</SelectItem>
                    {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedArea} onValueChange={(v) => { setSelectedArea(v); setSelectedParty('all'); }}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Area' : 'क्षेत्र'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === 'en' ? 'All Areas' : 'सबै क्षेत्र'}</SelectItem>
                    {areas.map(a => <SelectItem key={a} value={a}>{lang === 'en' ? `Area ${a}` : `क्षेत्र ${a}`}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedParty} onValueChange={setSelectedParty}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Party' : 'पार्टी'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === 'en' ? 'All Parties' : 'सबै पार्टीहरू'}</SelectItem>
                    {parties.map(p => <SelectItem key={p} value={p}>{lang === 'en' ? translatePartyName(p, 'en') : p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Gender' : 'लिङ्ग'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === 'en' ? 'All Genders' : 'सबै लिङ्ग'}</SelectItem>
                    <SelectItem value="पुरुष">{lang === 'en' ? 'Male' : 'पुरुष'}</SelectItem>
                    <SelectItem value="महिला">{lang === 'en' ? 'Female' : 'महिला'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={selectedQualification} onValueChange={setSelectedQualification}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Qualification' : 'शैक्षिक योग्यता'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === 'en' ? 'All Qualifications' : 'सबै योग्यता'}</SelectItem>
                    {qualificationOrder.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder={lang === 'en' ? 'Sort By' : 'क्रमबद्ध'} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education_age">{lang === 'en' ? 'Education & Age ↑' : 'शिक्षा र उमेर ↑'}</SelectItem>
                    <SelectItem value="age_asc">{lang === 'en' ? 'Age (Low → High)' : 'उमेर (कम → बढी)'}</SelectItem>
                    <SelectItem value="age_desc">{lang === 'en' ? 'Age (High → Low)' : 'उमेर (बढी → कम)'}</SelectItem>
                    <SelectItem value="name">{lang === 'en' ? 'Name (A-Z)' : 'नाम (A-Z)'}</SelectItem>
                    <SelectItem value="party">{lang === 'en' ? 'Party' : 'पार्टी'}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Age' : 'उमेर'}: {ageRange[0]} - {ageRange[1]}</p>
                  <Slider min={20} max={90} step={1} value={ageRange} onValueChange={setAgeRange} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{lang === 'en' ? 'Candidates by Party' : 'पार्टी अनुसार उम्मेदवार'}</CardTitle>
              </CardHeader>
              <CardContent>
                {partyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={Math.max(200, partyChartData.length * 30)}>
                    <BarChart data={partyChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number, _: string, props: any) => [value, props.payload.fullName]} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {partyChartData.map((d: any, i: number) => (
                          <Cell key={`cell-${i}`} fill={PARTY_COLORS[d.originalName] || PARTY_COLORS['default']} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-sm text-muted-foreground text-center py-8">{lang === 'en' ? 'No data' : 'डाटा छैन'}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{lang === 'en' ? 'Qualification Distribution' : 'शैक्षिक योग्यता'}</CardTitle>
              </CardHeader>
              <CardContent>
                {qualChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={qualChartData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine>
                        {qualChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-sm text-muted-foreground text-center py-8">{lang === 'en' ? 'No data' : 'डाटा छैन'}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{lang === 'en' ? 'Gender Distribution' : 'लिङ्ग वितरण'}</CardTitle>
              </CardHeader>
              <CardContent>
                {genderChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={genderChartData} margin={{ bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                      <YAxis />
                      <Tooltip formatter={(value: number, _: string, props: any) => [`${value} (${props.payload.pct}%)`, '']} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {genderChartData.map((_, i) => <Cell key={i} fill={i === 0 ? 'hsl(200, 60%, 50%)' : 'hsl(340, 60%, 50%)'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : null}
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  {genderChartData.map((g, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? 'hsl(200, 60%, 50%)' : 'hsl(340, 60%, 50%)' }} />
                      {g.name}: {g.pct}%
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{lang === 'en' ? 'Candidate by Age' : 'उमेर अनुसार उम्मेदवार'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ageChartData} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis />
                    <Tooltip content={<AgeTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {ageChartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center text-xs text-muted-foreground mt-2">
                  {lang === 'en' ? 'Age Brackets (Years)' : 'उमेर समूह (वर्ष)'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidate List Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">{lang === 'en' ? 'Candidates' : 'उम्मेदवारहरू'}</h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length} {lang === 'en' ? 'candidates found' : 'उम्मेदवार भेटिए'}
                {totalPages > 1 && ` • ${lang === 'en' ? `Page ${currentPage} of ${totalPages}` : `पृष्ठ ${currentPage} / ${totalPages}`}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={lang === 'en' ? 'Search name or party...' : 'नाम वा पार्टी खोज्नुहोस्...'}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 w-60 text-sm"
                />
              </div>
              {compareCandidates.length > 0 && (
                <Button onClick={() => setShowCompare(true)} className="gap-1.5" size="sm">
                  <GitCompareArrows className="h-4 w-4" />
                  {lang === 'en' ? `Compare (${compareCandidates.length})` : `तुलना (${compareCandidates.length})`}
                </Button>
              )}
            </div>
          </div>

          {/* Candidate Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedCandidates.map(c => {
              const isSelected = compareCandidates.some(x => x.CandidateID === c.CandidateID);
              const displayName = lang === 'en' ? translateCandidateName(c.CandidateName, 'en') : c.CandidateName;
              const displayParty = lang === 'en' ? translatePartyName(c.PoliticalPartyName, 'en') : c.PoliticalPartyName;
              return (
                <Card key={c.CandidateID} className={`transition-all hover:shadow-md cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedCandidate(c)}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-14 h-14 flex-shrink-0">
                        <AvatarImage src={getCandidateImageUrl(c.CandidateID)} alt={displayName} />
                        <AvatarFallback className="text-lg font-bold text-primary bg-muted">
                          {displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-base truncate">{displayName}</h3>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <Badge variant="default" className="text-xs px-2 py-0.5">
                            {displayParty.length > 22 ? displayParty.slice(0, 22) + '…' : displayParty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">{c.SymbolName}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.DistrictName} · {lang === 'en' ? 'Area' : 'क्षेत्र'} {c.ConstName}</div>
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{c.AGE_YR} {lang === 'en' ? 'yrs' : 'वर्ष'}</div>
                      <div className="flex items-center gap-1.5 col-span-2"><GraduationCap className="h-3.5 w-3.5" />{c.QUALIFICATION || '-'}</div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs h-7"
                        onClick={(e) => { e.stopPropagation(); toggleCompare(c); }}
                        disabled={!isSelected && compareCandidates.length >= 3}
                      >
                        {isSelected ? (lang === 'en' ? '✓ Selected' : '✓ छानिएको') : (lang === 'en' ? 'Compare' : 'तुलना')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mb-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-base">{lang === 'en' ? 'No candidates found for the selected filters.' : 'चयन गरिएको फिल्टरमा कुनै उम्मेदवार भेटिएन।'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (() => {
            const c = selectedCandidate;
            const dn = lang === 'en' ? translateCandidateName(c.CandidateName, 'en') : c.CandidateName;
            const dp = lang === 'en' ? translatePartyName(c.PoliticalPartyName, 'en') : c.PoliticalPartyName;
            const detailRows = [
              { icon: Calendar, label: lang === 'en' ? 'Age' : 'उमेर (Age)', value: `${c.AGE_YR} ${lang === 'en' ? 'years' : 'वर्ष'}` },
              { icon: User, label: lang === 'en' ? 'Gender' : 'लिङ्ग (Gender)', value: lang === 'en' ? translateGender(c.Gender, 'en') : c.Gender },
              { icon: Flag, label: lang === 'en' ? 'Party' : 'पार्टी (Party)', value: dp },
              { icon: TrendingUp, label: lang === 'en' ? 'Province' : 'प्रदेश (Province)', value: lang === 'en' ? translateState(c.StateName, 'en') : c.StateName },
              { icon: MapPin, label: lang === 'en' ? 'District' : 'जिल्ला (District)', value: `${c.DistrictName} · ${lang === 'en' ? 'Area' : 'क्षेत्र'} ${c.ConstName}` },
              { icon: GraduationCap, label: lang === 'en' ? 'Qualification' : 'शैक्षिक योग्यता (Qualification)', value: c.QUALIFICATION || '-' },
              { icon: Building, label: lang === 'en' ? 'Institution' : 'शिक्षण संस्था (Institution)', value: c.NAMEOFINST || '-' },
              { icon: Briefcase, label: lang === 'en' ? 'Experience' : 'अनुभव (Experience)', value: c.EXPERIENCE || '-' },
              { icon: Home, label: lang === 'en' ? 'Address' : 'ठेगाना (Address)', value: c.ADDRESS || '-' },
              { icon: User, label: lang === 'en' ? 'Father' : 'बुबाको नाम (Father)', value: c.FATHER_NAME || '-' },
              { icon: Heart, label: lang === 'en' ? 'Spouse' : 'पति/पत्नी (Spouse)', value: c.SPOUCE_NAME || '-' },
            ];
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={getCandidateImageUrl(c.CandidateID)}
                      alt={dn}
                      className="w-20 h-24 object-cover rounded-lg border bg-muted"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                      <DialogTitle className="text-xl">{dn}</DialogTitle>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="default" className="text-sm">{dp}</Badge>
                        <Badge variant="secondary" className="text-sm">{lang === 'en' ? 'Symbol' : 'चिन्ह'}: {c.SymbolName}</Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                <Separator className="my-2" />
                <div className="space-y-1">
                  {detailRows.map((row, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <row.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{row.label}</p>
                        <p className="text-sm font-medium text-foreground">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lang === 'en' ? 'Compare Candidates' : 'उम्मेदवार तुलना'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-muted-foreground font-medium">{lang === 'en' ? 'Details' : 'विवरण'}</th>
                  {compareCandidates.map(c => (
                    <th key={c.CandidateID} className="text-left p-2 min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getCandidateImageUrl(c.CandidateID)} alt={c.CandidateName} />
                          <AvatarFallback className="text-sm">{c.CandidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-foreground text-sm">
                          {lang === 'en' ? translateCandidateName(c.CandidateName, 'en') : c.CandidateName}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-destructive" onClick={() => toggleCompare(c)}>
                        {lang === 'en' ? 'Remove' : 'हटाउनुहोस्'}
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { label: lang === 'en' ? 'Party' : 'पार्टी', key: 'PoliticalPartyName', translate: true },
                  { label: lang === 'en' ? 'Symbol' : 'चिन्ह', key: 'SymbolName' },
                  { label: lang === 'en' ? 'Age' : 'उमेर', key: 'AGE_YR' },
                  { label: lang === 'en' ? 'Gender' : 'लिङ्ग', key: 'Gender', gender: true },
                  { label: lang === 'en' ? 'Qualification' : 'योग्यता', key: 'QUALIFICATION' },
                  { label: lang === 'en' ? 'Institution' : 'संस्था', key: 'NAMEOFINST' },
                  { label: lang === 'en' ? 'District' : 'जिल्ला', key: 'DistrictName' },
                  { label: lang === 'en' ? 'Area' : 'क्षेत्र', key: 'ConstName' },
                  { label: lang === 'en' ? 'Father' : 'बुबाको नाम', key: 'FATHER_NAME' },
                  { label: lang === 'en' ? 'Spouse' : 'पति/पत्नी', key: 'SPOUCE_NAME' },
                  { label: lang === 'en' ? 'Address' : 'ठेगाना', key: 'ADDRESS' },
                  { label: lang === 'en' ? 'Experience' : 'अनुभव', key: 'EXPERIENCE' },
                ].map(row => (
                  <tr key={row.key} className="border-b">
                    <td className="p-2 font-medium text-muted-foreground">{row.label}</td>
                    {compareCandidates.map(c => {
                      const val = String((c as any)[row.key] || '-');
                      let display = val;
                      if (row.gender) display = lang === 'en' ? translateGender(val, 'en') : val;
                      else if (row.translate && lang === 'en') display = translatePartyName(val, 'en');
                      return <td key={c.CandidateID} className="p-2 text-foreground">{display}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Elections;
