"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const custom_filter_1 = require("./common/filters/custom.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const request_duration_interceptor_1 = require("./common/interceptors/request-duration.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new custom_filter_1.CustomFilter());
    app.useGlobalInterceptors(new request_duration_interceptor_1.RequestDurationInterceptor(), new transform_interceptor_1.TransformInterceptor());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`CineVault API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map