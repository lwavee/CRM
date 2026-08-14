import { create } from 'zustand';
import { LeadRecord } from '@/lib/data/mock-db';

export type NavTab = 'dashboard' | 'leads' | 'web-dev' | 'pipeline' | 'signals' | 'connectors' | 'settings' | 'insurance';

export interface FilterState {
  search: string;
  country: string;
  service: string;
  minScore: number;
  status: string;
}

interface AppStore {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  selectedLead: LeadRecord | null;
  setSelectedLead: (lead: LeadRecord | null) => void;
  
  isFilterModalOpen: boolean;
  setFilterModalOpen: (open: boolean) => void;

  isNewLeadModalOpen: boolean;
  setNewLeadModalOpen: (open: boolean) => void;
  
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  isFullscreen: boolean;
  toggleFullscreen: () => void;

  leads: LeadRecord[];
  setLeads: (leads: LeadRecord[]) => void;
  updateLeadStatus: (leadId: string, status: LeadRecord['status']) => void;
}

const initialFilters: FilterState = {
  search: '',
  country: '',
  service: '',
  minScore: 0,
  status: '',
};

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),

  isFilterModalOpen: false,
  setFilterModalOpen: (open) => set({ isFilterModalOpen: open }),

  isNewLeadModalOpen: false,
  setNewLeadModalOpen: (open) => set({ isNewLeadModalOpen: open }),

  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: initialFilters }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  isFullscreen: false,
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

  leads: [],
  setLeads: (leads) => set({ leads }),
  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
      selectedLead:
        state.selectedLead && state.selectedLead.id === leadId
          ? { ...state.selectedLead, status }
          : state.selectedLead,
    })),
}));
