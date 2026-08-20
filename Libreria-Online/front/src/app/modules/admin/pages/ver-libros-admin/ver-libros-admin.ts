import { Component, inject, input, signal } from '@angular/core';
import { Libro } from '../../../../shared/interfaces/libro.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { LibrosService } from '../../../../api/services/libros/libros.services';
import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PedirStockAdmin } from '../../components/pedir-stock-admin/pedir-stock-admin';
import { ContraofertaAdminDialog } from '../../components/contraoferta-admin-dialog/contraoferta-admin-dialog';
import { OfertasTable } from '../../components/ofertas-table/ofertas-table';
import { ProveedoresService } from '../../../../api/services/proveedor/proveedores';

interface ApiResponse {
  message: string;
  data: Libro[];
}

@Component({
  selector: 'app-ver-libros-admin',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    PedirStockAdmin,
    ContraofertaAdminDialog,
    OfertasTable,
  ],
  templateUrl: './ver-libros-admin.html',
  styleUrl: './ver-libros-admin.css',
})
export class VerLibrosAdmin {
  mostrarOfertas = input(true);
  readonly portadaFallback = '/img/portada/imagen-no-disponible-vertical.svg';

  private librosService = inject(LibrosService);
  private proveedoresService = inject(ProveedoresService);
  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);


  public cargando = true;
  public errorError: string | null = null;
  mostrarFormularioPedido = signal<boolean>(false);
  libroSeleccionado = signal<any | null>(null);
  // Estado para la sección de ofertas pendientes
  ofertasPendientes = signal<OfertaLibro[]>([]);
  cargandoOfertas = signal(true);
  contraofertaVisible = signal(false);
  respondiendo = signal(false);
  ofertaSeleccionada = signal<OfertaLibro | undefined>(undefined);


  contraofertaForm = this.fb.group({
    nuevaCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    nuevoPrecio: [null as number | null, [Validators.min(1)]],
  });

  private ordenarOfertas(ofertas: OfertaLibro[]): OfertaLibro[] {
    const prioridadEstado: Record<OfertaLibro['estado'], number> = {
      ESPERANDO_ADMIN: 0,
      ESPERANDO_PROVEEDOR: 1,
      ACEPTADA: 2,
      RECHAZADA: 3,
    };

    return [...ofertas].sort((a, b) => prioridadEstado[a.estado] - prioridadEstado[b.estado]);
  }

  public libros = toSignal(
    this.librosService.listLibros().pipe(
      map(listaDeLibros => listaDeLibros.sort((a, b) => a.stock - b.stock)),
      catchError(err => {
        console.error(err);
        this.errorError = "No se pudo cargar los libros";
        return of([]);
      })
    ),
    { initialValue: undefined }
  );

  public proveedores = toSignal(
    this.proveedoresService.listProveedores().pipe(
      catchError(err => {
        console.error('Error al cargar proveedores desde el backend:', err);
        this.toastService.error('No se pudieron cargar los proveedores reales.');
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  constructor() {
    if (this.mostrarOfertas()) {
      this.cargarOfertasPendientes();
    }
  }

  cargarOfertasPendientes(): void {
    this.cargandoOfertas.set(true);
    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.ofertasPendientes.set(this.ordenarOfertas(data));
        this.cargandoOfertas.set(false);
      },
      error: () => {
        this.cargandoOfertas.set(false);
      }
    });
  }

  aceptarOferta(oferta: OfertaLibro): void {
    this.ofertasService.aceptarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.updated('Oferta aceptada, stock actualizado');
        this.cargarOfertasPendientes();
      },
      error: () => {
        this.toastService.error('No se pudo aceptar la oferta.');
      }
    });
  }

  rechazarOferta(oferta: OfertaLibro): void {
    this.ofertasService.rechazarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.error('Oferta rechazada');
        this.cargarOfertasPendientes();
      },
      error: () => {
        this.toastService.error('No se pudo rechazar la oferta.');
      }
    });
  }

  abrirContraoferta(oferta: OfertaLibro): void {
    this.ofertaSeleccionada.set(oferta);
    this.contraofertaForm.reset({
      nuevaCantidad: oferta.cantidadProveedor,
      nuevoPrecio: oferta.precioProveedor,
    });
    this.contraofertaVisible.set(true);
  }

  cerrarContraoferta(): void {
    this.contraofertaVisible.set(false);
    this.ofertaSeleccionada.set(undefined);
    this.contraofertaForm.reset();
  }

  enviarContraoferta(): void {
    const ofertaActual = this.ofertaSeleccionada();
    if (!ofertaActual || this.contraofertaForm.invalid) {
      this.contraofertaForm.markAllAsTouched();
      return;
    }
    this.respondiendo.set(true);
    const nuevaCantidad = this.contraofertaForm.value.nuevaCantidad!;
    const nuevoPrecio = this.contraofertaForm.value.nuevoPrecio ?? undefined;

    this.ofertasService.contraofertarAdmin(ofertaActual.id, nuevaCantidad, nuevoPrecio).subscribe({
      next: () => {
        this.respondiendo.set(false);
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta enviada al proveedor');
        this.cargarOfertasPendientes();
      },
      error: () => {
        this.respondiendo.set(false);
        this.toastService.error('No se pudo enviar la contraoferta.');
      }
    });
  }

  get nuevaCantidad() { return this.contraofertaForm.get('nuevaCantidad'); }
  get nuevoPrecio() { return this.contraofertaForm.get('nuevoPrecio'); }

  getSeverity(stock: number): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | undefined {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warn';
    return 'success';
  }

  portadaUrl(libro: Libro): string {
    return libro.imagenUrl?.trim() || `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(libro.isbn)}-M.jpg?default=false`;
  }

  usarPortadaFallback(event: Event): void {
    const imagen = event.target as HTMLImageElement;
    if (!imagen.src.endsWith(this.portadaFallback)) {
      imagen.src = this.portadaFallback;
    }
  }

  abrirPedidoStock(libro: any): void {
  this.libroSeleccionado.set(libro);
  this.mostrarFormularioPedido.set(true);
 }
  onPedidoConfirmado(evento: { cantidad: number; proveedor: any }): void {
    const libroActual = this.libroSeleccionado();
    if (!libroActual) return;
    this.toastService.updated(
      `Pedido enviado a ${evento.proveedor.apellido}: Solicitadas ${evento.cantidad} un. de "${libroActual.nombre}"`
    );
    libroActual.proveedorId = evento.proveedor.id;
    this.mostrarFormularioPedido.set(false);
  }

