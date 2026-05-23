import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactList } from './features/contacts/contact-list/contact-list';
import { ContactForm } from './features/contacts/contact-form/contact-form';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contacts' },
  { path: 'contacts', component: ContactList },
  { path: 'contacts/new', component: ContactForm },
  { path: 'contacts/:id/edit', component: ContactForm },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
