import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { Nav } from '../../../../shared/components/nav/nav';
import { LibroDigitalService } from '../../../../services/libro-digital/libro-digital.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LibroDigitalAdquirido } from '../../../../services/libro-digital/libro-digital.interface';
import { AuthService } from '../../../../services/Auth/auth-service';

@Component({
    selector: 'app-libros-digitales',
    standalone: true,
    imports: [CommonModule, Nav, TableModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './libros-digitales.html',
    styleUrl: './libros-digitales.css'
})
export class LibrosDigitales implements OnInit {

    userName = '';
    role = 'comprador';

    librosAdquiridos: LibroDigitalAdquirido[] = [];
    cargando = true;

    private libroDigitalService = inject(LibroDigitalService);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.obtenerLibrosAdquiridos();
    }

    obtenerLibrosAdquiridos(): void {
        this.cargando = true;

        this.libroDigitalService.getLibrosAdquiridos(this.authService.getUser()).subscribe({
            next: (data) => {
                this.librosAdquiridos = data;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: (_err: unknown) => {
                this.toastService.error('No se pudieron cargar los libros digitales.');
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    abrirPdf(libroId: number): void {
        const url = this.libroDigitalService.getPdfUrl(libroId, this.authService.getUser());
        window.open(url, '_blank');
    }
}
