import { ContactModel } from './contact.model';

export type ContactFormValue = Omit<ContactModel, 'id'>;
