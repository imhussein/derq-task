import api from '@/lib/api';
import type { TrafficRecord } from '@/types/traffic';

export async function fetchTrafficRecords() {
  const { data } = await api.get<TrafficRecord[]>('/traffic');
  return data;
}
