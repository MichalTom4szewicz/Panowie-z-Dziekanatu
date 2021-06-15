import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUserDataComponent } from './item-user-data.component';

describe('ItemUserDataComponent', () => {
  let component: ItemUserDataComponent;
  let fixture: ComponentFixture<ItemUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUserDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
