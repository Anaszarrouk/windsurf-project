import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class CustomFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
