import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private pendingMessage: any = null;

  setPendingMessage(msg: any) {
    this.pendingMessage = msg;
  }

  getPendingMessage() {
    const msg = this.pendingMessage;
    this.pendingMessage = null; 
    return msg;
  }
}
