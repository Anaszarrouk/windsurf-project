import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRainbow]',
  standalone: true
})
export class RainbowDirective {
  @HostBinding('style.color') color: string = '#ffffff';

  private colors = [
    '#e50914', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96c93d', '#f9ca24', '#f0932b', '#eb4d4b',
    '#6c5ce7', '#a29bfe', '#00cec9', '#fdcb6e'
  ];

  @HostListener('keyup')
  onKeyUp(): void {
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}
