import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environment';
import { ApiResponse } from '../models/api-response';
import { ContactModel } from '../models/contact.model';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private readonly contacts: ContactModel[] = [
    { id: 1, name: 'Ana Souza', number: '+55 11 98888-0001' },
    { id: 2, name: 'Bruno Lima', number: '+55 21 97777-0002' },
    { id: 3, name: 'Carla Mendes', number: '+55 31 96666-0003' },
  ];

  private lastId = this.contacts.length;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.useMockApi || !req.url.includes('/contacts')) {
      return next.handle(req);
    }

    return this.handleContacts(req);
  }

  private handleContacts(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (req.method === 'GET' && req.url.match(/\/contacts$/)) {
      return this.ok({
        data: this.contacts,
        status: 200,
      });
    }

    if (req.method === 'GET' && req.url.match(/\/contacts\/\d+$/)) {
      const id = this.extractId(req.url);
      const contact = this.contacts.find(item => item.id === id);

      if (!contact) {
        return this.notFound('Contact not found');
      }

      return this.ok({
        data: contact,
        status: 200,
      });
    }

    if (req.method === 'POST' && req.url.match(/\/contacts$/)) {
      const body = req.body as Partial<ContactModel>;
      const newContact: ContactModel = {
        id: ++this.lastId,
        name: body.name ?? '',
        number: body.number ?? '',
      };

      this.contacts.push(newContact);

      return this.ok({
        data: newContact,
        status: 201,
      });
    }

    if (req.method === 'PUT' && req.url.match(/\/contacts\/\d+$/)) {
      const id = this.extractId(req.url);
      const index = this.contacts.findIndex(contact => contact.id === id);

      if (index === -1) {
        return this.notFound('Contact not found');
      }

      const body = req.body as Partial<ContactModel>;
      const updatedContact: ContactModel = {
        id,
        name: body.name ?? this.contacts[index].name,
        number: body.number ?? this.contacts[index].number,
      };

      this.contacts[index] = updatedContact;

      return this.ok({
        data: updatedContact,
        status: 200,
      });
    }

    if (req.method === 'DELETE' && req.url.match(/\/contacts\/\d+$/)) {
      const id = this.extractId(req.url);
      const index = this.contacts.findIndex(contact => contact.id === id);

      if (index === -1) {
        return this.notFound('Contact not found');
      }

      this.contacts.splice(index, 1);

      return of(new HttpResponse<void>({ status: 204 })).pipe(delay(250));
    }

    return this.notFound('Endpoint not mocked');
  }

  private extractId(url: string): number {
    const parts = url.split('/');
    return Number(parts[parts.length - 1]);
  }

  private ok<T>(body: ApiResponse<T>): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse<ApiResponse<T>>({ status: body.status, body })).pipe(delay(250));
  }

  private notFound(message: string): Observable<HttpEvent<unknown>> {
    return of(
      new HttpResponse<ApiResponse<null>>({
        status: 404,
        body: {
          data: null,
          error: message,
          status: 404,
        },
      })
    ).pipe(delay(250));
  }
}
