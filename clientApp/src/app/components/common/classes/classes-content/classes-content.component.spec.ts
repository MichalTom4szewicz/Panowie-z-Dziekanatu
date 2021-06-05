import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesContentComponent } from './classes-content.component';

describe('ClassesContentComponent', () => {
  let component: ClassesContentComponent;
  let fixture: ComponentFixture<ClassesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
