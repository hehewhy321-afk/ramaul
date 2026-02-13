export interface Candidate {
  CandidateID: number;
  CandidateName: string;
  AGE_YR: number;
  Gender: string;
  PoliticalPartyName: string;
  SymbolName: string;
  DistrictName: string;
  StateName: string;
  STATE_ID: number;
  SCConstID: number;
  ConstName: number;
  QUALIFICATION: string;
  FATHER_NAME: string;
  SPOUCE_NAME: string;
  ADDRESS: string;
  EXPERIENCE: string;
  OTHERDETAILS: string;
  NAMEOFINST: string;
}

export const stateMap: Record<string, string> = {
  'कोशी प्रदेश': 'Koshi Pradesh',
  'मधेश प्रदेश': 'Madhesh Pradesh',
  'बागमती प्रदेश': 'Bagmati Pradesh',
  'गण्डकी प्रदेश': 'Gandaki Pradesh',
  'लुम्बिनी प्रदेश': 'Lumbini Pradesh',
  'कर्णाली प्रदेश': 'Karnali Pradesh',
  'सुदूरपश्चिम प्रदेश': 'Sudurpashchim Pradesh',
};

export const genderMap: Record<string, string> = {
  'पुरुष': 'Male',
  'महिला': 'Female',
};

export const qualificationGroups: Record<string, string[]> = {
  'MA / MR': ['एम.ए.', 'एमए', 'M.A', 'M.A.', 'MA', 'एम.ए', 'स्नातकोत्तर', 'स्नात्तकोतर', 'एम.बी.ए', 'MBA', 'M.D.', 'एम.डि', 'M.Sc', 'एम.एस्सी', 'Ph.D', 'पिएचडी', 'विद्यावारिधि', 'एम.बी.बी.एस', 'MBBS', 'एल.एल.एम', 'LLM', 'ईन्जिनेरिङ'],
  'Bachelors': ['स्नातक', 'B.A', 'B.A.', 'BA', 'बि.ए', 'बी.ए', 'B.Sc', 'BBS', 'B.Com', 'बि.कम', 'LL.B', 'एल.एल.बी', 'B.Ed', 'बि.एड', 'बी.एड', 'BE', 'B.E.'],
  'Intermediate': ['आई.ए.', 'I.A', 'I.A.', 'आ.ए', 'आई.ए', '+2', 'प्लस टु', 'I.s.c', 'I.Sc', 'आई.एस.सी', 'आ.एससी', 'PCL', 'प्रमाणपत्र', 'आई .कम', 'I.Com', 'आई.कम'],
  'SLC / SEE': ['SLC', 'S.L.C', 'एस.एल.सी', 'एस.एल.सी.', 'SEE', 'कक्षा १०', 'दशौं'],
  'Below SLC': ['कक्षा ८', 'कक्षा ७', 'कक्षा ६', 'कक्षा ५', 'कक्षा ४', 'कक्षा ३'],
  'Literate': ['साक्षर', 'लिटरेट'],
};

export function getQualificationGroup(qual: string): string {
  if (!qual) return 'Other';
  const q = qual.trim();
  for (const [group, keywords] of Object.entries(qualificationGroups)) {
    for (const kw of keywords) {
      if (q.toLowerCase().includes(kw.toLowerCase())) return group;
    }
  }
  // Fallback checks
  if (q.includes('स्नातकोत') || q.includes('मास्टर')) return 'MA / MR';
  if (q.includes('स्नातक') || q.includes('ग्राजुएड')) return 'Bachelors';
  return 'Other';
}

export function translateState(name: string, lang: string): string {
  return lang === 'en' ? (stateMap[name] || name) : name;
}

export function translateGender(name: string, lang: string): string {
  return lang === 'en' ? (genderMap[name] || name) : name;
}

export const MADHESH_STATE = 'मधेश प्रदेश';
export const SIRAHA_DISTRICT = 'सिराहा';
export const DEFAULT_AREA = 3;

export const qualificationOrder = ['MA / MR', 'Bachelors', 'Intermediate', 'SLC / SEE', 'Below SLC', 'Literate', 'Other'];

export const CHART_COLORS = [
  'hsl(152, 45%, 28%)', 'hsl(38, 85%, 50%)', 'hsl(200, 60%, 50%)',
  'hsl(340, 60%, 50%)', 'hsl(260, 50%, 55%)', 'hsl(80, 50%, 45%)',
  'hsl(20, 70%, 50%)', 'hsl(180, 40%, 40%)', 'hsl(300, 40%, 50%)',
];

export function getCandidateImageUrl(candidateId: number): string {
  return `https://result.election.gov.np/Images/Candidate/${candidateId}.jpg`;
}

