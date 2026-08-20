import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { MessageService } from 'primeng/api'; // 1. Importa el servicio
import { ToastModule } from 'primeng/toast'; // 2. Importa el módulo

import { LibrosService } from '../../api/services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { CompradorService } from '../../api/services/comprador/comprador-service';
import { AuthService } from '../../services/Auth/auth-service';
import { Libro } from '../../shared/interfaces/libro.interface';
import { Nav } from '../../shared/components/nav/nav';

import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estanteria',
  standalone: true,
  imports: [LibroEstanteria, DataViewModule, Nav, ToastModule, SelectModule, FormsModule],
  providers: [MessageService],
  templateUrl: './estanteria.html',
  styleUrl: './estanteria.css',
})
export class Estanteria implements OnInit {
  libroService = inject(LibrosService);
  compradorService = inject(CompradorService);
  auth = inject(AuthService);
  messageService = inject(MessageService);

  libros = signal<Libro[]>([]);

  terminoBusqueda = signal<string>(''); // Nuevo signal para el buscador

  categoriaSeleccionada = signal('Todas');

  categorias = computed(() => {
    const cats = this.libros().map((l) => l.categoria);
    const unicas = [...new Set(cats)];
    return [
      { label: 'Todas las categorías', value: 'Todas' },
      ...unicas.map((cat) => ({ label: cat, value: cat })),
    ];
  });

  librosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const cat = this.categoriaSeleccionada();

    return this.libros().filter((libro) => {
      const coincideBusqueda = libro.nombre.toLowerCase().includes(termino);
      const coincideCat = cat === 'Todas' || libro.categoria === cat;
      return coincideBusqueda && coincideCat;
    });
  });

  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.listLibros().subscribe({
      next: (data) => this.libros.set(data),
      error: (err) => console.error('❌ Error al cargar libros:', err),
    });
  }

  manejarCompra(libroId: number) {
    if (this.auth.getUser() !== null) {
      this.compradorService
        .agregarProductoAlCarrito({
          comprador_id: this.auth.getUser(),
          libro_id: libroId,
          cantidad: 1,
        })
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Libro agregado al carrito',
              life: 3000,
            });

            this.cargarLibros();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo agregar el libro',
            });
            console.error('Error al comprar', err);
          },
        });
    } else {
      console.log('Error usuario no encontrado');
    }
  }

  manejarCompraDigital(libroId: number) {
    const compradorId = this.auth.getUser();
    if (compradorId === null) {
      console.log('Error usuario no encontrado');
      return;
    }

    this.compradorService
      .agregarProductoAlCarrito({
        comprador_id: compradorId,
        libro_id: libroId,
        cantidad: 1,
        es_digital: true,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Libro digital agregado al carrito',
            life: 3000,
          });
        },
        error: (err) => {
          const yaEnCarrito = err?.error?.message?.includes('ya está en el carrito');
          const yaAdquirido = err?.error?.message?.includes('Ya posees');
          this.messageService.add({
            severity: yaEnCarrito || yaAdquirido ? 'warn' : 'error',
            summary: yaEnCarrito || yaAdquirido ? 'Ya lo tenés' : 'Error',
            detail:
              err?.error?.message ??
              'No se pudo agregar el libro digital al carrito',
          });
          console.error('Error al agregar libro digital al carrito', err);
        },
      });
  }
}
