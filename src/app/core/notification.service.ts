import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const AUTO_CLEAR_TIME = 3000;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<string | null>(null);

  notification$ = this.notificationSubject.asObservable();

  private timerId: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    this.notificationSubject.next(message);

    // restart the timer for the new message
    this.stopTimer();
    this.timerId = setTimeout(() => this.clear(), AUTO_CLEAR_TIME);
  }

  clear(): void {
    this.stopTimer();
    this.notificationSubject.next(null);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
