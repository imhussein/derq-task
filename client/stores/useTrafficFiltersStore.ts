import { create } from 'zustand';

interface TrafficFiltersState {
  country?: string;
  vehicleType?: string;
  setCountry: (country?: string) => void;
  setVehicleType: (vehicleType?: string) => void;
}

export const useTrafficFiltersStore = create<TrafficFiltersState>((set) => ({
  country: undefined,
  vehicleType: undefined,
  setCountry: (country) => set({ country }),
  setVehicleType: (vehicleType) => set({ vehicleType }),
}));
