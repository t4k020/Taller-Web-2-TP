import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeUser } from './home-user';

describe('HomeUser', () => {
  let component: HomeUser;
  let fixture: ComponentFixture<HomeUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUser],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
