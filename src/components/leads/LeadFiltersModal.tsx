'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export const LeadFiltersModal: React.FC = () => {
  const { isFilterModalOpen, setFilterModalOpen, filters, setFilters, resetFilters } = useAppStore();

  if (!isFilterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700/80 w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Filter Lead Intelligence</h3>
          </div>
          <button
            onClick={() => setFilterModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 text-xs">
          {/* Target Country */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">Target Market Region</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ country: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Target Regions (USA, CA, UK, AU, UAE)</option>
              <option value="USA">🇺🇸 United States</option>
              <option value="CANADA">🇨🇦 Canada</option>
              <option value="UNITED_KINGDOM">🇬🇧 United Kingdom</option>
              <option value="AUSTRALIA">🇦🇺 Australia</option>
              <option value="UAE">🇦🇪 United Arab Emirates</option>
            </select>
          </div>

          {/* Recommended Service */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">Recommended Service Match</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ service: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Agency Services</option>
              <option value="WEBSITE_DEVELOPMENT">💻 Website Development (Next.js / React / WP)</option>
              <option value="DIGITAL_MARKETING">📈 Digital Marketing (SEO / Google Ads)</option>
              <option value="BACK_OFFICE_SUPPORT">🏢 Back Office Support & Data Entry</option>
              <option value="VIRTUAL_ASSISTANT">🤝 Virtual Assistant & Staffing</option>
              <option value="AUTOMATION">⚙️ Workflow Automation & CRM</option>
              <option value="AI_SOLUTIONS">🤖 Custom AI Solutions</option>
            </select>
          </div>

          {/* Opportunity Score Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-300">Minimum AI Opportunity Score</label>
              <span className="font-extrabold text-blue-400">{filters.minScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={filters.minScore}
              onChange={(e) => setFilters({ minScore: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* CRM Stage */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">CRM Deal Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Stages</option>
              <option value="NEW">New Discovered</option>
              <option value="RESEARCHING">AI Researching</option>
              <option value="CONTACTED">Contacted</option>
              <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="WON">Closed Won</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => resetFilters()}
            className="flex items-center space-x-1.5 px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={() => setFilterModalOpen(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-glow transition flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
