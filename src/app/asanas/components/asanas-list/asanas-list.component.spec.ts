import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsanasListComponent } from './asanas-list.component';

describe('AsanasListComponent', () => {
  let component: AsanasListComponent;
  let fixture: ComponentFixture<AsanasListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsanasListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsanasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
