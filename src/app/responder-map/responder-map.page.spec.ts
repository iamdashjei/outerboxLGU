import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderMapPage } from './responder-map.page';

describe('ResponderMapPage', () => {
  let component: ResponderMapPage;
  let fixture: ComponentFixture<ResponderMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponderMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
