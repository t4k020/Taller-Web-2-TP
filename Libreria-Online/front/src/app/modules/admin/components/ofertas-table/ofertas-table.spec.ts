import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasTable } from './ofertas-table';

describe('OfertasTable', () => {
  let component: OfertasTable;
  let fixture: ComponentFixture<OfertasTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasTable],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertasTable);
    fixture.componentRef.setInput('ofertas', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
