import type { TrafficRecord } from "@/types/traffic";
import { create } from "zustand";

interface EditTrafficFormState {
  isOpen: boolean;
  recordId: string | null;
  vehicleCount: number | "";

  openDialog: (record: TrafficRecord) => void;
  setVehicleCount: (value: number | "") => void;
  closeDialog: () => void;
}

export const useEditTrafficFormStore = create<EditTrafficFormState>((set) => {
  return {
    isOpen: false,
    recordId: null,
    vehicleCount: 0,

    openDialog: (record) =>
      set({ isOpen: true, recordId: record.id, vehicleCount: record.count }),
    setVehicleCount: (value) => set({ vehicleCount: value }),
    closeDialog: () => set({ isOpen: false, recordId: null, vehicleCount: 0 }),
  };
});
