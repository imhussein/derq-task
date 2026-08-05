import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Traffic } from '../entities/traffic.entity';
import {
  ITrafficRepository,
  TrafficFilter,
  TrafficGroupCount,
} from '../interfaces/traffic-repository.interface';

@Injectable()
export class TrafficTypeOrmRepository implements ITrafficRepository {
  constructor(
    @InjectRepository(Traffic)
    private readonly repo: Repository<Traffic>,
  ) {}

  findAll(): Promise<Traffic[]> {
    return this.repo.find({ order: { timestamp: 'DESC', id: 'ASC' } });
  }

  async findByCountry(filter?: TrafficFilter): Promise<TrafficGroupCount[]> {
    const qb = this.repo
      .createQueryBuilder('traffic')
      .select('traffic.country', 'group')
      .addSelect('SUM(traffic.count)', 'count')
      .groupBy('traffic.country');

    if (filter && filter.vehicleType) {
      qb.andWhere('traffic.vehicleType = :vehicleType', {
        vehicleType: filter.vehicleType,
      });
    }

    const rows = await qb.getRawMany<{ group: string; count: string }>();
    return rows.map((row) => ({ group: row.group, count: Number(row.count) }));
  }

  async findByVehicleType(
    filter?: TrafficFilter,
  ): Promise<TrafficGroupCount[]> {
    const qb = this.repo
      .createQueryBuilder('traffic')
      .select('traffic.vehicleType', 'group')
      .addSelect('SUM(traffic.count)', 'count')
      .groupBy('traffic.vehicleType');

    if (filter && filter.country) {
      qb.andWhere('traffic.country = :country', { country: filter.country });
    }

    const rows = await qb.getRawMany<{ group: string; count: string }>();
    return rows.map((row) => ({ group: row.group, count: Number(row.count) }));
  }

  async updateOne(id: string, count: number): Promise<Traffic> {
    const record = await this.repo.findOneBy({ id });

    if (!record) {
      throw new NotFoundException(`Traffic record ${id} not found`);
    }

    record.count = count;
    return this.repo.save(record);
  }
}
