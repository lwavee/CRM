'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { LeadRecord } from '@/lib/data/mock-db';
import { exportLeadsToExcel } from '@/lib/utils/excel-exporter';
import {
  Building2,
  Globe,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Zap,
  UserCheck,
  CheckCircle2,
  Mail,
  Phone,
  Filter,
  SlidersHorizontal,
  Download,
  RefreshCw,
} from 'lucide-react';

export const LeadIntelligenceHub: React.FC = () => {
  const { leads, setLeads, filters, setFilters, setSelectedLead, setFilterModalOpen } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.search) query.set('search', filters.search);
        if (filters.country) query.set('country', filters.country);
        if (filters.service) query.set('service', filters.service);
        if (filters.minScore > 0) query.set('minScore', filters.minScore.toString());
        if (filters.status) query.set('status', filters.status);

        const res = await fetch(`/api/leads?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [filters, setLeads]);

  const handleScanLiveInternet = async () => {
    setIsScanning(true);
    setScanMessage('Connecting to live servers (LinkedIn, Upwork, Freelancer App)...');
    try {
      const res = await fetch('/api/leads/scan-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: 'Insurance',
          sources: ['LinkedIn Public Feed', 'Upwork Enterprise Jobs', 'Freelancer App Client Posts', 'Live Web Search'],
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads([...data.leads, ...leads]);
        setScanMessage(`Fetched ${data.leads.length} live Insurance companies from LinkedIn & Upwork!`);
        setTimeout(() => setScanMessage(null), 5000);
      }
    } catch (err) {
      console.error('Failed to scan live data:', err);
      setScanMessage('Scan failed. Please check internet connection.');
      setTimeout(() => setScanMessage(null), 3000);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownloadExcel = () => {
    exportLeadsToExcel(leads, 'Insurance_Companies_Leads.csv');
  };

  const countries = [
    { code: '', label: 'All Target Regions' },
    { code: 'USA', label: '🇺🇸 USA' },
    { code: 'CANADA', label: '🇨🇦 Canada' },
    { code: 'UNITED_KINGDOM', label: '🇬🇧 UK' },
    { code: 'AUSTRALIA', label: '🇦🇺 Australia' },
    { code: 'UAE', label: '🇦🇪 UAE' },
  ];

  return (
    <div className="w-full max-w-[1920px] px-6 md:px-8 py-8 space-y-6 mx-auto">
      {/* Header & Live Control Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" /> Lead Intelligence Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live-scanned companies actively hiring & matching buying signals across web servers
          </p>
        </div>

        {/* Live Action Buttons: Scan Live Data & Export to Excel */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleScanLiveInternet}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Live Internet...' : '⚡ Scan Live Internet (LinkedIn & Upwork)'}</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>📥 Download Excel</span>
          </button>
        </div>
      </div>

      {/* Live Status Notification Banner */}
      {scanMessage && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{scanMessage}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Server Status: LIVE_CONNECTED</span>
        </div>
      )}

      {/* Quick Country Selector & Filters */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => setFilters({ country: c.code })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filters.country === c.code
                ? 'bg-blue-600 text-white shadow-glow'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            {c.label}
          </button>
        ))}

        <button
          onClick={() => setFilterModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center space-x-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Main Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Filtering Lead Intelligence Data...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No leads matched your current filters</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try broadening your filter criteria or adding a new company using the "+ Add Company" button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Website</th>
                  <th className="py-3.5 px-4">Number</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {leads.map((lead) => {
                  const leadEmail = lead.email || lead.decisionMakers?.[0]?.email || 'N/A';
                  const leadPhone = lead.phone || lead.decisionMakers?.[0]?.phone || 'N/A';
                  const leadReq = lead.requirement || lead.aiSummary?.primaryPitchReason || lead.recommendedService;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      {/* Company Name */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5 hover:text-blue-400 transition">
                          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{lead.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold text-[10px]">
                            {lead.country}
                          </span>
                          <span>• {lead.industry}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4">
                        <a
                          href={`mailto:${leadEmail}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-mono bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/20 transition"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{leadEmail}</span>
                        </a>
                      </td>

                      {/* Website */}
                      <td className="py-4 px-4">
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-blue-400 font-mono bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60 hover:border-blue-500/40 transition"
                        >
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="max-w-[140px] truncate">{lead.domain || lead.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                        </a>
                      </td>

                      {/* Number (if available) */}
                      <td className="py-4 px-4">
                        {leadPhone && leadPhone !== 'N/A' ? (
                          <a
                            href={`tel:${leadPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-200 font-mono bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 hover:border-slate-500 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{leadPhone}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                            Not Available
                          </span>
                        )}
                      </td>

                      {/* Requirement */}
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <span className="inline-block text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg leading-snug">
                            {leadReq}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-glow flex items-center space-x-1 ml-auto shrink-0"
                        >
                          <span>Review & Pitch</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
