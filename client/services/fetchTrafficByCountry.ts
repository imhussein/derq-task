import api from "@/lib/api";
import type { TrafficAggregate } from "@/types/traffic";

export async function fetchTrafficByCountry(vehicleType?: string) {
  const params = { vehicleType };
  const { data } = await api.get<TrafficAggregate[]>("/traffic/by-country", {
    params,
  });
  return data;
}
