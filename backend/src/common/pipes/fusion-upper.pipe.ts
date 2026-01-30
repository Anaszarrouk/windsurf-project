import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FusionUpperPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Array.isArray(value)) {
      return value.join('-').toUpperCase();
    }
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  }
}
