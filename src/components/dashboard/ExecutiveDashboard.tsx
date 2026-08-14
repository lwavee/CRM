'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { LeadRecord } from '@/lib/data/mock-db';
import {
  TrendingUp,
  Building2,
  CalendarCheck,
  DollarSign,
  Mail,
  Zap,
  Globe,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { setLeads, setSelectedLead, setActiveTab } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/leads'),
        ]);
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (leadsData.success) {
          setLeads(leadsData.leads);
          setRecentLeads(leadsData.leads.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [setLeads]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading Lead Intelligence Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1920px] px-6 md:px-8 py-8 space-y-8 mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EliteOps Global Lead Intelligence System</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Daily Client Acquisition Command Center
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Automatically identifying, auditing, and scoring high-intent companies across <strong className="text-slate-200">USA, Canada, UK, Australia, and UAE</strong> requiring Web Dev, Marketing, and Back Office services.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('leads')}
          className="relative z-10 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm shadow-glow flex items-center space-x-2 transition"
        >
          <Building2 className="w-4 h-4" />
          <span>Explore All High-Intent Leads</span>
        </button>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Discovered</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{stats?.todaysLeadsDiscovered || 19}</div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+34% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Intent (80+ Score)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{stats?.highIntentLeads || 5}</div>
            <div className="text-xs text-slate-400 mt-1">Ready for 1-Click Outreach</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meetings Scheduled</span>
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{stats?.meetingsScheduled || 3}</div>
            <div className="text-xs text-slate-400 mt-1">Confirmed on Google Calendar</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pipeline Value</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              ${((stats?.totalPipelineValue || 139500) / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-slate-400 mt-1">Across 5 target regions</div>
          </div>
        </div>
      </div>

      {/* Target Countries & Service Intent Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Target Markets Activity
            </h3>
            <span className="text-xs text-slate-400">Verified Leads</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { code: 'USA', name: 'United States', flag: '🇺🇸', count: stats?.countryBreakdown?.USA || 2 },
              { code: 'CANADA', name: 'Canada', flag: '🇨🇦', count: stats?.countryBreakdown?.CANADA || 1 },
              { code: 'UNITED_KINGDOM', name: 'United Kingdom', flag: '🇬🇧', count: stats?.countryBreakdown?.UNITED_KINGDOM || 1 },
              { code: 'AUSTRALIA', name: 'Australia', flag: '🇦🇺', count: stats?.countryBreakdown?.AUSTRALIA || 1 },
              { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', count: stats?.countryBreakdown?.UAE || 1 },
            ].map((c) => (
              <div key={c.code} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{c.flag}</span>
                  <span className="font-medium text-slate-200">{c.name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {c.count} leads
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Agency Service Match Breakdown
            </h3>
            <span className="text-xs text-slate-400">Buying Intent Drivers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { label: 'Website Development (Next.js/React)', icon: '💻', percent: 40, desc: 'Outdated CMS, slow page speeds, mobile friction' },
              { label: 'Digital Marketing (SEO & Ads)', icon: '📈', percent: 25, desc: 'Low Google reviews, missing local SEO rank' },
              { label: 'Back Office Support & Data Entry', icon: '🏢', percent: 20, desc: 'Active hiring for operational support staff' },
              { label: 'Virtual Assistants & Staffing', icon: '🤝', percent: 15, desc: 'Overhead reduction for growing agencies' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{s.icon} {s.label}</span>
                  <span className="font-extrabold text-blue-400">{s.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${s.percent}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Discovered High Intent Leads */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base">Top High-Intent Companies Discovered Today</h3>
            <p className="text-xs text-slate-400 mt-0.5">Scored by AI Opportunity Engine based on hiring intent & website audits</p>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 px-3 rounded-xl transition"
            >
              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-blue-400 text-sm shrink-0">
                  {lead.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-100 text-sm hover:text-blue-400 transition">{lead.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {lead.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {lead.industry} • {lead.employeeCount} Employees • Est. ${lead.estimatedDealValue.toLocaleString()} Project
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {lead.buyingSignals.map((sig) => (
                      <span key={sig.id} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        ⚡ {sig.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                {/* AI Score Badge */}
                <div className="text-right">
                  <div className="text-xs text-slate-400">Opportunity Score</div>
                  <div className="text-lg font-extrabold text-emerald-400 flex items-center justify-end space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{lead.opportunityScore}/100</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(lead);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-glow"
                >
                  Generate Pitch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
