import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Libros } from './libros';

describe('Libros', () => {
  let component: Libros;
  let fixture: ComponentFixture<Libros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Libros],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(Libros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
