import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactList } from './contact-list';
import { ContactService } from '../../../core/services/contact.service';

describe('ContactList', () => {
  let component: ContactList;
  let fixture: ComponentFixture<ContactList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactList],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ContactService,
          useValue: {
            getContacts: () => of({ data: [] }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
