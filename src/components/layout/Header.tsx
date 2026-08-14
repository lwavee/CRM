'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Search, Plus, Bell, Filter, Maximize2, Minimize2, PanelLeft, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    filters,
    setFilters,
    setFilterModalOpen,
    setNewLeadModalOpen,
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
  } = useAppStore();

  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      // Optionally also collapse sidebar for maximum screen space
      if (!isSidebarCollapsed) {
        toggleSidebar();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  return (
    <header className="h-16 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 transition"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search leads by name, technology (React, WP), industry, city..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {activeTab === 'leads' && (
          <button
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filters</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Executive Dashboard Switcher */}
        {activeTab !== 'dashboard' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Dashboard</span>
          </button>
        )}

        {/* Fullscreen Toggle Button */}
        <button
          onClick={handleToggleFullscreen}
          title={isBrowserFullscreen ? 'Exit Full Screen' : 'Show Full Screen'}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
            isBrowserFullscreen
              ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-glow'
              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-300'
          }`}
        >
          {isBrowserFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Exit Full Screen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline font-medium">Full Screen</span>
            </>
          )}
        </button>

        {/* Real-time System Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">AI Queue Active</span>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 relative transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Add New Lead Button */}
        <button
          onClick={() => setNewLeadModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>
    </header>
  );
};
