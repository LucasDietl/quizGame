import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestoyableComponent } from './destroyable.component';

describe('DestoyableComponent', () => {
  let component: DestoyableComponent;
  let fixture: ComponentFixture<DestoyableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestoyableComponent]
    });
    fixture = TestBed.createComponent(DestoyableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
