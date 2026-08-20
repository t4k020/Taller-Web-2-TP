import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Nav } from '../../../../shared/components/nav/nav';
import { NuevaSubastaDialog } from '../../components/nueva-subasta-dialog/nueva-subasta-dialog';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-subasta-admin',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    Nav,
    NuevaSubastaDialog,
    Toast,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './subasta-admin.html',
  styleUrl: './subasta-admin.css',
})
export class SubastaAdmin {
  private messageService = inject(MessageService);
  userName = 'María Rodríguez';
  role = 'admin';
  
  cargando = input<boolean>(false);
  cerrar = output<any>();
  mostrarFormulario = signal<boolean>(false);
  searchValue = signal<string>('');
  subastas = input<any[]>([]);
  subastasMock = signal<any[]>([
  {
    id: 1,
    nombre: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    isbn: '978-3-16-148410-0',
    precioInicial: 5500,
    cantidad:5,
    estado: 'ACTIVA',
    subastas: [{ precioOfertado: 6000, creadoPor: 'PROVEEDOR' }]
  },
  {
    id: 2,
    nombre: 'Rayuela',
    autor: 'Julio Cortázar',
    isbn: '978-950-511-351-4',
    precioInicial: 12000,
    cantidad:2,
    estado: 'PENDIENTE',
    subastas: []
  }
]);
 


  // label de estado de la subasta
  estadoLabel(estado: string): string {
    const mapaEstados: Record<string, string> = {
      'PENDIENTE': 'Sin ofertas',
      'ACTIVA': 'En Curso',
      'CERRADA': 'Finalizada',
    };
    return mapaEstados[estado] || estado;
  }

  /**
   * Retorna el color (severity) del p-tag de PrimeNG según el estado
   */
  estadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (estado) {
      case 'ACTIVA': return 'info';
      case 'PENDIENTE': return 'warn';
      case 'ACEPTADA': return 'success';
      case 'CERRADA': return 'danger';
      default: return undefined;
    }
  }

// recibe nueva subasta del componente hijo nueva-subasta-dialog
 onNuevaSubastaRecibida(nuevaSubasta: any): void {
    const nuevaSubastaFormateada = {
      id: Math.floor(Math.random() * 1000),
      nombre: nuevaSubasta.nombre,
      autor: nuevaSubasta.autor,
      isbn: nuevaSubasta.isbn,
      precioInicial: Number(nuevaSubasta.precioInicial),
      estado: 'PENDIENTE',
      subastas: []
    };

    // Actualizamos la lista local mockeada
    this.subastasMock.update(lista => [nuevaSubastaFormateada, ...lista]);
  }
  cerrarSubasta(subasta: any): void {
    //mensaje para mostrar como termino la subasta
    // 1. Buscamos si tiene ofertas para armar el mensaje
    const tienePujas = subasta.subastas && subasta.subastas.length > 0;
    // se hacen los mensajes usando Toast y messageService
    if (tienePujas) {
      // Sí tuvo compradores (Se lleva la oferta más alta)
      const ofertaMasAlta = subasta.subastas[0].precioOfertado;
      const comprador = subasta.subastas[0].creadoPor;
      
      const precioFormateado = new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: 'ARS' 
      }).format(ofertaMasAlta);

      this.messageService.add({
        severity: 'info',
        summary: 'Subasta Finalizada',
        detail: `La subasta de "${subasta.nombre}" finalizó con ${precioFormateado} y su comprador fue ${comprador}.`,
        life: 4000
      });

    } else {
      // No tuvo ofertas (Se muestra como cancelada)
      this.messageService.add({
        severity: 'warn', // Cambia el color del Toast a amarillo/naranja de advertencia
        summary: 'Subasta Cancelada',
        detail: `La subasta de "${subasta.nombre}" fue cancelada, no hubo compradores.`,
        life: 4000
      });
    }

    //se debe llamar a un servicio para guardar la subasta terminada, creo que se guardaria como una oferta finalizada
    
    this.subastasMock.update(listaActual => 
      listaActual.filter(item => item.id !== subasta.id)
    );
  }
}
