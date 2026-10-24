import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = '';
  @Input() open = false;
  @Input() confirmText = 'Confirm';
  @Input() showFooter = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
