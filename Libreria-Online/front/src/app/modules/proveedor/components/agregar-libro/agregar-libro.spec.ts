import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { AgregarLibro } from './agregar-libro';

describe('AgregarLibro', () => {
  let component: AgregarLibro;
  let fixture: ComponentFixture<AgregarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLibro],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
