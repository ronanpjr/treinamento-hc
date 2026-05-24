import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactForm } from './contact-form';
import { ContactService } from '../../../core/services/contact.service';

describe('ContactForm', () => {
  let component: ContactForm;
  let fixture: ComponentFixture<ContactForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactForm],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: ContactService,
          useValue: {
            createContact: () => of({ data: null }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
