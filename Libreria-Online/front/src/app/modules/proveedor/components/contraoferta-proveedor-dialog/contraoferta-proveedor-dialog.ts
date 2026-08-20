import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

import { OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';

@Component({
  selector: 'app-contraoferta-proveedor-dialog',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
  ],
  templateUrl: './contraoferta-proveedor-dialog.html',
  styleUrl: './contraoferta-proveedor-dialog.css',
})
export class ContraofertaProveedorDialog {
  visible = input(false);
  oferta = input<OfertaLibro | undefined>();
  form = input.required<FormGroup>();
  respondiendo = input(false);

  cerrar = output<void>();
  enviar = output<void>();

  dialogTitle(): string {
    return this.esSolicitudAdmin() ? 'Responder solicitud' : 'Responder contraoferta';
  }

  precioReferenciaLabel(): string {
    return this.esSolicitudAdmin() ? 'Precio de referencia' : 'Precio propuesto por admin';
  }

  cantidadReferenciaLabel(): string {
    return this.esSolicitudAdmin() ? 'Cantidad solicitada por admin' : 'Cantidad propuesta por admin';
  }

  enviarLabel(): string {
    return this.esSolicitudAdmin() ? 'Enviar respuesta' : 'Enviar';
  }

  private esSolicitudAdmin(): boolean {
    const oferta = this.oferta();
    return oferta?.creadoPor === 'ADMIN' && oferta.cantidadProveedor === 0;
  }

  get nuevaCantidad() { return this.form().get('nuevaCantidad'); }
  get nuevoPrecio() { return this.form().get('nuevoPrecio'); }
}
