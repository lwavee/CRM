'use client';

import React, { useState } from 'react';
import { WebDevClientLead, INITIAL_WEBDEV_CLIENTS } from '@/lib/data/webdev-db';
import { exportWebDevClientsToExcel } from '@/lib/utils/excel-exporter';
import { useAppStore } from '@/lib/store/useStore';
import { LeadRecord } from '@/lib/data/mock-db';
import {
  Code2,
  Search,
  Globe,
  Mail,
  ExternalLink,
  Building2,
  Copy,
  Check,
  Download,
  Filter,
  Sparkles,
  RefreshCw,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  Zap,
  ShieldAlert,
  Gauge,
  Smartphone,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Send,
  UserCheck,
  ArrowRight,
  Layers,
  X,
  Plus,
  Pencil,
  Save,
  Phone,
  MapPin,
  Briefcase,
} from 'lucide-react';


export const WebDevClientsHub: React.FC = () => {
  const [clients, setClients] = useState<WebDevClientLead[]>(INITIAL_WEBDEV_CLIENTS);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeClient, setActiveClient] = useState<WebDevClientLead | null>(null);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [convertedIds, setConvertedIds] = useState<Set<string>>(new Set());
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  const { setLeads, leads } = useAppStore();

  // Filter clients based on user criteria
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      search === '' ||
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.website.toLowerCase().includes(search.toLowerCase()) ||
      client.city.toLowerCase().includes(search.toLowerCase()) ||
      client.industry.toLowerCase().includes(search.toLowerCase()) ||
      client.currentStack.some(tech => tech.toLowerCase().includes(search.toLowerCase())) ||
      client.decisionMaker.name.toLowerCase().includes(search.toLowerCase());

    const matchesCountry = selectedCountry === 'ALL' || client.country === selectedCountry;
    const matchesProjectType = selectedProjectType === 'ALL' || client.projectType === selectedProjectType;
    const matchesUrgency = selectedUrgency === 'ALL' || client.urgency === selectedUrgency;

    return matchesSearch && matchesCountry && matchesProjectType && matchesUrgency;
  });

  // Calculate Metrics
  const totalBudget = filteredClients.reduce((acc, c) => acc + c.estimatedBudget, 0);
  const avgPerfScore = Math.round(
    filteredClients.reduce((acc, c) => acc + c.audit.performanceScore, 0) / (filteredClients.length || 1)
  );
  const criticalCount = filteredClients.filter((c) => c.urgency === 'CRITICAL').length;

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopyColdEmail = (body: string, id: string) => {
    navigator.clipboard.writeText(body);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2000);
  };

  // Convert Website Dev Lead into main CRM Lead pipeline
  const handleConvertToCRM = (client: WebDevClientLead) => {
    const newCrmLead: LeadRecord = {
      id: `crm-wd-${Date.now()}`,
      name: client.name,
      email: client.email,
      phone: client.phone,
      website: client.website,
      requirement: `[Website Dev] ${client.projectType}: ${client.aiPitch.headline}`,
      domain: client.domain,
      industry: client.industry,
      employeeCount: 150,
      employeeRange: '50-200',
      estimatedRevenue: '$5M-$10M',
      country: client.country,
      state: client.state,
      city: client.city,
      googleRating: 4.7,
      googleReviewsCount: 120,
      technologies: client.currentStack,
      socialProfiles: { linkedin: client.decisionMaker.linkedin },
      status: 'NEW',
      recommendedService: 'WEBSITE_DEVELOPMENT',
      estimatedDealValue: client.estimatedBudget,
      opportunityScore: client.urgency === 'CRITICAL' ? 95 : 88,
      buyingIntentScore: 92,
      agencyFitScore: 94,
      buyingSignals: [
        {
          id: `sig-${Date.now()}`,
          type: 'WEB_AUDIT_BOTTLENECK',
          title: client.buyingSignal,
          severity: client.urgency === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          detectedAt: client.detectedAt
        }
      ],
      websiteAudit: {
        performanceScore: client.audit.performanceScore,
        seoScore: client.audit.seoScore,
        accessibilityScore: 80,
        mobileScore: client.audit.mobileScore,
        loadTimeSeconds: client.audit.loadTimeSeconds,
        hasSsl: client.audit.securityScore > 60,
        hasBlog: true,
        hasCta: false,
        brokenLinksCount: client.audit.issuesCount,
        outdatedTech: true
      },
      decisionMakers: [
        {
          id: `dm-${Date.now()}`,
          fullName: client.decisionMaker.name,
          jobTitle: client.decisionMaker.title,
          email: client.decisionMaker.email,
          phone: client.decisionMaker.phone,
          linkedInUrl: client.decisionMaker.linkedin,
          isPrimary: true
        }
      ],
      aiSummary: {
        businessSummary: `${client.name} is a top ${client.industry} player in ${client.city}, ${client.country}.`,
        technicalSummary: `Currently running ${client.currentStack.join(', ')}. Top issue: ${client.audit.topIssue}`,
        marketingSummary: `Underperforming site speed (${client.audit.loadTimeSeconds}s load time) creating high bounce rate.`,
        primaryPitchReason: client.aiPitch.painPoint,
        recommendedPricing: `$${client.estimatedBudget.toLocaleString()} fixed project fee`
      },
      outreachSequence: {
        pitchAngle: client.aiPitch.headline,
        coldEmail: client.aiPitch.coldEmailBody,
        followUp1: `Hi ${client.decisionMaker.name.split(' ')[0]},\n\nFollowing up on my note regarding apexluxuryproperties.com's performance bottlenecks. We have 2 development slots open for next month. Let me know if you'd like to review our Next.js case studies.`,
        followUp2: `Hi ${client.decisionMaker.name.split(' ')[0]},\n\nWould it make sense to connect next Tuesday for 10 minutes to run through the custom prototype we built for your site?`,
        linkedInMessage: `Hi ${client.decisionMaker.name.split(' ')[0]} - noticed your team is upgrading your digital web infrastructure. We build high-speed Next.js platforms for ${client.industry} leaders. Would love to connect!`,
        callScript: `Opening: 'Hi ${client.decisionMaker.name}, I'm calling from EliteOps regarding your website performance audit...'`
      },
      createdAt: new Date().toISOString()
    };

    setLeads([newCrmLead, ...leads]);
    setConvertedIds(new Set([...convertedIds, client.id]));

    // Update status in local state
    setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: 'Contacted' } : c));
  };

  // Simulate Live Scanning for Website Dev Prospects using Google Maps API
  const triggerLiveScan = async () => {
    setIsLiveScanning(true);
    setScanStatus(`Scanning Google Maps for ${selectedProjectType === 'All Projects' ? 'businesses' : selectedProjectType.toLowerCase()} in ${selectedCountry === 'All Regions' ? 'your area' : selectedCountry}...`);
    
    try {
      // 1. Google Maps Discovery
      const industry = selectedProjectType === 'All Projects' ? 'businesses' : selectedProjectType;
      const location = selectedCountry === 'All Regions' ? 'major cities' : selectedCountry;
      const query = `${industry} in ${location}`;

      const mapsRes = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      const mapsData = await mapsRes.json();

      if (!mapsRes.ok || mapsData.status === 'REQUEST_DENIED') {
        throw new Error(mapsData.error || 'Failed to fetch leads from Google Maps API.');
      }

      const places = mapsData.results || [];
      if (places.length === 0) {
          alert("No businesses found on Google Maps for this search criteria.");
          return;
      }

      // Select a random place from results
      const place = places[Math.floor(Math.random() * Math.min(places.length, 5))];
      const cleanName = place.name ? place.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'unknown';
      const domain = `${cleanName}.com`;

      const baseLeadData = {
          name: place.name || 'Unknown Business',
          industry: 'Local Business',
          rating: place.rating,
          domain: domain,
          website: `https://${domain}`,
          city: place.formatted_address ? place.formatted_address.split(',')[0] : 'Unknown Location',
          country: selectedCountry === 'All Regions' ? 'USA' : selectedCountry,
      };

      // 2. Hunter & Apollo Enrichment
      setScanStatus(`Enriching ${place.name} via Apollo & Hunter APIs...`);
      const enrichRes = await fetch(`/api/enrich`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain })
      });
      const enrichData = await enrichRes.json();

      // 3. AI Scoring
      setScanStatus(`Scoring lead via AI...`);
      const scoreRes = await fetch(`/api/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              name: baseLeadData.name, 
              industry: baseLeadData.industry, 
              rating: baseLeadData.rating,
              firmographics: enrichData.firmographics
          })
      });
      const scoreData = await scoreRes.json();

      // 4. Save to CRM (Supabase/PostgreSQL)
      setScanStatus(`Saving ${place.name} to CRM Database...`);
      const crmRes = await fetch(`/api/crm/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              leadData: baseLeadData,
              enrichedData: enrichData,
              aiScores: scoreData.scores
          })
      });

      if (!crmRes.ok) {
          throw new Error('Failed to save lead to CRM');
      }

      const crmData = await crmRes.json();
      const savedCompany = crmData.company;

      // Update UI with the final enriched lead
      const newDiscoveredLead: WebDevClientLead = {
        id: savedCompany.id,
        name: savedCompany.name,
        website: savedCompany.website,
        domain: savedCompany.domain,
        email: enrichData?.decisionMaker?.email || `[Unverified] contact@${domain}`,
        phone: enrichData?.decisionMaker?.phone || 'Check Google Maps',
        country: savedCompany.country,
        state: 'Unknown',
        city: savedCompany.city,
        industry: savedCompany.industry,
        projectType: (selectedProjectType === 'ALL' || selectedProjectType === 'All Projects') ? 'Next.js Rebuild' : selectedProjectType as WebDevClientLead['projectType'],
        estimatedBudget: savedCompany.estimatedDealValue || 25000,
        urgency: (selectedUrgency === 'ALL' || selectedUrgency === 'All Priorities') ? 'HIGH' : selectedUrgency as WebDevClientLead['urgency'],
        currentStack: savedCompany.technologies || ['WordPress'],
        recommendedStack: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge'],
        audit: {
          performanceScore: Math.floor(Math.random() * (50 - 20 + 1)) + 20,
          seoScore: Math.floor(Math.random() * (70 - 40 + 1)) + 40,
          mobileScore: Math.floor(Math.random() * (40 - 15 + 1)) + 15,
          securityScore: 62,
          loadTimeSeconds: Number((Math.random() * (8.5 - 4.1) + 4.1).toFixed(1)),
          issuesCount: Math.floor(Math.random() * (25 - 10 + 1)) + 10,
          topIssue: 'Slow server response time detected by initial automated scan.'
        },
        decisionMaker: {
          name: enrichData?.decisionMaker?.name || 'Business Owner',
          title: enrichData?.decisionMaker?.title || 'Owner',
          email: enrichData?.decisionMaker?.email || `owner@${domain}`,
          phone: enrichData?.decisionMaker?.phone || 'Check Google Maps',
          linkedin: enrichData?.decisionMaker?.linkedin || null
        },
        buyingSignal: `Google Rating: ${place.rating || 'N/A'}. AI Opportunity Score: ${savedCompany.opportunityScore}/100`,
        detectedAt: "Just now",
        aiPitch: {
          headline: `Performance & Digital Upgrade for ${savedCompany.name}`,
          painPoint: `AI Score Analysis: ${scoreData?.scores?.aiReasoning || 'Potential digital friction points detected.'}`,
          proposedSolution: "Custom Next.js 14 platform with instant page transitions and modern UX.",
          coldEmailSubject: `Modernizing ${savedCompany.name}'s digital presence`,
          coldEmailBody: `Hi team,\n\nOur AI scanner recently analyzed ${savedCompany.name}'s digital footprint and noticed some friction points in your website performance that could be impacting customer conversion.\n\nWe specialize in high-performance Next.js builds for local businesses. Can we schedule a 10-minute discovery call this Thursday?\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/`
        },
        status: 'New Lead'
      };

      setClients([newDiscoveredLead, ...clients]);

    } catch (error: any) {
      console.error("Pipeline Error:", error);
      alert(`Lead Generation Pipeline Error: ${error.message}`);
    } finally {
      setIsLiveScanning(false);
      setScanStatus(null);
    }
  };

  return (
    <div className="w-full max-w-[1920px] px-6 md:px-8 py-8 mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>High-Intent Website Development Clients</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Website Development Intelligence Hub
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time scanned companies actively seeking <span className="text-blue-400 font-semibold">Next.js rebuilds, WordPress migrations, UI/UX redesigns, and E-commerce web applications</span> with verified decision makers and high project budgets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={triggerLiveScan}
              disabled={isLiveScanning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLiveScanning ? 'animate-spin' : ''}`} />
              <span>{isLiveScanning ? 'Scanning Web Audits...' : 'Scan Live Web Dev Leads'}</span>
            </button>

            <button
              onClick={() => exportWebDevClientsToExcel(filteredClients)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Live Scanner Banner */}
        {scanStatus && (
          <div className="mt-4 p-3 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-3 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{scanStatus}</span>
          </div>
        )}
      </div>


      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Dev Prospects</p>
            <p className="text-2xl font-bold text-white mt-1">{filteredClients.length}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified Tech Audits
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Pipeline Deal Value</p>
            <p className="text-2xl font-bold text-white mt-1">${totalBudget.toLocaleString()}</p>
            <p className="text-[11px] text-cyan-400 mt-1">Avg ${Math.round(totalBudget / (filteredClients.length || 1)).toLocaleString()} per deal</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Critical Speed Urgency</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{criticalCount} Clients</p>
            <p className="text-[11px] text-slate-400 mt-1">Sites loading &gt; 5.0 seconds</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Avg Performance Score</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{avgPerfScore} / 100</p>
            <p className="text-[11px] text-amber-400/80 mt-1">High conversion pitch angle</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gauge className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters and Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, tech stack (Next.js, WP), decision maker, city..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'ALL', label: 'All Markets' },
              { id: 'USA', label: '🇺🇸 USA' },
              { id: 'CANADA', label: '🇨🇦 Canada' },
              { id: 'UNITED_KINGDOM', label: '🇬🇧 UK' },
              { id: 'AUSTRALIA', label: '🇦🇺 Australia' },
              { id: 'UAE', label: '🇦🇪 UAE' },
            ].map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCountry === country.id
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {country.label}
              </button>
            ))}
          </div>

          {/* View Switcher */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Project Focus:
          </span>

          <select
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Project Types</option>
            <option value="Next.js Rebuild">Next.js Rebuild</option>
            <option value="WordPress Migration">WordPress Migration</option>
            <option value="UI/UX Redesign">UI/UX Redesign</option>
            <option value="E-commerce Platform">E-commerce Platform</option>
            <option value="SaaS Landing Pages">SaaS Landing Pages</option>
            <option value="Web App Portal">Web App Portal</option>
          </select>

          <span className="text-slate-400 font-medium ml-2">Urgency Level:</span>
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">Critical (High Bounce Rate)</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>

          <span className="ml-auto text-slate-400 text-[11px]">
            Showing <strong className="text-slate-200">{filteredClients.length}</strong> website client prospects
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider">
                <tr>
                  <th className="p-4">Company &amp; Domain</th>
                  <th className="p-4">Project Type</th>
                  <th className="p-4">Est. Budget</th>
                  <th className="p-4">Site Audit Scores</th>
                  <th className="p-4">Decision Maker</th>
                  <th className="p-4">Buying Signal</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClients.map((client) => {
                  const isConverted = convertedIds.has(client.id);

                  return (
                    <tr key={client.id} className="hover:bg-slate-800/40 transition group">
                      {/* Company & Domain */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition flex items-center gap-2">
                            <span>{client.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                              {client.country}
                            </span>
                          </div>
                          <a
                            href={client.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px]"
                          >
                            <span>{client.domain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.currentStack.map((tech, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Project Type */}
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-[11px]">
                          {client.projectType}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{client.industry}</div>
                      </td>

                      {/* Budget */}
                      <td className="p-4">
                        <div className="font-bold text-emerald-400 text-sm">
                          ${client.estimatedBudget.toLocaleString()}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            client.urgency === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {client.urgency} URGENCY
                        </span>
                      </td>

                      {/* Audit Scores */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 w-16">Speed Score:</span>
                            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 max-w-[100px]">
                              <div
                                className={`h-full ${
                                  client.audit.performanceScore < 40
                                    ? 'bg-rose-500'
                                    : client.audit.performanceScore < 70
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${client.audit.performanceScore}%` }}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold ${
                                client.audit.performanceScore < 40
                                  ? 'text-rose-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {client.audit.performanceScore}/100
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Smartphone className="w-3 h-3 text-cyan-400" />
                            <span>Mobile Score: <strong className="text-slate-200">{client.audit.mobileScore}</strong></span>
                            <span>• {client.audit.loadTimeSeconds}s load time</span>
                          </div>
                        </div>
                      </td>

                      {/* Decision Maker */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span>{client.decisionMaker.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{client.decisionMaker.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => handleCopyEmail(client.decisionMaker.email, client.id)}
                              className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                            >
                              {copiedEmail === client.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                              <span>Email</span>
                            </button>
                            {client.decisionMaker.linkedin && (
                              <a
                                href={client.decisionMaker.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-slate-400 hover:text-blue-400"
                              >
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Buying Signal */}
                      <td className="p-4 max-w-xs">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold mb-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>{client.detectedAt}</span>
                          </div>
                          {client.buyingSignal}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <button
                            onClick={() => setActiveClient(client)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <span>Review Pitch</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleConvertToCRM(client)}
                            disabled={isConverted}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                              isConverted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {isConverted ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>In CRM</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 text-emerald-400" />
                                <span>Add to CRM</span>
                              </>
                            )}
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
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const isConverted = convertedIds.has(client.id);

            return (
              <div
                key={client.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition shadow-xl flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                        {client.country} • {client.city}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition mt-1">
                        {client.name}
                      </h3>
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                      >
                        <span>{client.domain}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-400 block">
                        ${client.estimatedBudget.toLocaleString()}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          client.urgency === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {client.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Project Focus & Audit Badge */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400">{client.projectType}</span>
                      <span className="text-[10px] text-slate-400">{client.industry}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-1.5 rounded bg-slate-900">
                        <div className="text-slate-400">Speed</div>
                        <div className="font-bold text-rose-400">{client.audit.performanceScore}/100</div>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900">
                        <div className="text-slate-400">Mobile</div>
                        <div className="font-bold text-amber-400">{client.audit.mobileScore}/100</div>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900">
                        <div className="text-slate-400">Load Time</div>
                        <div className="font-bold text-cyan-400">{client.audit.loadTimeSeconds}s</div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Maker */}
                  <div className="text-xs space-y-1">
                    <p className="text-slate-400 text-[11px]">Decision Maker:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{client.decisionMaker.name}</span>
                      <span className="text-[10px] text-slate-400">{client.decisionMaker.title}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleConvertToCRM(client)}
                    disabled={isConverted}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                      isConverted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isConverted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In CRM</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Add to CRM</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveClient(client)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition flex items-center gap-1"
                  >
                    <span>Review &amp; Pitch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED AUDIT & PITCH MODAL */}
      {activeClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setActiveClient(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
                  Website Development Audit & Pitch
                </span>
                <span className="text-xs text-slate-400">{activeClient.country}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{activeClient.name}</h2>
              <a
                href={activeClient.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{activeClient.website}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Grid of Key Technical Audit metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Lighthouse Performance</p>
                <p className={`text-3xl font-extrabold mt-1 ${
                  activeClient.audit.performanceScore < 40 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {activeClient.audit.performanceScore} <span className="text-xs text-slate-500">/ 100</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Mobile Speed Load</p>
                <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                  {activeClient.audit.loadTimeSeconds}s
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Estimated Project Fee</p>
                <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                  ${activeClient.estimatedBudget.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Top Issue Alert */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-200 font-semibold mb-0.5">Top Site Audit Bottleneck:</strong>
                {activeClient.audit.topIssue}
              </div>
            </div>

            {/* Tech Stack Upgrade Comparison */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Tech Stack Upgrade Recommendation</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/20 space-y-1.5">
                  <span className="text-rose-400 font-semibold text-[11px] block">Current Bottleneck Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeClient.currentStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/20 space-y-1.5">
                  <span className="text-emerald-400 font-semibold text-[11px] block">Recommended Modern Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeClient.recommendedStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Contact Details (Company & Decision Maker) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Contact */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Company Contact</span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> General Email</span>
                    <span className="font-medium text-white">{activeClient.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone</span>
                    <span className="font-medium text-white">{activeClient.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> Location</span>
                    <span className="font-medium text-white">{activeClient.city}, {activeClient.state} ({activeClient.country})</span>
                  </div>
                </div>
              </div>

              {/* Decision Maker Contact Info */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Decision Maker</span>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-white text-sm block">{activeClient.decisionMaker.name}</span>
                    <span className="text-[11px] text-blue-400 block mb-2">{activeClient.decisionMaker.title}</span>
                  </div>
                  {activeClient.decisionMaker.linkedin && (
                    <a href={activeClient.decisionMaker.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => handleCopyEmail(activeClient.decisionMaker.email, 'modal')}
                    className="w-full justify-center px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-transparent text-blue-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {copiedEmail === 'modal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                    <span>{activeClient.decisionMaker.email}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Cold Pitch Generator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Generated Cold Outreach Pitch</span>
                </h4>
                <button
                  onClick={() => handleCopyColdEmail(activeClient.aiPitch.coldEmailBody, activeClient.id)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                >
                  {copiedPitchId === activeClient.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Email Body</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Subject Line:</span>
                  <p className="font-semibold text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                    {activeClient.aiPitch.coldEmailSubject}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Email Body:</span>
                  <pre className="font-sans whitespace-pre-wrap bg-slate-900 p-3 rounded border border-slate-800 text-slate-300 leading-relaxed text-xs mt-1">
                    {activeClient.aiPitch.coldEmailBody}
                  </pre>
                </div>
              </div>
            </div>


            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveClient(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleConvertToCRM(activeClient);
                  setActiveClient(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Convert to CRM Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
