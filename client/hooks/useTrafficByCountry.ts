import { TRAFIC_BY_COUNTRY_KEY } from "@/lib/queryKeys";
import { fetchTrafficByCountry } from "@/services/fetchTrafficByCountry";
import { useQuery } from "@tanstack/react-query";

export function useTrafficByCountry(vehicleType?: string) {
  const { isPending, data } = useQuery({
    queryKey: [TRAFIC_BY_COUNTRY_KEY, { vehicleType }],
    queryFn: () => fetchTrafficByCountry(vehicleType),
    refetchOnWindowFocus: false,
  });
  return { isCurrentDataPending: isPending, data };
}
