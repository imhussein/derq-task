import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Traffic } from './entities/traffic.entity';
import {
  ITrafficRepository,
  TRAFIC_REPOSITORY,
  TrafficFilter,
  TrafficGroupCount,
} from './interfaces/traffic-repository.interface';
import { TraficService } from './traffic.service';

const createTraffic = (data: Partial<Traffic>): Traffic => ({
  id: '1',
  country: 'UAE',
  vehicleType: 'Car',
  count: 0,
  timestamp: new Date('2026-01-01'),
  ...data,
});

class InMemoryTrafficRepository implements ITrafficRepository {
  private readonly traffic: Traffic[] = [
    createTraffic({
      id: '1',
      country: 'UAE',
      vehicleType: 'Car',
      count: 100,
    }),
    createTraffic({
      id: '2',
      country: 'UAE',
      vehicleType: 'Truck',
      count: 50,
    }),
    createTraffic({
      id: '3',
      country: 'Saudi Arabia',
      vehicleType: 'Car',
      count: 200,
    }),
    createTraffic({
      id: '4',
      country: 'Saudi Arabia',
      vehicleType: 'Bus',
      count: 30,
    }),
    createTraffic({
      id: '5',
      country: 'Egypt',
      vehicleType: 'Car',
      count: 75,
    }),
  ];

  async findAll(): Promise<Traffic[]> {
    return [...this.traffic].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  async findByCountry(filter?: TrafficFilter): Promise<TrafficGroupCount[]> {
    const totals = new Map<string, number>();

    for (const record of this.traffic) {
      if (filter?.vehicleType && record.vehicleType !== filter.vehicleType) {
        continue;
      }

      totals.set(
        record.country,
        (totals.get(record.country) ?? 0) + record.count,
      );
    }

    return [...totals.entries()].map(([group, count]) => ({
      group,
      count,
    }));
  }

  async findByVehicleType(
    filter?: TrafficFilter,
  ): Promise<TrafficGroupCount[]> {
    const totals = new Map<string, number>();

    for (const record of this.traffic) {
      if (filter?.country && record.country !== filter.country) {
        continue;
      }

      totals.set(
        record.vehicleType,
        (totals.get(record.vehicleType) ?? 0) + record.count,
      );
    }

    return [...totals.entries()].map(([group, count]) => ({
      group,
      count,
    }));
  }

  async updateOne(id: string, count: number): Promise<Traffic> {
    const record = this.traffic.find((item) => item.id === id);

    if (!record) {
      throw new NotFoundException(`Traffic record ${id} not found`);
    }

    record.count = count;
    return record;
  }
}

describe('TraficService', () => {
  let service: TraficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TraficService,
        {
          provide: TRAFIC_REPOSITORY,
          useClass: InMemoryTrafficRepository,
        },
      ],
    }).compile();

    service = module.get(TraficService);
  });

  it('returns traffic grouped by country', async () => {
    const result = await service.fetchByCountry({});

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'UAE', count: 150 },
        { group: 'Saudi Arabia', count: 230 },
        { group: 'Egypt', count: 75 },
      ]),
    );
  });

  it('returns traffic grouped by vehicle type', async () => {
    const result = await service.getByVehicleType({});

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'Car', count: 375 },
        { group: 'Truck', count: 50 },
        { group: 'Bus', count: 30 },
      ]),
    );
  });

  it('filters countries by vehicle type', async () => {
    const result = await service.fetchByCountry({
      vehicleType: 'Car',
    });

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'UAE', count: 100 },
        { group: 'Saudi Arabia', count: 200 },
        { group: 'Egypt', count: 75 },
      ]),
    );
  });

  it('updates a traffic record', async () => {
    const result = await service.updateRecord('1', {
      vehicleCount: 999,
    });

    expect(result.count).toBe(999);
    expect(result.id).toBe('1');
  });

  it('throws if the record does not exist', async () => {
    await expect(
      service.updateRecord('missing-id', {
        vehicleCount: 10,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
