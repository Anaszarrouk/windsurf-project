import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgClass } from '@angular/common';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [FormsModule, NgStyle, NgClass],
  template: `
    <div class="word-container">
      <h2 class="page-title">Word Style Simulator (ngStyle/ngClass)</h2>
      <div class="controls card">
        <div class="form-group">
          <label>Text</label>
          <input type="text" [(ngModel)]="text">
        </div>
        <div class="form-group">
          <label>Font Size (px)</label>
          <input type="number" [(ngModel)]="fontSize" min="10" max="72">
        </div>
        <div class="form-group">
          <label>Text Color</label>
          <input type="color" [(ngModel)]="textColor">
        </div>
        <div class="form-group">
          <label>Background</label>
          <input type="color" [(ngModel)]="bgColor">
        </div>
        <div class="toggles">
          <label><input type="checkbox" [(ngModel)]="isBold"> Bold</label>
          <label><input type="checkbox" [(ngModel)]="isItalic"> Italic</label>
          <label><input type="checkbox" [(ngModel)]="isUnderline"> Underline</label>
        </div>
      </div>
      <div class="preview card">
        <h3>Preview</h3>
        <p 
          [ngStyle]="{
            'font-size.px': fontSize,
            'color': textColor,
            'background-color': bgColor
          }"
          [ngClass]="{
            'bold': isBold,
            'italic': isItalic,
            'underline': isUnderline
          }">
          {{ text || 'Enter some text...' }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .word-container { max-width: 600px; margin: 0 auto; }
    .controls { margin-bottom: 20px; }
    .toggles { display: flex; gap: 20px; margin-top: 15px; }
    .toggles label { display: flex; align-items: center; gap: 5px; cursor: pointer; }
    .preview { text-align: center; }
    .preview h3 { margin-bottom: 20px; color: #e50914; }
    .preview p { padding: 20px; border-radius: 8px; min-height: 100px; display: flex; align-items: center; justify-content: center; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .underline { text-decoration: underline; }
  `]
})
export class WordComponent {
  text = 'CineVault';
  fontSize = 24;
  textColor = '#ffffff';
  bgColor = '#1a1a1a';
  isBold = false;
  isItalic = false;
  isUnderline = false;
}
