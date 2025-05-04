import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVisaoGeralComponent } from './dashboard-visao-geral.component';

describe('DashboardVisaoGeralComponent', () => {
  let component: DashboardVisaoGeralComponent;
  let fixture: ComponentFixture<DashboardVisaoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVisaoGeralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVisaoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
