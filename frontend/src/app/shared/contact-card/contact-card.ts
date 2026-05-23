import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactModel } from '../../core/models/contact.model';

@Component({
  selector: 'app-contact-card',
  standalone: false,
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.css',
})

export class ContactCard {
  @Input() contact!: ContactModel;
  @Output() editContact = new EventEmitter<number>();
  @Output() deleteContact = new EventEmitter<number>();

  get whatsappHref(): string {
    const phoneNumber = this.contact.number.replace(/\D/g, '').replace(/^0+/, '');

    return phoneNumber ? `https://wa.me/${phoneNumber}` : '#';
  }

  onEdit(): void {
    this.editContact.emit(this.contact.id);
  }

  onDelete(): void {
    this.deleteContact.emit(this.contact.id);
  }
}
