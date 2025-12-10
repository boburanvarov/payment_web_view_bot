import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: ToastType = 'success';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
