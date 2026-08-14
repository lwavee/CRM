'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { LeadRecord } from '@/lib/data/mock-db';
import {
  Kanban,
  Building2,
  DollarSign,
  Sparkles,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';

const STAGES: Array<{ id: LeadRecord['status']; label: string; color: string }> = [
  { id: 'NEW', label: 'New Discovered', color: 'border-blue-500/40 text-blue-400' },
  { id: 'RESEARCHING', label: 'AI Researching', color: 'border-indigo-500/40 text-indigo-400' },
  { id: 'CONTACTED', label: 'Contacted', color: 'border-cyan-500/40 text-cyan-400' },
  { id: 'EMAIL_SENT', label: 'Outreach Sent', color: 'border-amber-500/40 text-amber-400' },
  { id: 'MEETING_SCHEDULED', label: 'Meeting Set', color: 'border-violet-500/40 text-violet-400' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'border-emerald-500/40 text-emerald-400' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'border-pink-500/40 text-pink-400' },
  { id: 'WON', label: 'Closed Won', color: 'border-teal-500/40 text-teal-300' },
  { id: 'LOST', label: 'Closed Lost', color: 'border-slate-700 text-slate-500' },
];

export const KanbanPipeline: React.FC = () => {
  const { leads, setLeads, setSelectedLead, updateLeadStatus } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, [setLeads]);

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-400" /> Agency CRM Kanban Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track deal stages, proposal values, and meeting schedules in real time
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Active Pipeline</div>
          <div className="text-xl font-extrabold text-emerald-400">
            ${leads.reduce((acc, l) => acc + l.estimatedDealValue, 0).toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex space-x-4 min-w-[1300px] pb-6 overflow-x-auto">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const stageTotalValue = stageLeads.reduce((acc, l) => acc + l.estimatedDealValue, 0);

          return (
            <div
              key={stage.id}
              className="w-72 bg-[#0d1322]/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shrink-0 min-h-[600px]"
            >
              {/* Column Header */}
              <div className={`border-b pb-3 mb-3 flex items-center justify-between ${stage.color}`}>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">{stage.label}</h3>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    ${(stageTotalValue / 1000).toFixed(1)}k • {stageLeads.length} deals
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-current" />
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-slate-600 text-[11px] border border-dashed border-slate-800/80 rounded-xl">
                    No active deals in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="glass-panel p-4 rounded-xl border border-slate-800/90 hover:border-blue-500/40 hover:bg-slate-800/50 cursor-pointer space-y-2.5 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-100 text-xs hover:text-blue-400 transition">
                            {lead.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{lead.industry}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {lead.country}
                        </span>
                      </div>

                      {/* Signals & Score */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {lead.opportunityScore}/100
                        </span>
                        <span className="font-bold text-slate-200">
                          ${lead.estimatedDealValue.toLocaleString()}
                        </span>
                      </div>

                      {/* Quick Stage Move Dropdown */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move to {s.label}
                            </option>
                          ))}
                        </select>

                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
