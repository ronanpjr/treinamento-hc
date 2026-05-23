import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '../../../core/services/contact.service';
import { ContactModel } from '../../../core/models/contact.model';
import { NotificationService } from '../../../core/services/notification.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
})

export class ContactList {
  private readonly destroyRef = inject(DestroyRef);
  private readonly contactService = inject(ContactService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  readonly searchTerm = signal('');
  readonly contacts = signal<ContactModel[]>([]);

  constructor() {
    this.loadContacts();
  }

  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const contacts = this.contacts();

    if (!term) {
      return contacts;
    }

    return contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(term) ||
        contact.number.toLowerCase().includes(term)
      );
    });
  });

  onSearch(term: string | any): void {
    this.searchTerm.set(String(term ?? ''));
  }

  goToNewContact(): void {
    this.router.navigate(['/contacts/new']);
  }

  onEditContact(id: number): void {
    this.router.navigate(['/contacts', id, 'edit']);
  }

  onDeleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.contacts.update(contacts => contacts.filter(contact => contact.id !== id));
        this.notificationService.success('Contato removido com sucesso.');
      },
      error: () => {
        this.notificationService.error('Nao foi possivel remover o contato. Tente novamente.');
      },
    });
  }

  private loadContacts(): void {
    this.contactService
      .getContacts()
      .pipe(
        map(res => res.data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: contacts => {
          this.contacts.set(contacts);
        },
        error: () => {
          this.notificationService.error('Nao foi possivel carregar os contatos.');
        },
      });
  }

}