// English transliterations for Siraha district candidate names
export const candidateNameMap: Record<string, string> = {
  'राम नरेश राय यादव': 'Ram Naresh Rai Yadav',
  'प्रमोद कुमार यादव': 'Pramod Kumar Yadav',
  'सुनिल कुमार यादव': 'Sunil Kumar Yadav',
  'रामबाबु यादव': 'Rambabu Yadav',
  'दिलीप कुमार यादव': 'Dilip Kumar Yadav',
  'रामजी प्रसाद यादव': 'Ramji Prasad Yadav',
  'मुन्ना लाल यादव': 'Munna Lal Yadav',
  'कुमार गौतम': 'Kumar Gautam',
  'मुकेश कुमार यादव': 'Mukesh Kumar Yadav',
  'शम्भु यादव': 'Shambhu Yadav',
  'डा. शम्भु यादव': 'Dr. Shambhu Yadav',
  'राम एकबाल राय': 'Ram Ekbal Rai',
  'मोहन लाल कर्ण': 'Mohan Lal Karna',
  'महेन्द्र कुमार यादव': 'Mahendra Kumar Yadav',
  'अरुण कुमार यादव': 'Arun Kumar Yadav',
  'राम बिनोद साह': 'Ram Binod Sah',
  'बबलु गुप्ता': 'Bablu Gupta',
  'शिव शंकर यादव': 'Shiv Shankar Yadav',
  'तपेश्वर यादव': 'Tapeshwar Yadav',
  'रामचन्द्र यादव': 'Ramchandra Yadav',
  'मनोज कुमार यादव': 'Manoj Kumar Yadav',
  'विजय कुमार यादव': 'Vijay Kumar Yadav',
  'रामप्रसाद यादव': 'Ramprasad Yadav',
  'लक्ष्मण यादव': 'Laxman Yadav',
  'दिनेश कुमार यादव': 'Dinesh Kumar Yadav',
  'राजदेव राय यादव': 'Rajdev Rai Yadav',
  'सत्यनारायण यादव': 'Satyanarayan Yadav',
  'जनक लाल दास': 'Janak Lal Das',
  'कमलेश कुमार साह': 'Kamlesh Kumar Sah',
  'राम बहादुर यादव': 'Ram Bahadur Yadav',
  'शेखर यादव': 'Shekhar Yadav',
  'प्रमोद महतो': 'Pramod Mahato',
  'उमेश यादव': 'Umesh Yadav',
  'विनोद यादव': 'Binod Yadav',
  'महेश यादव': 'Mahesh Yadav',
  'बिन्देश्वर यादव': 'Bindeshwar Yadav',
  'रवि यादव': 'Ravi Yadav',
  'सुरेश यादव': 'Suresh Yadav',
  'संजय यादव': 'Sanjay Yadav',
  'किशोर यादव': 'Kishor Yadav',
  'अशोक यादव': 'Ashok Yadav',
  'सुमित श्रेष्ठ': 'Sumit Shrestha',
  'बिजय कुमार राम': 'Bijay Kumar Ram',
  'पुजन कुमार सिंह': 'Pujan Kumar Singh',
  'सुभाष चन्द्र यादव': 'Subhash Chandra Yadav',
  'असेश्वर यादव': 'Aseshwar Yadav',
  'विश्‍वनाथ साह': 'Bishwanath Sah',
  'श्रवण पासवान': 'Shrawan Paswan',
  'अरविन्द कुमार यादव': 'Arbind Kumar Yadav',
  'राकेश कुमार यादव': 'Rakesh Kumar Yadav',
  'राम पुकार कामती': 'Ram Pukar Kamati',
  'सोभित कुमार यादव': 'Sobhit Kumar Yadav',
  'मन्चन महतो': 'Manchan Mahato',
  'राम बिलास यादव': 'Ram Bilas Yadav',
  'मिथिलेश कुमार सिंह': 'Mithilesh Kumar Singh',
  'राजेश कुमार यादव': 'Rajesh Kumar Yadav',
  'संतोष कुमार यादव': 'Santosh Kumar Yadav',
  'रामनरेश यादव': 'Ramnaresh Yadav',
  'रामविलास राय': 'Rambilas Rai',
  'बिनोद कुमार यादव': 'Binod Kumar Yadav',
  'धर्मेन्द्र यादव': 'Dharmendra Yadav',
  'सुरेन्द्र यादव': 'Surendra Yadav',
  'राजकुमार यादव': 'Rajkumar Yadav',
  'उपेन्द्र यादव': 'Upendra Yadav',
  'सन्तोष यादव': 'Santosh Yadav',
  'अनिल यादव': 'Anil Yadav',
  'रमेश यादव': 'Ramesh Yadav',
  'दीपक यादव': 'Deepak Yadav',
  'गोपाल यादव': 'Gopal Yadav',
  'नरेश यादव': 'Naresh Yadav',
  'जितेन्द्र यादव': 'Jitendra Yadav',
  'योगेन्द्र यादव': 'Yogendra Yadav',
  'कृष्ण यादव': 'Krishna Yadav',
  'भरत यादव': 'Bharat Yadav',
  'ललन यादव': 'Lalan Yadav',
  'रामदेव यादव': 'Ramdev Yadav',
  'सुरेश कुमार यादव': 'Suresh Kumar Yadav',
  'राजेश यादव': 'Rajesh Yadav',
  'कमलेश यादव': 'Kamlesh Yadav',
  'बिरेन्द्र यादव': 'Birendra Yadav',
  'मनोज यादव': 'Manoj Yadav',
  'रामचन्द्र साह': 'Ramchandra Sah',
  'दिनेश यादव': 'Dinesh Yadav',
  'लालबाबु यादव': 'Lalbabu Yadav',
  'रामबाबु राय यादव': 'Rambabu Rai Yadav',
  'श्याम सुन्दर यादव': 'Shyam Sundar Yadav',
  'राजकिशोर यादव': 'Rajkishor Yadav',
  'विजय यादव': 'Vijay Yadav',
  'अशोक कुमार यादव': 'Ashok Kumar Yadav',
  'ज्ञानेन्द्र यादव': 'Gyanendra Yadav',
  'सुनिल यादव': 'Sunil Yadav',
  'रवीन्द्र यादव': 'Rabindra Yadav',
  'रामेश्वर यादव': 'Rameshwar Yadav',
  'मुकुन्द यादव': 'Mukund Yadav',
  'हरि यादव': 'Hari Yadav',
  'शिवनारायण यादव': 'Shivnarayan Yadav',
  'राम सुन्दर यादव': 'Ram Sundar Yadav',
  'राम नारायण यादव': 'Ram Narayan Yadav',
  'चन्द्र किशोर यादव': 'Chandra Kishor Yadav',
};

