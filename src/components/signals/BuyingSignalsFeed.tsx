'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Radio, Zap, AlertTriangle, Building2, ExternalLink, ArrowRight } from 'lucide-react';

export const BuyingSignalsFeed: React.FC = () => {
  const { leads, setSelectedLead } = useAppStore();

  // Aggregate all buying signals across leads
  const allSignals = leads.flatMap((lead) =>
    lead.buyingSignals.map((sig) => ({
      ...sig,
      lead,
    }))
  );

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" /> Live Intent Radar & Buying Signals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of detected hiring jobs, website audits, and funding announcements
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          {allSignals.length} Active Signals Flagged Today
        </span>
      </div>

      <div className="space-y-4">
        {allSignals.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={() => setSelectedLead(item.lead)}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Detected for <strong className="text-slate-200">{item.lead.name}</strong> ({item.lead.country}) • {item.detectedAt}
                </p>
                <div className="text-[11px] text-blue-400 font-semibold mt-1">
                  Recommended Service: {item.lead.recommendedService} (${item.lead.estimatedDealValue.toLocaleString()} Project)
                </div>
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition">
              <span>View Audit & Pitch</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
