import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ProveedorRecomendacion } from './proveedor-recomendacion';

describe('RecomendarLibro', () => {
  let component: ProveedorRecomendacion;
  let fixture: ComponentFixture<ProveedorRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorRecomendacion],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorRecomendacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
