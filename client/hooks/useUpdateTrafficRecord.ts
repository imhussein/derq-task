import {
  TRAFFIC_RECORDS_KEY,
  TRAFIC_BY_COUNTRY_KEY,
  TRAFIC_BY_VEHICLE_TYPE_KEY,
} from "@/lib/queryKeys";
import { updateTrafficRecord } from "@/services/updateTrafficRecord";
import type { TrafficRecord } from "@/types/traffic";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTrafficRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vehicleCount }: { id: string; vehicleCount: number }) =>
      updateTrafficRecord(id, vehicleCount),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData<TrafficRecord[]>(
        [TRAFFIC_RECORDS_KEY],
        (records) =>
          records?.map((record) =>
            record.id === updatedRecord.id ? updatedRecord : record,
          ),
      );
      queryClient.invalidateQueries({ queryKey: [TRAFIC_BY_COUNTRY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [TRAFIC_BY_VEHICLE_TYPE_KEY],
      });
    },
  });
}
