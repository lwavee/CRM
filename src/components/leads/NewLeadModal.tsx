'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { X, Building2, Plus, Sparkles } from 'lucide-react';

export const NewLeadModal: React.FC = () => {
  const { isNewLeadModalOpen, setNewLeadModalOpen, setLeads, leads } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: 'Financial Services',
    country: 'USA',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    loadTimeSeconds: '3.8',
    performanceScore: '55',
  });
  const [loading, setLoading] = useState(false);

  if (!isNewLeadModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          loadTimeSeconds: parseFloat(formData.loadTimeSeconds),
          performanceScore: parseInt(formData.performanceScore, 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads([data.lead, ...leads]);
        setNewLeadModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create lead:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700/80 w-full max-w-xl rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Add Company for AI Intelligence Audit</h3>
          </div>
          <button
            onClick={() => setNewLeadModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Trading"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Website URL *</label>
              <input
                type="url"
                required
                placeholder="https://apexglobal.example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Market Region</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="USA">🇺🇸 United States</option>
                <option value="CANADA">🇨🇦 Canada</option>
                <option value="UNITED_KINGDOM">🇬🇧 United Kingdom</option>
                <option value="AUSTRALIA">🇦🇺 Australia</option>
                <option value="UAE">🇦🇪 United Arab Emirates</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Industry Sector</label>
              <input
                type="text"
                placeholder="e.g. Financial Services"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Primary Executive Contact</h4>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={formData.contactTitle}
                onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setNewLeadModalOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-glow flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Lead...' : 'Run AI Audit & Add'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
