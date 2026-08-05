import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Env } from './config/env';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  setupApp(app);

  if (process.env.NODE_ENV === 'development') {
    // i did Just only for the UX in dev mod
    app.use((req, res, next) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          next();
        }, 400);
      });
    });
  }

  const configService = app.get(ConfigService<Env, true>);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Derq Trafic Task API')
    .setDescription(
      'this is the Endpoints for fething and updating trafic data',
    )
    .setVersion('1.0')
    .addTag('trafic')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    logger.log('Database is connected successfully ');
  }

  const port = configService.get('PORT', { infer: true });
  await app.listen(port);
  logger.log(`Trafic API listening on port ${port}`);
  logger.log(`Swagger docs is running at /docs`);
}
void bootstrap();
