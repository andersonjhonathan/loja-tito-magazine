import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedFemininoComponent } from './feed-feminino.component';

describe('FeedFemininoComponent', () => {
  let component: FeedFemininoComponent;
  let fixture: ComponentFixture<FeedFemininoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedFemininoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedFemininoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
