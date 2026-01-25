import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class FusionUpperPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
