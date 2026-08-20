import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { ActualizarLibro } from './actualizar-libro';

describe('ActualizarLibro', () => {
  let component: ActualizarLibro;
  let fixture: ComponentFixture<ActualizarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarLibro],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
