import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { VerLibrosAdmin } from './ver-libros-admin';

describe('VerLibrosAdmin', () => {
  let component: VerLibrosAdmin;
  let fixture: ComponentFixture<VerLibrosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerLibrosAdmin],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(VerLibrosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
