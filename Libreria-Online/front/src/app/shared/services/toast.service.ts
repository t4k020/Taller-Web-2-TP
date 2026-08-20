import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private messageService = inject(MessageService);

  success(detail: string, summary = 'Exito'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000,
    });
  }

  info(detail: string, summary = 'Informacion'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: 3500,
    });
  }

  warn(detail: string, summary = 'Atencion'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: 4000,
    });
  }

  created(entity: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Creado',
      detail: `${entity} creado correctamente.`,
      life: 3000,
    });
  }

  updated(entity: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: `${entity} actualizado correctamente.`,
      life: 3000,
    });
  }

  deleted(entity: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: `${entity} eliminado correctamente.`,
      life: 3000,
    });
  }

  error(detail: string, summary = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 4000,
    });
  }
}
