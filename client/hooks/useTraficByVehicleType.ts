import { TRAFIC_BY_VEHICLE_TYPE_KEY } from "@/lib/queryKeys";
import { fetchTrafficByVehicleType } from "@/services/fetchTrafficByVehicleType";
import { useQuery } from "@tanstack/react-query";

export function useTraficByVehicleType(country?: string) {
  const { isPending, data } = useQuery({
    queryKey: [TRAFIC_BY_VEHICLE_TYPE_KEY, { country }],
    queryFn: async () => {
      const responseData = await fetchTrafficByVehicleType(country);
      return responseData;
    },
    refetchOnWindowFocus: false,
  });
  return { isCurrentDataPending: isPending, data };
}
