import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Carrito } from '../interfaces/carrito.interface';
import { DetalleCarrito } from '../interfaces/detallecarrito.interface';
import { Router } from '@angular/router';
import { CompradorService } from '../../../api/services/comprador/comprador-service';
import { LibroCarrito } from '../libro-carrito/libro-carrito';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/Auth/auth-service';
// Importaciones nuevas para el Toast
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Nav } from '../../../shared/components/nav/nav';

@Component({
  selector: 'app-carrito-component',
  standalone: true,
  imports: [LibroCarrito, ButtonModule, ToastModule, Nav],
  providers: [MessageService],
  templateUrl: './carrito-component.html',
  styleUrl: './carrito-component.css',
})
export class CarritoComponent implements OnInit {
  carrito = signal<Carrito | null>(null);
  carritoVacio = computed(() => !this.carrito() || this.carrito()!.detalles.length === 0);

  compradorService = inject(CompradorService);
  router = inject(Router);
  auth = inject(AuthService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.compradorService.getCarritoUsuario(this.auth.getUser()).subscribe({
      next: (res: Carrito) => {
        this.carrito.set(res);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  finalizarCompra() {
    const carritoActual = this.carrito();
    if (!carritoActual) return;

    this.compradorService
      .procesarPago({
        comprador_id: this.auth.getUser(),
      })
      .subscribe({
        next: (res) => {
          // Reemplazo del alert de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Compra exitosa',
            detail: 'Transacción: ' + res.id,
            life: 3000,
          });

          this.carrito.set(null);

          setTimeout(() => {
            this.router.navigate(['/libros']);
          }, 2000);
        },
        error: (err) => {
          if (err.status == 400) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Error',
              detail: 'El carrito esta vacio, no puede realizar la compra',
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un problema al procesar el pago.',
              life: 3000,
            });
          }
        },
      });
  }

  agregarLibro(libro_id: number) {
    if (this.auth.getUser() !== null) {
      this.compradorService
        .agregarProductoAlCarrito({
          comprador_id: this.auth.getUser(),
          libro_id: libro_id,
          cantidad: 1,
        })
        .subscribe({
          next: () => {
            this.cargarCarrito();
          },
          error: (err) => {
            console.error('Error al comprar', err);
          },
        });
    } else {
      console.log('Error usuario no encontrado');
    }
  }

  restarLibro(libro_id: number) {
    if (this.auth.getUser() !== null) {
      this.compradorService
        .descontarProducto({
          comprador_id: this.auth.getUser(),
          libro_id: libro_id,
          cantidad: 1,
        })
        .subscribe({
          next: () => {
            this.cargarCarrito();
          },
          error: (err) => {
            console.error('Error al descontar', err);
          },
        });
    } else {
      console.log('Error usuario no encontrado');
    }
  }

  manejarBorrado(detalle: DetalleCarrito) {
    this.compradorService
      .borrarProducto({
        comprador_id: this.auth.getUser(),
        libro_id: detalle.libro_id,
        es_digital: detalle.es_digital,
      })
      .subscribe({
        next: () => {
          this.cargarCarrito();

          this.messageService.add({
            severity: 'info',
            summary: 'Actualizado',
            detail: 'Producto eliminado del carrito',
            life: 2000,
          });
        },
        error: (err) => {
          console.error('Error al borrar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el producto',
          });
        },
      });
  }
}
