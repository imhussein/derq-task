import { Inject, Injectable } from '@nestjs/common';
import { GetTrafficQueryDto } from './dto/get-traffic-query.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import type { ITrafficRepository } from './interfaces/traffic-repository.interface';
import { TRAFIC_REPOSITORY } from './interfaces/traffic-repository.interface';

@Injectable()
export class TraficService {
  constructor(
    @Inject(TRAFIC_REPOSITORY)
    private readonly trafficRepository: ITrafficRepository,
  ) {}

  fetchAll() {
    return this.trafficRepository.findAll();
  }

  fetchByCountry(query: GetTrafficQueryDto) {
    return this.trafficRepository.findByCountry({
      vehicleType: query.vehicleType,
    });
  }

  getByVehicleType(query: GetTrafficQueryDto) {
    return this.trafficRepository.findByVehicleType({ country: query.country });
  }

  updateRecord(id: string, dto: UpdateTrafficDto) {
    return this.trafficRepository.updateOne(id, dto.vehicleCount);
  }
}
