import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { ScreeningTaskModule } from './screening-task/screening-task.module';
import { ScreeningModule } from './screening/screening.module';
import { CommonModule } from './common/common.module';
import { ReviewModule } from './review/review.module';
import { FirstMiddleware } from './common/middleware/first.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    // ConfigModule with .env support for different environments
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // TypeORM with MySQL configuration
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST', '127.0.0.1'),
    port: Number(configService.get<number>('DB_PORT', 3306)),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', 'cinevault_dev'),
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
  }),
  inject: [ConfigService],
}),
    CommonModule,
    AuthModule,
    MovieModule,
    ReviewModule,
    GenreModule,
    ScreeningTaskModule,
    ScreeningModule,
  ],
})
export class AppModule implements NestModule {
  // Exercise 4.1 & 4.2: Apply middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirstMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
