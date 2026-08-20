import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSubastaDialog } from './nueva-subasta-dialog';

describe('NuevaSubastaDialog', () => {
  let component: NuevaSubastaDialog;
  let fixture: ComponentFixture<NuevaSubastaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSubastaDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaSubastaDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
