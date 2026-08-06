import api from '@/lib/api';
import type { TrafficAggregate } from '@/types/traffic';

export async function fetchTrafficByVehicleType(country?: string) {
  const { data } = await api.get<TrafficAggregate[]>('/traffic/by-vehicle-type', {
    params: { country },
  });
  return data;
}
