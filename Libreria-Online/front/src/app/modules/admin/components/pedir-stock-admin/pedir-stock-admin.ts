import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dropdown } from '@primeuix/themes/aura/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProveedoresService } from '../../../../api/services/proveedor/proveedores';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../../shared/services/toast.service';
import { MessageService } from 'primeng/api';
import { Proveedor } from '../../../../shared/interfaces/usuario.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pedir-stock-admin',
  imports: [
    FormsModule, 
    DialogModule, 
    ButtonModule, 
    InputNumberModule, 
    FloatLabelModule, 
    InputGroupModule, 
    InputGroupAddonModule,
    SelectModule,
    ToastModule,
    
    
  ],
  templateUrl: './pedir-stock-admin.html',
  styleUrl: './pedir-stock-admin.css',
})
export class PedirStockAdmin {
  //  servicios
  private proveedoresService = inject(ProveedoresService);
  private messageService = inject(MessageService);

  // Signals (Solo lectura)
  visible = input<boolean>(false);
  libro = input<any | null>(null);
  
  // States internos 
  proveedores = signal<Proveedor[]>([]);
  cantidadInput = signal<number | null>(null);
  proveedorSeleccionado = signal<Proveedor | null>(null);

  // Outputs nativos de Angular
  visibleChange = output<boolean>();
  alGuardarPedido = output<{ cantidad: number; proveedor: Proveedor }>();

  constructor() {
    //  Efecto Reactivo: Maneja la carga inicial y CUALQUIER cambio posterior del libro solo
    effect(() => {
      const libroActual = this.libro();
      
      if (libroActual && libroActual.isbn) {
        this.cargarProveedoresYSugerencia(libroActual.isbn);
      } else {
        // Limpieza si cierran el modal o limpian el libro seleccionado
        this.proveedores.set([]);
        this.proveedorSeleccionado.set(null);
      }
    });
  }

  private cargarProveedoresYSugerencia(isbn: string): void {
    this.proveedoresService.listProveedores(isbn).subscribe({
      next: (res) => {
        this.proveedores.set(res.lista);
        
        // Si el backend descubrió un proveedor previo por ISBN, lo pre-seleccionamos
        if (res.sugeridoId) {
          const sugerido = res.lista.find(p => p.id === res.sugeridoId);
          if (sugerido) {
            this.proveedorSeleccionado.set(sugerido);
          }
        } else {
          this.proveedorSeleccionado.set(null);
        }
      },
      error: (err) => console.error('Error cargando proveedores por ISBN:', err)
    });
  }

enviarPedido(form: NgForm): void {
  
  if (form.invalid || !this.cantidadInput() || !this.proveedorSeleccionado()) return;

  const proveedorNombre = this.proveedorSeleccionado()?.nombre;
  const cantidad = this.cantidadInput();

  this.alGuardarPedido.emit({
    cantidad: this.cantidadInput()!,
    proveedor: this.proveedorSeleccionado()!
    
  });
  this.messageService.add({
    severity: 'success',
    summary: 'Pedido Confirmado',
    detail: `Se solicitaron ${cantidad} unidades a ${proveedorNombre}.`,
    life: 3000 // Dura 3 segundos
  });



  this.cerrar(form);
}

  cerrar(form?: NgForm): void {
  this.visibleChange.emit(false);
  
  if (form) {
    // resetForm() limpia los estilos rojos de validación y vacía los ngModel 
    form.resetForm(); 
  } else {
    this.cantidadInput.set(null);
    this.proveedorSeleccionado.set(null);
  }
}
}
