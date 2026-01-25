import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

// Exercise 6.2: FreezePipe to Object.freeze() incoming data
@Injectable()
export class FreezePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === 'object') {
      return Object.freeze(value);
    }
    return value;
  }
}
