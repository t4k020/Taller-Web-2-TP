import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedirStockAdmin } from './pedir-stock-admin';

describe('PedirStockAdmin', () => {
  let component: PedirStockAdmin;
  let fixture: ComponentFixture<PedirStockAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedirStockAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PedirStockAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
