import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { ProveedorEstadisticas } from './proveedor-estadisticas';

describe('ProveedorEstadisticas', () => {
  let component: ProveedorEstadisticas;
  let fixture: ComponentFixture<ProveedorEstadisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorEstadisticas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        {
          provide: OfertasLibroService,
          useValue: {
            listOfertas: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorEstadisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
