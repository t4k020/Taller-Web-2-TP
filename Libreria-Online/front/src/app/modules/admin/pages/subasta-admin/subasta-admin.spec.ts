import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubastaAdmin } from './subasta-admin';

describe('SubastaAdmin', () => {
  let component: SubastaAdmin;
  let fixture: ComponentFixture<SubastaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubastaAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(SubastaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
