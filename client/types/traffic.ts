export interface TrafficAggregate {
  group: string;
  count: number;
}

export interface TrafficRecord {
  id: string;
  country: string;
  vehicleType: string;
  count: number;
  timestamp: string;
}
