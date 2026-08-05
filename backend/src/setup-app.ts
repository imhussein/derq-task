import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import morgan from 'morgan';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { createValidationException } from './common/pipes/validation-exception.factory';
import { Env } from './config/env';

export function setupApp(app: INestApplication): void {
  const httpLogger = new Logger('HTTP');

  app.use(helmet());

  app.use(
    morgan('dev', {
      stream: { write: (message: string) => httpLogger.log(message.trim()) },
    }),
  );

  const configService = app.get(ConfigService<Env, true>);

  app.enableCors({ origin: configService.get('CORS_ORIGIN', { infer: true }) });

  const validationTransform = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: createValidationException,
  });
  app.useGlobalPipes(validationTransform);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
}
