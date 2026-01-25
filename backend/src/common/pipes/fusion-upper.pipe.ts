import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

// Exercise 6.1: FusionUpperPipe to transform a 'genres' string array into a hyphenated uppercase string
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
