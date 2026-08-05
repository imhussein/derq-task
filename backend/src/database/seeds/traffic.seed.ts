import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Traffic } from '../../traffic/entities/traffic.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<Traffic>>(getRepositoryToken(Traffic));

  await repo.clear();

  const countries = ['Egypt', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'];
  const vehicleTypes = ['Car', 'Truck', 'Bus', 'Motorcycle', 'Van'];

  const records: Partial<Traffic>[] = [];
  for (const country of countries) {
    for (const vehicleType of vehicleTypes) {
      records.push({
        country,
        vehicleType,
        count: Math.floor(Math.random() * 1000) + 50,
        timestamp: new Date(),
      });
    }
  }

  await repo.save(records);
  console.log(`Seeded ${records.length} traffic records`);
  await app.close();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
