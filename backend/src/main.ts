import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('app.port');
  const uploadDir = resolve(config.getOrThrow<string>('upload.dir'));

  mkdirSync(uploadDir, { recursive: true });

  app.setGlobalPrefix('api');
  app.enableCors({ origin: config.getOrThrow<string[]>('app.corsOrigins'), credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useStaticAssets(uploadDir, { prefix: '/uploads', maxAge: '7d' });
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SamDU.uz API')
    .setDescription(
      'Samarqand davlat universiteti rasmiy sayti uchun REST API. Ko\'p tillik kontent: uz, ru, en. ' +
        'Himoyalangan endpointlar uchun /api/auth/login orqali token oling va "Authorize" tugmasini bosing.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(config.getOrThrow<string>('app.publicUrl'))
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SamDU API Docs',
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none', tagsSorter: 'alpha' },
  });

  await app.listen(port, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`API: http://localhost:${port}/api`);
  logger.log(`Swagger: http://localhost:${port}/api/docs`);
}

void bootstrap();
