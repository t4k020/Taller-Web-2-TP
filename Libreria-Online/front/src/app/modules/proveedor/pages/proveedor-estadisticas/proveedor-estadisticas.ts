import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { Nav } from '../../../../shared/components/nav/nav';
import { EstadoOferta, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  cantidadVisibleOferta,
  estadoOfertaLabel,
  estadoOfertaSeverity,
} from '../../../../shared/utils/oferta-estado.utils';

interface KpiCard {
  label: string;
  value: string;
  detail: string;
  icon: string;
}

@Component({
  selector: 'app-proveedor-estadisticas',
  standalone: true,
  imports: [CommonModule, Nav, ChartModule, ProgressBarModule, TableModule, TagModule],
  templateUrl: './proveedor-estadisticas.html',
  styleUrl: './proveedor-estadisticas.css',
})
export class ProveedorEstadisticas implements OnInit {
  userName = 'Maria Rodriguez';
  role = 'proveedor';
  activeItem = 'Estadisticas';

  ofertas = signal<OfertaLibro[]>([]);
  cargando = signal(true);

  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);

  totalOfertas = computed(() => this.ofertas().length);
  ofertasAceptadas = computed(() => this.contarPorEstado('ACEPTADA'));
  ofertasPendientes = computed(() => this.contarPorEstado('ESPERANDO_ADMIN') + this.contarPorEstado('ESPERANDO_PROVEEDOR'));
  ofertasRechazadas = computed(() => this.contarPorEstado('RECHAZADA'));

  valorPotencial = computed(() =>
    this.ofertas()
      .filter((oferta) => oferta.estado !== 'RECHAZADA')
      .reduce((total, oferta) => total + oferta.precioProveedor * this.cantidadActual(oferta), 0)
  );

  tasaAceptacion = computed(() => {
    const total = this.totalOfertas();
    return total ? Math.round((this.ofertasAceptadas() / total) * 100) : 0;
  });

  precioPromedio = computed(() => {
    const total = this.totalOfertas();
    if (!total) {
      return 0;
    }

    return this.ofertas().reduce((sum, oferta) => sum + oferta.precioProveedor, 0) / total;
  });

  kpis = computed<KpiCard[]>(() => [
    {
      label: 'Ofertas cargadas',
      value: String(this.totalOfertas()),
      detail: `${this.ofertasPendientes()} pendientes`,
      icon: 'inventory_2',
    },
    {
      label: 'Aceptadas',
      value: String(this.ofertasAceptadas()),
      detail: `${this.tasaAceptacion()}% de aceptacion`,
      icon: 'check_circle',
    },
    {
      label: 'Valor potencial',
      value: this.formatearMoneda(this.valorPotencial()),
      detail: 'Cantidad actual por precio',
      icon: 'payments',
    },
    {
      label: 'Precio promedio',
      value: this.formatearMoneda(this.precioPromedio()),
      detail: `${this.ofertasRechazadas()} rechazadas`,
      icon: 'sell',
    },
  ]);

  estadoChartData = computed(() => ({
    labels: ['Aceptadas', 'Esperando admin', 'Esperando proveedor', 'Rechazadas'],
    datasets: [
      {
        data: [
          this.contarPorEstado('ACEPTADA'),
          this.contarPorEstado('ESPERANDO_ADMIN'),
          this.contarPorEstado('ESPERANDO_PROVEEDOR'),
          this.contarPorEstado('RECHAZADA'),
        ],
        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }));

  categoriaChartData = computed(() => {
    const categorias = this.ofertas().reduce<Record<string, number>>((acc, oferta) => {
      const categoria = this.categoriaLabel(oferta.categoria);
      acc[categoria] = (acc[categoria] ?? 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categorias),
      datasets: [
        {
          label: 'Ofertas',
          data: Object.values(categorias),
          backgroundColor: '#14b8a6',
          borderRadius: 6,
        },
      ],
    };
  });

  chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  ultimasOfertas = computed(() =>
    [...this.ofertas()]
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 6)
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
        console.error('Error al cargar estadisticas de proveedor', error);
        this.cargando.set(false);
        this.toastService.error('No se pudieron cargar las estadisticas.');
      },
    });
  }

  estadoLabel(estado: EstadoOferta): string {
    return estadoOfertaLabel(estado);
  }

  estadoSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
    return estadoOfertaSeverity(estado);
  }

  categoriaLabel(categoria: string): string {
    const labels: Record<string, string> = {
      FICCION: 'Ficcion',
      FANTASIA: 'Fantasia',
      TERROR: 'Terror',
      HISTORIA: 'Historia',
      INFANTIL: 'Infantil',
      GENERAL: 'General',
    };

    return labels[categoria] ?? categoria;
  }

  cantidadActual(oferta: OfertaLibro): number {
    return cantidadVisibleOferta(oferta);
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  fechaCorta(fecha?: string): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(fecha));
  }

  private contarPorEstado(estado: EstadoOferta): number {
    return this.ofertas().filter((oferta) => oferta.estado === estado).length;
  }
}
