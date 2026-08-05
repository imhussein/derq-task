import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traffic } from './entities/traffic.entity';
import { TRAFIC_REPOSITORY } from './interfaces/traffic-repository.interface';
import { TrafficTypeOrmRepository } from './repositories/traffic.typeorm.repository';
import { TrafficController } from './traffic.controller';
import { TraficService } from './traffic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Traffic])],
  controllers: [TrafficController],
  providers: [
    TraficService,
    {
      provide: TRAFIC_REPOSITORY,
      useClass: TrafficTypeOrmRepository,
    },
  ],
})
export class TrafficModule {}
