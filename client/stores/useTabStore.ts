import { create } from 'zustand';

export type TrafficTab = 'by-country' | 'by-vehicle-type';

interface TabState {
  activeTab: TrafficTab;
  setActiveTab: (tab: TrafficTab) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'by-country',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
