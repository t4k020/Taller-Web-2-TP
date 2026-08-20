import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { LibrosService } from '../../../../api/services/libros/libros.services';
import { Libro } from '../../../../shared/interfaces/libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-eliminar-libro',
  standalone: true,
  imports: [Button, DialogModule],
  templateUrl: './eliminar-libro.html',
  styleUrl: './eliminar-libro.css',
})
export class EliminarLibro {
  visible = false;
  isLoading = false;
  libroSeleccionado: Libro | null = null;

  @Output() libroEliminado = new EventEmitter<void>();

  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);

  showDialog(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.libroSeleccionado = null;
  }

  eliminarLibro(): void {
    if (!this.libroSeleccionado) {
      return;
    }

    this.isLoading = true;

    this.librosService.eliminarLibro(this.libroSeleccionado.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDialog();
        this.toastService.deleted('Libro');
        this.libroEliminado.emit();
      },
      error: (error) => {
        console.error('Error al eliminar el libro', error);
        this.isLoading = false;
        this.toastService.error('No se pudo eliminar el libro.');
      }
    });
  }
}
