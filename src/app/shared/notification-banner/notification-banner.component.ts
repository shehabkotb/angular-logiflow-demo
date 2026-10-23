import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-notification-banner',
  imports: [AsyncPipe],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss'
})
export class NotificationBannerComponent {
  notificationService = inject(NotificationService);

  close(): void {
    this.notificationService.clear();
  }
}
