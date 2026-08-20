import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Nav } from '../../../../shared/components/nav/nav';
import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { cantidadVisibleOferta } from '../../../../shared/utils/oferta-estado.utils';

@Component({
  selector: 'app-proveedor-ventas',
  standalone: true,
  imports: [CommonModule, Nav],
  templateUrl: './proveedor-ventas.html',
  styleUrl: './proveedor-ventas.css',
})
export class ProveedorVentasComponent implements OnInit {
  userName = 'Maria Rodriguez';
  role = 'proveedor';
  activeItem = 'Ventas';


  ofertas = signal<OfertaLibro[]>([]);
  cargando = signal(true);

  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);


  ofertasAceptadas = computed(() =>
    this.ofertas().filter((oferta) => oferta.estado === 'ACEPTADA')
  );

  totalLibrosEntregados = computed(() =>
    this.ofertasAceptadas().reduce((acc, oferta) => acc + this.cantidadActual(oferta), 0)
  );


  totalDineroGenerado = computed(() =>
    this.ofertasAceptadas().reduce((acc, oferta) => acc + (oferta.precioProveedor * this.cantidadActual(oferta)), 0)
  );

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.cargando.set(true);

    this.ofertasService.listOfertas().subscribe({
      next: (ofertas) => {
        this.ofertas.set(ofertas);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ventas de proveedor', error);
        this.cargando.set(false);
        this.toastService.error('No se pudieron cargar las ventas.');
      },
    });
  }


  cantidadActual(oferta: OfertaLibro): number {
    return cantidadVisibleOferta(oferta);
  }
}
