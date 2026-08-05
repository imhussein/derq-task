import { Traffic } from '../entities/traffic.entity';

export const TRAFIC_REPOSITORY = 'TRAFIC_REPOSITORY';

// i did this because it help always in testing or new data source that comes in and want to implement same functions of old database etc...
// so this i always as DI container for testing mostly
export interface TrafficFilter {
  country?: string;
  vehicleType?: string;
}

export interface TrafficGroupCount {
  group: string;
  count: number;
}

export interface ITrafficRepository {
  findAll(): Promise<Traffic[]>;
  findByCountry(filter?: TrafficFilter): Promise<TrafficGroupCount[]>;
  findByVehicleType(filter?: TrafficFilter): Promise<TrafficGroupCount[]>;
  updateOne(id: string, count: number): Promise<Traffic>;
}
