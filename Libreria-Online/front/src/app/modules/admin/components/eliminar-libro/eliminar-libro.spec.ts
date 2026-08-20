import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { EliminarLibro } from './eliminar-libro';

describe('EliminarLibro', () => {
  let component: EliminarLibro;
  let fixture: ComponentFixture<EliminarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarLibro],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
