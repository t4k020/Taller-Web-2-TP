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
  selector: 'app-contraoferta-admin-dialog',
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
  templateUrl: './contraoferta-admin-dialog.html',
  styleUrl: './contraoferta-admin-dialog.css',
})
export class ContraofertaAdminDialog {
  visible = input(false);
  oferta = input<OfertaLibro | undefined>();
  form = input.required<FormGroup>();
  respondiendo = input(false);

  cerrar = output<void>();
  enviar = output<void>();

  cantidadActual(oferta: OfertaLibro): number {
    return oferta.estado === 'ESPERANDO_PROVEEDOR' && oferta.cantidadAdmin
      ? oferta.cantidadAdmin
      : oferta.cantidadProveedor;
  }

  get nuevaCantidad() { return this.form().get('nuevaCantidad'); }
  get nuevoPrecio() { return this.form().get('nuevoPrecio'); }
}
