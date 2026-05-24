import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactModel } from '../models/contact.model';
import { ContactFormValue } from '../models/contact-form-value.type';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private readonly http: HttpClient) {}

  getContacts(): Observable<ContactModel[]> {
    return this.http.get<ContactModel[]>(this.apiUrl);
  }

  getContactById(id: number): Observable<ContactModel> {
    return this.http.get<ContactModel>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: ContactFormValue): Observable<ContactModel> {
    return this.http.post<ContactModel>(this.apiUrl, contact);
  }

  updateContact(contact: ContactModel): Observable<ContactModel> {
    return this.http.put<ContactModel>(`${this.apiUrl}/${contact.id}`, contact);
  }
  
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}


