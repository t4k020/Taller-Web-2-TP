import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { Table } from 'primeng/table';

import { Nav } from '../../../../shared/components/nav/nav';
import { AgregarLibro } from '../../components/agregar-libro/agregar-libro';
import { LibrosService } from '../../../../api/services/libros/libros.services';
import { Libro } from '../../../../shared/interfaces/libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule, Nav, TableModule, ButtonModule, TagModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputTextModule, TooltipModule, ToastModule, AgregarLibro],
  templateUrl: './libros.html',
  styleUrl: './libros.css',
})
export class Libros implements OnInit {
  userName = 'María Rodríguez';
  role = 'proveedor';

  libros: Libro[] = [];
  cargando = true;
  searchValue = '';

  @ViewChild('tablaLibros') tablaLibros?: Table;

  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.obtenerLibros();
  }

  obtenerLibros(): void {
    this.cargando = true;

    this.librosService.listLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al traer los libros', error);
        this.cargando = false;
        this.toastService.error('No se pudieron cargar los libros.');
        this.cdr.detectChanges();
      }
    });
  }

  buscarLibros(valor: string): void {
    this.searchValue = valor;
    this.tablaLibros?.filterGlobal(valor, 'contains');
  }

  stockSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock >= 10) {
      return 'success';
    }

    if (stock >= 5) {
      return 'warn';
    }

    return 'danger';
  }

  stockIcon(stock: number): string {
    if (stock >= 10) {
      return 'pi pi-check';
    }

    if (stock >= 5) {
      return 'pi pi-exclamation-triangle';
    }

    return 'pi pi-times';
  }

  stockTooltip(stock: number): string {
    if (stock >= 10) {
      return `Stock alto: ${stock} unidades disponibles`;
    }

    if (stock >= 5) {
      return `Stock medio: ${stock} unidades disponibles`;
    }

    return `Stock bajo: ${stock} unidades disponibles`;
  }
}
