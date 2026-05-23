import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactModel } from '../models/contact.model';
import { ContactFormValue } from '../models/contact-form-value.type';
import { environment } from '../../environment';
import { ApiResponse } from '../models/api-response';


@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private readonly http: HttpClient) {}

  getContacts(): Observable<ApiResponse<ContactModel[]>> {
    return this.http.get<ApiResponse<ContactModel[]>>(this.apiUrl);
  }

  getContactById(id: number): Observable<ApiResponse<ContactModel>> {
    return this.http.get<ApiResponse<ContactModel>>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: ContactFormValue): Observable<ApiResponse<ContactFormValue>> {
    return this.http.post<ApiResponse<ContactFormValue>>(this.apiUrl, contact);
  }

  updateContact(contact: ContactModel): Observable<ApiResponse<ContactModel>> {
    return this.http.put<ApiResponse<ContactModel>>(`${this.apiUrl}/${contact.id}`, contact);
  }
  
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}


