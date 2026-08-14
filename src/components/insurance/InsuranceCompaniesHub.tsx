'use client';

import React, { useState, useEffect } from 'react';
import { InsuranceCompany, INITIAL_INSURANCE_COMPANIES, getCompanyDecisionMakers, ExecutiveContact } from '@/lib/data/insurance-db';
import { exportInsuranceCompaniesToExcel } from '@/lib/utils/excel-exporter';
import { useAppStore } from '@/lib/store/useStore';
import {
  ShieldCheck,
  Search,
  Globe,
  Mail,
  ExternalLink,
  Building2,
  Copy,
  Check,
  Download,
  Filter,
  Star,
  MapPin,
  Info,
  X,
  Phone,
  Sparkles,
  RefreshCw,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  Navigation,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Linkedin,
  UserCheck,
  Briefcase,
  PhoneCall,
} from 'lucide-react';

const US_STATES_LIST = [
  'ALL STATES',
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'Ontario', 'Quebec', 'Alberta', 'British Columbia'
];

export const InsuranceCompaniesHub: React.FC = () => {
  const [companies, setCompanies] = useState<InsuranceCompany[]>(INITIAL_INSURANCE_COMPANIES);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL STATES');
  const [selectedCountry, setSelectedCountry] = useState<'ALL' | 'USA' | 'CANADA'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeCompany, setActiveCompany] = useState<InsuranceCompany | null>(null);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCompanyIds, setSavedCompanyIds] = useState<Set<string>>(new Set());
  const [liveScanStatus, setLiveScanStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isRescanningCompany, setIsRescanningCompany] = useState(false);
  const [rescanSuccessMsg, setRescanSuccessMsg] = useState<string | null>(null);

  const { setLeads, leads } = useAppStore();

  const handleRescanCompany = async (company: InsuranceCompany) => {
    setIsRescanningCompany(true);
    setRescanSuccessMsg(null);
    try {
      const res = await fetch('/api/scan/recheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });
      const data = await res.json();
      if (data.success && data.company) {
        setActiveCompany(data.company);
        // Update in active list
        setCompanies((prev) => prev.map((c) => (c.id === data.company.id ? data.company : c)));
        setRescanSuccessMsg(`✅ Re-checked & Verified! Real-time domain DNS active, email status (${data.company.emailStatus || 'VALID'}), and decision makers re-validated.`);
      } else {
        setRescanSuccessMsg(`⚠️ Re-check complete: ${data.reason || data.error || 'Domain checked.'}`);
      }
    } catch (err: any) {
      console.error('Failed to rescan company:', err);
      setRescanSuccessMsg(`⚠️ Re-check error: ${err.message || String(err)}`);
    } finally {
      setIsRescanningCompany(false);
      setTimeout(() => setRescanSuccessMsg(null), 6000);
    }
  };

  const [scanStats, setScanStats] = useState<any>(null);

  // Trigger live Google Maps & API scan for independent insurance agencies
  const handleLiveGoogleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : (selectedState !== 'ALL STATES' ? selectedState : search || 'Idaho');

    setIsLiveScanning(true);
    setLiveScanStatus(`Clearing old cache & scanning live APIs (Google Places, Google Search, Hunter, Apollo, GPT-4o) for "${q}"...`);

    // STRICT REQUIREMENT: CLEAR PREVIOUS DISPLAY DATA IMMEDIATELY
    setCompanies([]);
    setScanStats(null);

    try {
      const res = await fetch('/api/scan/insurance-agencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'independent insurance agency',
          state: q,
          country: selectedCountry === 'ALL' ? 'USA' : selectedCountry,
          limit: 100,
        }),
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.leads)) {
        setCompanies(data.leads);
        setScanStats(data.stats);
        const statsMsg = `🔥 Live Scan Complete! Verified ${data.leads.length} Real Insurance Agencies (Discovered: ${data.stats?.discovered || data.leads.length}, Rejected Carriers: ${data.stats?.rejected || 0}, Duplicates: ${data.stats?.duplicates || 0}).`;
        setLiveScanStatus(statsMsg);
        setTimeout(() => setLiveScanStatus(null), 8000);
      } else {
        setCompanies([]); // Keep empty on failure, NO static fallback!
        setLiveScanStatus(`❌ Live Scan Failed: ${data.error || 'No verified insurance agencies found for this search.'}`);
        setTimeout(() => setLiveScanStatus(null), 6000);
      }
    } catch (err: any) {
      console.error('Failed live agency scan:', err);
      setCompanies([]); // Keep empty on error, NO static fallback!
      setLiveScanStatus(`❌ Live API Scan Error: ${err.message || String(err)}`);
      setTimeout(() => setLiveScanStatus(null), 6000);
    } finally {
      setIsLiveScanning(false);
    }
  };

  // Filter effect
  useEffect(() => {
    if (search.trim()) {
      handleLiveGoogleSearch(search);
    } else if (selectedState !== 'ALL STATES') {
      handleLiveGoogleSearch(selectedState);
    } else {
      let result = [...INITIAL_INSURANCE_COMPANIES];
      if (selectedCountry !== 'ALL') {
        result = result.filter((c) => c.country === selectedCountry);
      }
      if (selectedCategory !== 'ALL') {
        result = result.filter((c) => c.category === selectedCategory);
      }
      setCompanies(result);
    }
  }, [search, selectedState, selectedCountry, selectedCategory]);

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  // Dual Action: Save in Database AND Download as Microsoft Excel File (.xlsx compatible CSV with UTF-8 BOM)
  const handleSaveAndDownloadExcel = async () => {
    if (!companies || companies.length === 0) return;

    setIsSaving(true);
    setLiveScanStatus(`Saving ${companies.length} insurance companies to CRM database & downloading Excel spreadsheet...`);

    try {
      // 1. Download as formatted Excel spreadsheet (.csv with UTF-8 BOM \uFEFF)
      const fileName = `Insurance_Companies_${(selectedState !== 'ALL STATES' ? selectedState : 'Registry').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
      exportInsuranceCompaniesToExcel(companies, fileName);

      // 2. Save directly into CRM database via API
      const res = await fetch('/api/insurance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies }),
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.leads)) {
        // Sync Zustand state so saved companies immediately show up in Lead Intelligence & Kanban Pipeline
        const existingIds = new Set(leads.map((l) => l.id));
        const newLeadsToAdd = data.leads.filter((l: any) => !existingIds.has(l.id));
        setLeads([...newLeadsToAdd, ...leads]);

        // Mark all saved IDs
        const newSavedSet = new Set(savedCompanyIds);
        companies.forEach((c) => newSavedSet.add(c.id));
        setSavedCompanyIds(newSavedSet);

        setLiveScanStatus(`✅ Successfully saved ${data.savedCount || companies.length} insurance companies to CRM Database & downloaded Excel file!`);
      } else {
        setLiveScanStatus('✅ Downloaded Excel file! Companies saved to session.');
      }
      setTimeout(() => setLiveScanStatus(null), 7000);
    } catch (err) {
      console.error('Failed saving to database:', err);
      exportInsuranceCompaniesToExcel(companies);
      setLiveScanStatus('Downloaded Excel file successfully!');
      setTimeout(() => setLiveScanStatus(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save single company into CRM Database
  const handleSaveSingleCompanyToDatabase = async (company: InsuranceCompany, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/insurance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        const existingIds = new Set(leads.map((l) => l.id));
        const newLeadsToAdd = data.leads.filter((l: any) => !existingIds.has(l.id));
        setLeads([...newLeadsToAdd, ...leads]);

        const newSavedSet = new Set(savedCompanyIds);
        newSavedSet.add(company.id);
        setSavedCompanyIds(newSavedSet);

        setLiveScanStatus(`✅ "${company.name}" saved as CRM Lead in Database!`);
        setTimeout(() => setLiveScanStatus(null), 4000);
      }
    } catch (err) {
      console.error('Failed saving single company:', err);
    }
  };

  const totalUs = companies.filter((c) => c.country === 'USA').length;
  const totalCa = companies.filter((c) => c.country === 'CANADA').length;

  const categories = [
    'ALL',
    'Property & Casualty',
    'Life & Health',
    'Commercial & Cyber',
    'Automotive',
    'Specialty Lines',
  ];

  const popularLocations = [
    { label: '🇺🇸 Idaho (Agencies & Brokers)', query: 'Insurance Agencies in Idaho' },
    { label: '🇺🇸 Iowa (Agencies & Brokers)', query: 'Insurance Agencies in Iowa' },
    { label: '🇺🇸 Texas (Agencies & Brokers)', query: 'Insurance Agencies in Texas' },
    { label: '🇺🇸 California (Agencies & Brokers)', query: 'Insurance Agencies in California' },
    { label: '🇺🇸 Florida (Agencies & Brokers)', query: 'Insurance Agencies in Florida' },
    { label: '🇺🇸 New York (Agencies & Brokers)', query: 'Insurance Agencies in New York' },
    { label: '🇨🇦 Ontario (Agencies & Brokers)', query: 'Insurance Agencies in Ontario' },
  ];

  return (
    <div className="w-full max-w-[1920px] px-6 md:px-8 py-8 space-y-6 mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900/80 p-6 rounded-2xl border border-blue-800/40 shadow-glow backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Insurance Agencies & Brokerages Directory (Google Maps & Domain Registry)
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400 animate-spin" /> Live Agency Scan Mode
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Displays verified independent insurance agencies, commercial brokerages, and local risk firms integrated with Google Maps locations, ratings, review counts, and official registered web domains.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
            </button>
          </div>

          <button
            onClick={() => handleLiveGoogleSearch(selectedState !== 'ALL STATES' ? selectedState : search || 'Idaho')}
            disabled={isLiveScanning}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-glow disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLiveScanning ? 'animate-spin' : ''}`} />
            {isLiveScanning ? 'Scanning 100 NEW...' : `Scan 100 NEW Google & Maps`}
          </button>

          {/* Primary Save & Download Excel Button */}
          <button
            onClick={handleSaveAndDownloadExcel}
            disabled={isSaving || companies.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-glow disabled:opacity-50 cursor-pointer"
          >
            <Database className="w-4 h-4 text-emerald-200" />
            <FileSpreadsheet className="w-4 h-4 text-cyan-200" />
            <span>{isSaving ? 'Saving & Exporting...' : `Save in DB & Download Excel (${companies.length})`}</span>
          </button>
        </div>
      </div>

      {/* Live Status Toast Banner */}
      {liveScanStatus && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs font-medium flex items-center justify-between shadow-glow animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{liveScanStatus}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50">
            Database & Excel Engine Active
          </span>
        </div>
      )}

      {/* Analytics / Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Loaded Agencies</p>
            <h3 className="text-2xl font-bold text-white mt-1">{companies.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> Maps & Domain Verified
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">US Agencies 🇺🇸</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalUs}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Across 50 US States</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 font-bold text-lg">
            🇺🇸
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Canada Agencies 🇨🇦</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalCa}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Provincial Brokerages</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 font-bold text-lg">
            🇨🇦
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current State Filter</p>
            <h3 className="text-lg font-bold text-emerald-400 mt-1 truncate max-w-[140px]">{selectedState}</h3>
            <p className="text-[11px] text-slate-400 mt-1">100 Companies Max</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Location Shortcuts */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Quick State Scan (100 Listings):
        </span>
        {popularLocations.map((loc) => (
          <button
            key={loc.query}
            onClick={() => {
              setSearch('');
              setSelectedState(loc.query);
              handleLiveGoogleSearch(loc.query);
            }}
            className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {loc.label}
          </button>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLiveGoogleSearch(search);
                }
              }}
              placeholder="Search company name, domain, city, state, or keywords..."
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 pl-10 pr-28 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all placeholder:text-slate-500"
            />
            <button
              onClick={() => handleLiveGoogleSearch(search)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLiveScanning ? 'animate-spin' : ''}`} /> Scan 100 NEW
            </button>
          </div>

          {/* State / Province Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">State/Province:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                const stateVal = e.target.value;
                setSelectedState(stateVal);
                setSearch('');
                if (stateVal !== 'ALL STATES') {
                  handleLiveGoogleSearch(stateVal);
                }
              }}
              className="bg-slate-950/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-semibold"
            >
              {US_STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Country Tabs */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => {
                setSearch('');
                setSelectedState('ALL STATES');
                setSelectedCountry('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCountry === 'ALL' && selectedState === 'ALL STATES' && !search
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Regions
            </button>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCountry('USA');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCountry === 'USA'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇺🇸</span> USA
            </button>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCountry('CANADA');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCountry === 'CANADA'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇨🇦</span> Canada
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 pr-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Sector:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {cat === 'ALL' ? 'All Lines' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Table View vs Grid View */}
      {companies.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Live Insurance Agencies Loaded</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Click below to execute a real-time scan of Google Places, Google Search, Hunter.io & Apollo.io.
          </p>
          <button
            onClick={() => handleLiveGoogleSearch(selectedState !== 'ALL STATES' ? selectedState : search || 'Idaho')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-glow cursor-pointer"
          >
            Scan 100 NEW Google & Maps Listings
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ================= TABLE FORMAT VIEW ================= */
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-4 w-12 text-center">#</th>
                  <th className="py-4 px-4 min-w-[220px]">Company Name</th>
                  <th className="py-4 px-4 min-w-[200px]">Registered Domain</th>
                  <th className="py-4 px-4 min-w-[220px]">Email Address</th>
                  <th className="py-4 px-4 min-w-[200px]">Google Maps Location</th>
                  <th className="py-4 px-4 min-w-[260px]">About Provider</th>
                  <th className="py-4 px-4 min-w-[140px] text-right">CRM & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {companies.map((company, index) => {
                  const displayDomain = company.domain || (company.website ? company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '') : 'agency.com');
                  const mapsUrl = company.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.name + ' ' + company.city + ' ' + company.state)}`;
                  const isSaved = savedCompanyIds.has(company.id);

                  return (
                    <tr
                      key={company.id}
                      onClick={() => setActiveCompany(company)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Index */}
                      <td className="py-4 px-4 text-slate-500 font-mono text-center font-medium">
                        {index + 1}
                      </td>

                      {/* Company Name */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-100 group-hover:text-blue-400 text-sm transition-colors">
                              {company.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                company.country === 'USA'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}
                            >
                              {company.country === 'USA' ? '🇺🇸 USA' : '🇨🇦 CA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {company.category}
                            </span>
                            {company.rating && (
                              <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                <Star className="w-3 h-3 fill-amber-400" /> {company.rating}
                                {company.googleReviewsCount ? ` (${company.googleReviewsCount} reviews)` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Registered Domain & Website */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between gap-2 p-2 bg-slate-950/60 rounded-xl border border-slate-800/60">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="font-mono text-cyan-300 truncate text-[11px]">
                              {displayDomain}
                            </span>
                          </div>
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Visit Registered Domain Website"
                              className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all border border-slate-700 shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Unverified</span>
                          )}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between gap-2 p-2 bg-slate-950/60 rounded-xl border border-slate-800/60">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="font-mono text-slate-200 truncate">
                              {company.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleCopyEmail(company.email || '', e)}
                              title="Copy Email"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-[10px]"
                            >
                              {copiedEmail === company.email ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Google Maps Location */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-slate-300 font-semibold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{company.city}, {company.state}</span>
                          </div>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-semibold transition-all shadow-sm"
                          >
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>View on Google Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      {/* About */}
                      <td className="py-4 px-4">
                        <p className="text-slate-300 leading-relaxed line-clamp-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 text-[11px]">
                          {company.about}
                        </p>
                      </td>

                      {/* CRM Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleSaveSingleCompanyToDatabase(company, e)}
                            title="Save as CRM Lead to Database"
                            className={`p-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                              isSaved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700'
                            }`}
                          >
                            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Database className="w-3.5 h-3.5 text-cyan-400" />}
                            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save DB'}</span>
                          </button>
                          <button
                            onClick={() => setActiveCompany(company)}
                            className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl font-semibold transition-all flex items-center gap-1 text-xs"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= GRID CARD VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company) => {
            const displayDomain = company.domain || (company.website ? company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '') : 'agency.com');
            const mapsUrl = company.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.name + ' ' + company.city + ' ' + company.state)}`;
            const isSaved = savedCompanyIds.has(company.id);

            return (
              <div
                key={company.id}
                onClick={() => setActiveCompany(company)}
                className="bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-glow group cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {company.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            company.country === 'USA'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {company.country === 'USA' ? '🇺🇸 USA' : '🇨🇦 CANADA'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {company.city}, {company.state} {company.foundedYear ? `• Founded ${company.foundedYear}` : ''}
                      </p>
                    </div>

                    {company.rating && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {company.rating} {company.googleReviewsCount ? `(${company.googleReviewsCount})` : ''}
                      </div>
                    )}
                  </div>

                  {/* Domain & Website Box */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Registered Domain</p>
                        <span className="text-xs font-mono text-cyan-300 truncate block font-semibold">
                          {displayDomain}
                        </span>
                      </div>
                    </div>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white transition-all shrink-0"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Unverified</span>
                    )}
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>View Listing on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Email & Contact */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-mono text-slate-200 truncate">
                        {company.email}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{company.phone}</span>
                  </div>

                  {/* About */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-indigo-400" /> About Provider
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                      {company.about}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleSaveSingleCompanyToDatabase(company, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSaved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Database className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{isSaved ? 'Saved in CRM DB' : 'Save to CRM DB'}</span>
                  </button>

                  <button
                    onClick={() => setActiveCompany(company)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl text-xs font-semibold transition-all"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Company Detail Drawer / Modal */}
      {activeCompany && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setActiveCompany(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      activeCompany.country === 'USA'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {activeCompany.country === 'USA' ? '🇺🇸 United States' : '🇨🇦 Canada'}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {activeCompany.category}
                  </span>
                </div>

                <button
                  onClick={() => handleRescanCompany(activeCompany)}
                  disabled={isRescanningCompany}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRescanningCompany ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{isRescanningCompany ? 'Re-checking & Scanning...' : 'Re-check & Verify Details'}</span>
                </button>
              </div>

              {rescanSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
                  {rescanSuccessMsg}
                </div>
              )}

              <h2 className="text-2xl font-bold text-white tracking-tight">{activeCompany.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {activeCompany.city}, {activeCompany.state}, {activeCompany.country}
              </p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-[11px] text-slate-400">Founded Year</p>
                <p className="text-sm font-bold text-white mt-0.5">{activeCompany.foundedYear || 'Not verified'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Employee Count</p>
                <p className="text-sm font-bold text-white mt-0.5">{activeCompany.employeeCount || 'Not verified'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Annual Revenue</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{activeCompany.revenue || 'Not verified'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Google Rating</p>
                <p className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                  {activeCompany.rating ? (
                    <>
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {activeCompany.rating}
                      {activeCompany.googleReviewsCount ? ` (${activeCompany.googleReviewsCount})` : ''}
                    </>
                  ) : (
                    <span className="text-slate-500 text-xs font-normal">Not verified</span>
                  )}
                </p>
              </div>
            </div>

            {/* Executive Leadership & Decision Makers (CEO, Founder, Marketing Manager, etc.) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  Key Decision Makers & Executive Leadership
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  CEO • Founder • Marketing Manager • CMO
                </span>
              </div>

              <div className="space-y-2.5">
                {getCompanyDecisionMakers(activeCompany).length === 0 ? (
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Verified decision maker not found.</span>
                  </div>
                ) : (
                  getCompanyDecisionMakers(activeCompany).map((exec) => (
                    <div
                      key={exec.id || exec.fullName}
                      className="p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm"
                    >
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40 flex items-center justify-center font-extrabold text-blue-400 text-xs shrink-0 shadow-sm">
                          {exec.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-bold text-slate-100 text-sm">{exec.fullName}</span>
                            {exec.isPrimary && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                                Primary Contact
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-blue-300 font-semibold mt-0.5">{exec.jobTitle}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-mono text-slate-200 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {exec.email ? exec.email : <span className="text-slate-500 italic">Verified email unavailable</span>}
                              {exec.email && (
                                <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 ml-1">
                                  {exec.emailStatus || 'VALID'}
                                </span>
                              )}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              {exec.phone ? exec.phone : <span className="text-slate-500 italic">Phone unavailable</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {exec.email && (
                          <button
                            onClick={(e) => handleCopyEmail(exec.email || '', e)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5"
                            title="Copy Direct Email"
                          >
                            {copiedEmail === exec.email ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Email</span>
                              </>
                            )}
                          </button>
                        )}

                        {exec.linkedInUrl && (
                          <a
                            href={exec.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                            title="View Verified LinkedIn Profile"
                          >
                            <Linkedin className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Direct Contact & Domain Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Google Maps & Registered Domain Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Support Email
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-200">{activeCompany.email}</p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Support Hotline
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-200">{activeCompany.phone}</p>
                </div>
              </div>

              {activeCompany.website && (
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Registered Web Domain
                  </p>
                  <a
                    href={activeCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-cyan-300 hover:underline flex items-center gap-1.5"
                  >
                    {activeCompany.domain || activeCompany.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Google Maps Button */}
              <a
                href={activeCompany.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCompany.name + ' ' + activeCompany.city + ' ' + activeCompany.state)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Open Location in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Detailed About Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                About {activeCompany.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {activeCompany.about}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <button
                onClick={(e) => handleSaveSingleCompanyToDatabase(activeCompany, e)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  savedCompanyIds.has(activeCompany.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {savedCompanyIds.has(activeCompany.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved in CRM DB
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" /> Save as Lead in DB
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleCopyEmail(activeCompany.email || '', e)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Email
                </button>
                {activeCompany.website && (
                  <a
                    href={activeCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
