import { Component, inject } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private notificationService = inject(NotificationService);

  testNotification(): void {
    this.notificationService.show('Hello from LogiFlow');
  }
}
