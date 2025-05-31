import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarroselMobileComponent } from './carrosel-mobile.component';

describe('CarroselMobileComponent', () => {
  let component: CarroselMobileComponent;
  let fixture: ComponentFixture<CarroselMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarroselMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarroselMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
