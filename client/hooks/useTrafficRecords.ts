import { TRAFFIC_RECORDS_KEY } from "@/lib/queryKeys";
import { fetchTrafficRecords } from "@/services/fetchTrafficRecords";
import { useQuery } from "@tanstack/react-query";

export function useTraficRecords() {
  const { isPending, data } = useQuery({
    queryKey: [TRAFFIC_RECORDS_KEY],
    queryFn: () => {
      return fetchTrafficRecords();
    },
    refetchOnWindowFocus: false,
  });
  return { isCurrentDataPending: isPending, data };
}
