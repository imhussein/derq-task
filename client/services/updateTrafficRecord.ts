import api from "@/lib/api";
import type { TrafficRecord } from "@/types/traffic";

export async function updateTrafficRecord(id: string, vehicleCount: number) {
  const params = { vehicleCount };
  const { data } = await api.patch<TrafficRecord>(`/traffic/${id}`, params);
  return data;
}
