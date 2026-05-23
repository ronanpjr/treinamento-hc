import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly message$ = new Subject<NotificationMessage>();

  readonly notification$ = this.message$.asObservable();

  success(text: string): void {
    this.message$.next({ type: 'success', text });
  }

  error(text: string): void {
    this.message$.next({ type: 'error', text });
  }

  showSuccess(message: string): void {
    this.success(message);
  }

  showError(message: string): void {
    this.error(message);
  }
}
