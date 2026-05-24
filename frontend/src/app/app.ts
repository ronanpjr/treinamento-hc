import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService, NotificationMessage } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  private readonly notificationService = inject(NotificationService);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly notificationSubscription: Subscription;

  readonly notificationText = signal('');
  readonly notificationType = signal<NotificationMessage['type']>('success');
  readonly notificationVisible = signal(false);

  constructor() {
    this.notificationSubscription = this.notificationService.message$.subscribe(({ text, type }) => {
      this.notificationText.set(text);
      this.notificationType.set(type);
      this.notificationVisible.set(true);

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.notificationVisible.set(false);
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
