import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'derq'),
  autoLoadEntities: true,
  // In Production this is always false feeded from K8 env variables but local dev environment is ok to have this for small tiny model but production always will use migrations for controlled schema changes, rollback safety, and predictable deployments.
  synchronize: configService.get<string>('DB_SYNC', 'false') === 'true',
});
