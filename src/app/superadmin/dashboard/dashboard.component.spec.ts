import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: SuperadminDashboardComponent;
  let fixture: ComponentFixture<SuperadminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
