import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationSlideComponent } from './creation-slide.component';

describe('CreationSlideComponent', () => {
  let component: CreationSlideComponent;
  let fixture: ComponentFixture<CreationSlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreationSlideComponent]
    });
    fixture = TestBed.createComponent(CreationSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
