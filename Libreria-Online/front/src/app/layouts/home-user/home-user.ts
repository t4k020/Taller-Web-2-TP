import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Home } from '../../shared/components/home/home';

import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { Libro } from '../../shared/interfaces/libro.interface';

import { LibrosService } from '../../api/services/libros/libros.services';

import { AuthService } from '../../services/Auth/auth-service';
import { NotificationService } from '../../services/NotificationService/notification-service';
import { Nav } from '../../shared/components/nav/nav';
import { CompradorService } from '../../api/services/comprador/comprador-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [
    CommonModule,
    Home,
    CarouselModule,
    ButtonModule,
    DialogModule,
    TagModule,
    ToastModule,
    Nav,
  ],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser implements OnInit {
  private libroService = inject(LibrosService);

  private authService = inject(AuthService);

  private notificationService = inject(NotificationService);

  private messageService = inject(MessageService);

  private compradorService = inject(CompradorService);
  private router = inject(Router);

  libros = signal<Libro[]>([]);

  selectedBook = signal<Libro | null>(null);

  dialogVisible = false;

  logueado = computed(() => this.authService.tipoUsuario() !== null);

  role = computed(() => this.authService.tipoUsuario()?.toLowerCase() || '');

  imageBanner = 'img/libreria_banner_transparente.svg';

  eyebrow = 'Bienvenido a la Librería Online';

  title = 'Descubrí tu próximo libro favorito';

  description = 'Explorá miles de títulos de todos los géneros. Leé, aprendé e inspirate.';

  buttonText = 'Explorar libros';

  buttonLink = 'Crear Cuenta';

  rutaExplorar = '/libros';

  responsiveOptions: CarouselResponsiveOptions[] = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1100px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit(): void {
    const msg = this.notificationService.getPendingMessage();

    if (msg) {
      setTimeout(() => {
        this.messageService.add(msg);
      });
    }

    this.cargarLibrosDestacados();
  }

  cargarLibrosDestacados(): void {
    this.libroService.listLibrosCarrusel().subscribe({
      next: (libros) => {
        this.libros.set(libros);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  abrirLibro(libro: Libro): void {
    this.selectedBook.set(libro);

    this.dialogVisible = true;
  }

  cerrarDialog(): void {
    this.dialogVisible = false;

    this.selectedBook.set(null);
  }

  agregarCarrito(libro: Libro): void {
    if (this.authService.getUser() !== null) {
      this.compradorService
        .agregarProductoAlCarrito({
          comprador_id: this.authService.getUser(),
          libro_id: libro.id,
          cantidad: 1,
        })
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: libro.nombre + ' agregado al carrito',
              life: 3000,
            });
            this.cargarLibrosDestacados();
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
    } else if (this.authService.getUser() === null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Error no esperado');
    }
  }
}
