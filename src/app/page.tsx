'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { LeadIntelligenceHub } from '@/components/leads/LeadIntelligenceHub';
import { KanbanPipeline } from '@/components/pipeline/KanbanPipeline';
import { BuyingSignalsFeed } from '@/components/signals/BuyingSignalsFeed';
import { ConnectorSettings } from '@/components/connectors/ConnectorSettings';
import { InsuranceCompaniesHub } from '@/components/insurance/InsuranceCompaniesHub';
import { WebDevClientsHub } from '@/components/webdev/WebDevClientsHub';
import { LeadFiltersModal } from '@/components/leads/LeadFiltersModal';
import { LeadDetailsDrawer } from '@/components/leads/LeadDetailsDrawer';
import { NewLeadModal } from '@/components/leads/NewLeadModal';

export default function MainPage() {
  const { activeTab } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'dashboard' && <ExecutiveDashboard />}
          {activeTab === 'leads' && <LeadIntelligenceHub />}
          {activeTab === 'web-dev' && <WebDevClientsHub />}
          {activeTab === 'pipeline' && <KanbanPipeline />}
          {activeTab === 'signals' && <BuyingSignalsFeed />}
          {activeTab === 'insurance' && <InsuranceCompaniesHub />}
          {activeTab === 'connectors' && <ConnectorSettings />}
          {activeTab === 'settings' && <ConnectorSettings />}
        </main>
      </div>

      {/* Overlays & Modals */}
      <LeadFiltersModal />
      <LeadDetailsDrawer />
      <NewLeadModal />
    </div>
  );
}
