import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { CustomFilter } from './common/filters/custom.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RequestDurationInterceptor } from './common/interceptors/request-duration.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Exercise 2.1: URI Versioning (v1 for memory, v2 for TypeORM)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exercise 7.1: Global Custom Exception Filter
  app.useGlobalFilters(new CustomFilter());

  // Exercise 8.1 & 8.2: Global Interceptors
  app.useGlobalInterceptors(
    new RequestDurationInterceptor(),
    new TransformInterceptor(),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`CineVault API running on http://localhost:${port}`);
}
bootstrap();
