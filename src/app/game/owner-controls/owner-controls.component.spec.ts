import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerControlsComponent } from './owner-controls.component';

describe('OwnerControlsComponent', () => {
  let component: OwnerControlsComponent;
  let fixture: ComponentFixture<OwnerControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerControlsComponent]
    });
    fixture = TestBed.createComponent(OwnerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
