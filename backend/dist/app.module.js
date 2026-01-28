"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const movie_module_1 = require("./movie/movie.module");
const genre_module_1 = require("./genre/genre.module");
const screening_task_module_1 = require("./screening-task/screening-task.module");
const screening_module_1 = require("./screening/screening.module");
const report_module_1 = require("./report/report.module");
const common_module_1 = require("./common/common.module");
const review_module_1 = require("./review/review.module");
const first_middleware_1 = require("./common/middleware/first.middleware");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(first_middleware_1.FirstMiddleware, logger_middleware_1.LoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', '127.0.0.1'),
                    port: Number(configService.get('DB_PORT', 3306)),
                    username: configService.get('DB_USERNAME', 'root'),
                    password: configService.get('DB_PASSWORD', ''),
                    database: configService.get('DB_DATABASE', 'cinevault_dev'),
                    autoLoadEntities: true,
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            movie_module_1.MovieModule,
            review_module_1.ReviewModule,
            genre_module_1.GenreModule,
            screening_task_module_1.ScreeningTaskModule,
            screening_module_1.ScreeningModule,
            report_module_1.ReportModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map