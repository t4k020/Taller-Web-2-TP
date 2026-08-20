import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { RecomendacionesTable } from './recomendaciones-table';

describe('RecomendacionesTable', () => {
  let component: RecomendacionesTable;
  let fixture: ComponentFixture<RecomendacionesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesTable],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecomendacionesTable);
    fixture.componentRef.setInput('recomendaciones', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
