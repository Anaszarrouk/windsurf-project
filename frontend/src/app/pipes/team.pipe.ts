import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'team',
  standalone: true
})
export class TeamPipe implements PipeTransform {
  private nicknames: { [key: string]: string } = {
    'john': 'Johnny Boy',
    'jane': 'Janie',
    'mike': 'Mikey',
    'sarah': 'Sally',
    'admin': 'The Boss',
    'manager': 'Chief'
  };

  transform(value: string): string {
    const lowerValue = value.toLowerCase();
    return this.nicknames[lowerValue] || value;
  }
}
