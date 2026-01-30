import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage',
  standalone: true
})
export class DefaultImagePipe implements PipeTransform {
  transform(value: string | null | undefined, defaultImage: string = 'https://via.placeholder.com/300x450?text=No+Poster'): string {
    return value && value.trim() !== '' ? value : defaultImage;
  }
}
