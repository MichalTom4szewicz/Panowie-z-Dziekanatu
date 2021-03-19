import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassGridComponent } from './class-grid.component';

describe('ClassGridComponent', () => {
  let component: ClassGridComponent;
  let fixture: ComponentFixture<ClassGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
