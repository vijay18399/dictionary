import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'push-button',
  template: `
     <button class="pushable" (click)="onClick()">
        <span class="front">
          {{ buttonText }}
        </span>
    </button>
  `,
  styles: [`
    .pushable {
      background: hsl(340deg 100% 32%);
      border-radius: 12px;
      border: none;
      padding: 0;
      cursor: pointer;
      outline-offset: 4px;
    }
    .front {
      display: block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 1.25rem;
      background: hsl(345deg 100% 47%);
      color: white;
      transform: translateY(-6px);
    }

    .pushable:active .front {
      transform: translateY(-2px);
    }
  `]
})
export class PushButton {
  // Input for button text - allows two-way binding
  @Input() buttonText: string = 'Push me';

  // Output event emitter for button click
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit(); // Emit event when button is clicked
  }
}
