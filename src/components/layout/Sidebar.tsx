'use client';

import React from 'react';
import { useAppStore, NavTab } from '@/lib/store/useStore';
import {
  LayoutDashboard,
  Building2,
  Kanban,
  Zap,
  Radio,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Globe,
  Code2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, toggleSidebar } = useAppStore();

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'leads', label: 'Lead Intelligence', icon: <Building2 className="w-5 h-5" />, badge: '5 Target Regions' },
    { id: 'web-dev', label: 'Website Development', icon: <Code2 className="w-5 h-5" />, badge: 'High Demand' },
    { id: 'pipeline', label: 'Kanban CRM Pipeline', icon: <Kanban className="w-5 h-5" /> },
    { id: 'signals', label: 'Intent Radar Feed', icon: <Radio className="w-5 h-5" />, badge: 'LIVE' },
    { id: 'insurance', label: 'Insurance Agencies', icon: <ShieldCheck className="w-5 h-5" />, badge: 'US & CA' },
    { id: 'connectors', label: 'Lead Connectors', icon: <Zap className="w-5 h-5" /> },
    { id: 'settings', label: 'Platform Controls', icon: <SlidersHorizontal className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } bg-[#0d1322] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out`}
    >
      <div>
        {/* Brand Header */}
        <div className={`p-4 border-b border-slate-800/80 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  EliteOps <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Lead Intelligence Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar (Full Screen Width)'}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Target Country Bar */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Target Markets:
            </span>
            <span className="font-semibold text-slate-200">US, CA, UK, AU, UAE</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                } rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === 'LIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Agency Info */}
      {!isSidebarCollapsed && (
        <div className="p-3 m-2 rounded-2xl glass-panel border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">EliteOps Global</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            High-Intent Automated B2B Lead Discovery & Conversion Engine.
          </p>
        </div>
      )}
    </aside>
  );
};
