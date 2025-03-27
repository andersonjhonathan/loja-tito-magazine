import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedMasculinoComponent } from './feed-masculino.component';

describe('FeedMasculinoComponent', () => {
  let component: FeedMasculinoComponent;
  let fixture: ComponentFixture<FeedMasculinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedMasculinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedMasculinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