// para guardar el OfertaLibro recibido del hijo pedirStock
manejadorGuardarPedido(evento: { cantidad: number; proveedor: any }, libroActual: any) {

  // Si 'libroActual' es una función (Signal), la ejecutamos.
  // Si no, usamos el objeto directo."
  const libro = typeof libroActual === 'function' ? libroActual() : libroActual;

  const idDelLibro = libro?.id || libro?.libroId;

  if (!idDelLibro) {
    console.error(" Error crítico:", libro);
    return;
  }

  // Payload para backend
  const nuevaOferta = {
    isbn: libro.isbn,
    nombre: libro.nombre,
    autor: libro.autor,
    sinopsis: libro.sinopsis || "",
    imagenUrl: libro.imagenUrl || "",
    categoria: libro.categoria || 'GENERAL',
    precio: libro.precio || 0,

    cantidadAdmin: Number(evento.cantidad),
    cantidadProveedor: Number(evento.cantidad),
    precioProveedor: 0,
    proveedorId: Number(evento.proveedor.id),
    libroId: Number(idDelLibro) ,
    creadoPor: 'ADMIN'
  };


  this.ofertasService.crearOferta(nuevaOferta).subscribe({
    error: (err) => console.error('Error en la petición HTTP:', err)
  });
}
}
