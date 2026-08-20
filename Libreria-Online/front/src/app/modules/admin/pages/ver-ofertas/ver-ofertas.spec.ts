import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { VerOfertas } from './ver-ofertas';

describe('VerOfertas', () => {
  let component: VerOfertas;
  let fixture: ComponentFixture<VerOfertas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerOfertas],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(VerOfertas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
