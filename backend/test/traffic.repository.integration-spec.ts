import { NotFoundException } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Traffic } from '../src/traffic/entities/traffic.entity';
import { TrafficTypeOrmRepository } from '../src/traffic/repositories/traffic.typeorm.repository';

const UAE_CAR_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const UAE_TRUCK_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SAUDI_CAR_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const EGYPT_BUS_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

const EARLIEST = new Date('2026-01-01T00:00:00.000Z');
const MIDDLE = new Date('2026-01-02T00:00:00.000Z');
const LATEST = new Date('2026-01-03T00:00:00.000Z');

describe('TrafficTypeOrmRepository (integration)', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let repository: TrafficTypeOrmRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start();

    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [Traffic],
      synchronize: true,
    });
    await dataSource.initialize();

    repository = new TrafficTypeOrmRepository(
      dataSource.getRepository(Traffic),
    );
  }, 60000);

  afterAll(async () => {
    await dataSource?.destroy();
    await container?.stop();
  });

  beforeEach(async () => {
    const repo = dataSource.getRepository(Traffic);
    await repo.clear();
    await repo.save([
      {
        id: UAE_CAR_ID,
        country: 'UAE',
        vehicleType: 'Car',
        count: 100,
        timestamp: MIDDLE,
      },
      {
        id: UAE_TRUCK_ID,
        country: 'UAE',
        vehicleType: 'Truck',
        count: 50,
        timestamp: MIDDLE,
      },
      {
        id: SAUDI_CAR_ID,
        country: 'Saudi Arabia',
        vehicleType: 'Car',
        count: 200,
        timestamp: LATEST,
      },
      {
        id: EGYPT_BUS_ID,
        country: 'Egypt',
        vehicleType: 'Bus',
        count: 30,
        timestamp: EARLIEST,
      },
    ]);
  });

  it('findByCountry() sums vehicle counts per country', async () => {
    const result = await repository.findByCountry();

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'UAE', count: 150 },
        { group: 'Saudi Arabia', count: 200 },
        { group: 'Egypt', count: 30 },
      ]),
    );
    expect(result).toHaveLength(3);
  });

  it('findByCountry() filters by vehicleType before grouping', async () => {
    const result = await repository.findByCountry({ vehicleType: 'Car' });

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'UAE', count: 100 },
        { group: 'Saudi Arabia', count: 200 },
      ]),
    );
    expect(result).toHaveLength(2);
  });

  it('findByVehicleType() sums vehicle counts per vehicle type', async () => {
    const result = await repository.findByVehicleType();

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'Car', count: 300 },
        { group: 'Truck', count: 50 },
        { group: 'Bus', count: 30 },
      ]),
    );
    expect(result).toHaveLength(3);
  });

  it('findByVehicleType() filters by country before grouping', async () => {
    const result = await repository.findByVehicleType({ country: 'UAE' });

    expect(result).toEqual(
      expect.arrayContaining([
        { group: 'Car', count: 100 },
        { group: 'Truck', count: 50 },
      ]),
    );
    expect(result).toHaveLength(2);
  });

  it('findAll() orders by timestamp DESC, then id ASC for ties', async () => {
    const result = await repository.findAll();

    expect(result.map((record) => record.id)).toEqual([
      SAUDI_CAR_ID,
      UAE_CAR_ID,
      UAE_TRUCK_ID,
      EGYPT_BUS_ID,
    ]);
  });

  it('updateOne() updates an existing record and returns it', async () => {
    const updated = await repository.updateOne(UAE_CAR_ID, 999);

    expect(updated.id).toBe(UAE_CAR_ID);
    expect(updated.count).toBe(999);

    const persisted = await dataSource
      .getRepository(Traffic)
      .findOneBy({ id: UAE_CAR_ID });
    expect(persisted?.count).toBe(999);
  });

  it('updateOne() throws NotFoundException for a missing id', async () => {
    await expect(
      repository.updateOne('00000000-0000-0000-0000-000000000000', 1),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findByCountry() returns empty array when no records matchs the filter', async () => {
    const result = await repository.findByCountry({
      vehicleType: 'Motorcycle',
    });

    expect(result).toEqual([]);
  });

  it('updateOne() does not change the other trafic records', async () => {
    await repository.updateOne(UAE_CAR_ID, 999);

    const otherRecord = await dataSource
      .getRepository(Traffic)
      .findOneBy({ id: UAE_TRUCK_ID });

    expect(otherRecord?.count).toBe(50);
  });
});
