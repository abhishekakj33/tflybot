import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsanasComponent } from './asanas.component';

describe('AsanasComponent', () => {
  let component: AsanasComponent;
  let fixture: ComponentFixture<AsanasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsanasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