// English transliterations for common party names
export const partyNameMap: Record<string, string> = {
  'नेपाली काँग्रेस': 'Nepali Congress',
  'नेकपा (एमाले)': 'CPN (UML)',
  'नेकपा (माओवादी केन्द्र)': 'CPN (Maoist Centre)',
  'राष्ट्रिय स्वतन्त्र पार्टी': 'Rastriya Swatantra Party',
  'जनता समाजवादी पार्टी, नेपाल': 'Janata Samajbadi Party',
  'लोकतान्त्रिक समाजवादी पार्टी, नेपाल': 'Loktantrik Samajbadi Party',
  'राष्ट्रिय प्रजातन्त्र पार्टी': 'Rastriya Prajatantra Party',
  'नेकपा (एकीकृत समाजवादी)': 'CPN (Unified Socialist)',
  'जनमत पार्टी': 'Janamat Party',
  'नागरिक उन्मुक्ति पार्टी': 'Nagarik Unmukti Party',
  'राष्ट्रिय जनमोर्चा': 'Rastriya Janamorcha',
  'नेपाल मजदुर किसान पार्टी': 'Nepal Majdoor Kisan Party',
  'स्वतन्त्र': 'Independent',
  'प्रगतिशील लोकतान्त्रिक मोर्चा नेपाल': 'Progressive Democratic Front Nepal',
  'नेपाली कम्युनिष्ट पार्टी': 'Nepal Communist Party',
  'उज्यालो नेपाल पार्टी': 'Ujyalo Nepal Party',
  'राष्ट्रिय जनता पार्टी': 'Rastriya Janata Party',
  'तराई मधेश लोकतान्त्रिक पार्टी': 'Tarai Madhesh Loktantrik Party',
  'समाजवादी जनता पार्टी': 'Samajbadi Janata Party',
  'संघीय समाजवादी फोरम': 'Sanghiya Samajbadi Forum',
  'हाम्रो नेपाली पार्टी': 'Hamro Nepali Party',
  'राष्ट्रिय जनमुक्ति पार्टी': 'Rastriya Janamukti Party',
  'नेपाल सद्भावना पार्टी': 'Nepal Sadbhawana Party',
  'जनकल्याण पार्टी': 'Janakalyan Party',
};

export const PARTY_COLORS: Record<string, string> = {
  'नेपाली काँग्रेस': 'hsl(142, 70%, 35%)',           // Green
  'नेकपा (एमाले)': 'hsl(0, 84%, 60%)',             // Red
  'नेकपा (माओवादी केन्द्र)': 'hsl(0, 100%, 45%)',    // Dark Red
  'राष्ट्रिय स्वतन्त्र पार्टी': 'hsl(217, 91%, 60%)', // Blue
  'जनता समाजवादी पार्टी, नेपाल': 'hsl(45, 93%, 47%)', // Yellow/Orange
  'लोकतान्त्रिक समाजवादी पार्टी, नेपाल': 'hsl(14, 91%, 55%)', // Orange-Red
  'राष्ट्रिय प्रजातन्त्र पार्टी': 'hsl(210, 100%, 40%)', // Royal Blue
  'नेकपा (एकीकृत समाजवादी)': 'hsl(350, 80%, 50%)',   // Crimson
  'जनमत पार्टी': 'hsl(142, 60%, 45%)',             // Light Green
  'नागरिक उन्मुक्ति पार्टी': 'hsl(180, 70%, 40%)',   // Teal
  'स्वतन्त्र': 'hsl(0, 0%, 45%)',                   // Grey
  'default': 'hsl(210, 20%, 50%)',                 // Fallback
};

export function translateCandidateName(name: string, lang: string): string {
  if (lang !== 'en') return name;
  return candidateNameMap[name] || name;
}

export function translatePartyName(name: string, lang: string): string {
  if (lang !== 'en') return name;
  return partyNameMap[name] || name;
}

export const ITEMS_PER_PAGE = 12;
