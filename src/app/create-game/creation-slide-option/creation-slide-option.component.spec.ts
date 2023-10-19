import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationSlideOptionComponent } from './creation-slide-option.component';

describe('CreationSlideOptionComponent', () => {
  let component: CreationSlideOptionComponent;
  let fixture: ComponentFixture<CreationSlideOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreationSlideOptionComponent]
    });
    fixture = TestBed.createComponent(CreationSlideOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
