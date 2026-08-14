'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import {
  X,
  Sparkles,
  ExternalLink,
  Zap,
  Globe,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Copy,
  Check,
  Send,
  FileText,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export const LeadDetailsDrawer: React.FC = () => {
  const { selectedLead, setSelectedLead, updateLeadStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'outreach'>('overview');
  const [outreachTab, setOutreachTab] = useState<'email' | 'followup1' | 'followup2' | 'linkedin' | 'call'>('email');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!selectedLead) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTriggerAIResearch = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/ai-research`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSelectedLead(data.lead);
        setActiveTab('outreach');
      }
    } catch (err) {
      console.error('Failed to run AI research:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const primaryDm = selectedLead.decisionMakers.find((dm) => dm.isPrimary) || selectedLead.decisionMakers[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-[#0f172a] border-l border-slate-700/80 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                {selectedLead.country}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {selectedLead.industry}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
              {selectedLead.name}
              <a
                href={selectedLead.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {selectedLead.city}, {selectedLead.state} • Est. Revenue {selectedLead.estimatedRevenue}
            </p>
          </div>

          <button
            onClick={() => setSelectedLead(null)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-6">
          {[
            { id: 'overview', label: 'Company Overview' },
            { id: 'audit', label: 'Website Audit & Signals' },
            { id: 'outreach', label: 'AI Pitch & Outreach' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs">
              {/* Score Highlight Box */}
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">AI Opportunity Score</span>
                  <div className="text-3xl font-extrabold text-emerald-400 flex items-center gap-2 mt-1">
                    <Sparkles className="w-6 h-6" />
                    <span>{selectedLead.opportunityScore} / 100</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    High intent company actively matching EliteOps Global service matrix.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">Est. Contract Value</span>
                  <div className="text-lg font-bold text-white mt-1">
                    ${selectedLead.estimatedDealValue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* AI Business Synthesis */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">AI Intelligence Synthesis</h4>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <p className="text-slate-300 leading-relaxed">{selectedLead.aiSummary.businessSummary}</p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-blue-400 font-semibold">
                    <span>Target Pitch:</span>
                    <span>{selectedLead.aiSummary.primaryPitchReason}</span>
                  </div>
                </div>
              </div>

              {/* Decision Makers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Verified Decision Makers & Executive Leadership
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    CEO • Founder • Marketing Manager
                  </span>
                </div>

                {selectedLead.decisionMakers && selectedLead.decisionMakers.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedLead.decisionMakers.map((dm) => (
                      <div
                        key={dm.id || dm.email}
                        className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 transition"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{dm.fullName}</span>
                            {dm.isPrimary && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-blue-300 font-medium">{dm.jobTitle}</div>
                          <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs text-slate-300 font-mono">
                            <span className="flex items-center gap-1 text-blue-400">
                              <Mail className="w-3.5 h-3.5" /> {dm.email}
                            </span>
                            {dm.phone && (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <Phone className="w-3.5 h-3.5" /> {dm.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCopy(dm.email, dm.email)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                            title="Copy Email"
                          >
                            {copiedField === dm.email ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {dm.linkedInUrl && (
                            <a
                              href={
                                dm.linkedInUrl.includes('search/results') || dm.linkedInUrl.includes('company/')
                                  ? dm.linkedInUrl
                                  : `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(dm.fullName + ' ' + selectedLead.name)}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                              title="Search Verified LinkedIn Account"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                              <span>Search LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-400">No contact attached.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT & SIGNALS */}
          {activeTab === 'audit' && (
            <div className="space-y-6 text-xs">
              {/* Technical Performance Scorecards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Load Speed</div>
                  <div className={`text-xl font-extrabold mt-1 ${selectedLead.websiteAudit.loadTimeSeconds > 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedLead.websiteAudit.loadTimeSeconds}s
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">SEO Score</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-1">
                    {selectedLead.websiteAudit.seoScore}/100
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">SSL Secure</div>
                  <div className={`text-sm font-extrabold mt-2 ${selectedLead.websiteAudit.hasSsl ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedLead.websiteAudit.hasSsl ? 'VERIFIED ✓' : 'MISSING ✗'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Broken Links</div>
                  <div className="text-xl font-extrabold text-amber-400 mt-1">
                    {selectedLead.websiteAudit.brokenLinksCount}
                  </div>
                </div>
              </div>

              {/* Buying Signals */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Detected Buying Signals</h4>
                <div className="space-y-2">
                  {selectedLead.buyingSignals.map((sig) => (
                    <div key={sig.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-200">{sig.title}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">Detected: {sig.detectedAt}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {sig.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUTREACH GENERATOR */}
          {activeTab === 'outreach' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">AI Personalized Copywriter</h4>
                <button
                  onClick={handleTriggerAIResearch}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate Sequence</span>
                </button>
              </div>

              {/* Sub Outreach Selector */}
              <div className="flex space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                {[
                  { id: 'email', label: 'Cold Email' },
                  { id: 'followup1', label: 'Follow-up 1' },
                  { id: 'followup2', label: 'Follow-up 2' },
                  { id: 'linkedin', label: 'LinkedIn DM' },
                  { id: 'call', label: 'Call Script' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setOutreachTab(item.id as any)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
                      outreachTab === item.id ? 'bg-blue-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Active Outreach Text Box */}
              <div className="relative glass-panel p-5 rounded-2xl border border-slate-700/80 bg-slate-900/90 font-sans leading-relaxed text-slate-200 whitespace-pre-wrap">
                {selectedLead.outreachSequence ? (
                  selectedLead.outreachSequence[
                    outreachTab === 'email'
                      ? 'coldEmail'
                      : outreachTab === 'followup1'
                      ? 'followUp1'
                      : outreachTab === 'followup2'
                      ? 'followUp2'
                      : outreachTab === 'linkedin'
                      ? 'linkedInMessage'
                      : 'callScript'
                  ]
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    Click "Regenerate Sequence" above to auto-synthesize custom outreach for {selectedLead.name}.
                  </div>
                )}

                {selectedLead.outreachSequence && (
                  <button
                    onClick={() =>
                      handleCopy(
                        selectedLead.outreachSequence![
                          outreachTab === 'email'
                            ? 'coldEmail'
                            : outreachTab === 'followup1'
                            ? 'followUp1'
                            : outreachTab === 'followup2'
                            ? 'followUp2'
                            : outreachTab === 'linkedin'
                            ? 'linkedInMessage'
                            : 'callScript'
                        ],
                        outreachTab
                      )
                    }
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  >
                    {copiedField === outreachTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CRM Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">CRM Stage:</span>
            <select
              value={selectedLead.status}
              onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none"
            >
              <option value="NEW">New</option>
              <option value="RESEARCHING">Researching</option>
              <option value="CONTACTED">Contacted</option>
              <option value="EMAIL_SENT">Email Sent</option>
              <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Closed Won</option>
              <option value="LOST">Closed Lost</option>
            </select>
          </div>

          <button
            onClick={() => {
              updateLeadStatus(selectedLead.id, 'EMAIL_SENT');
              setSelectedLead(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald flex items-center space-x-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Mark Outreach Sent</span>
          </button>
        </div>
      </div>
    </div>
  );
};
