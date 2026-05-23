import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ContactList } from './features/contacts/contact-list/contact-list';
import { ContactForm } from './features/contacts/contact-form/contact-form';
import { SearchBar } from './shared/search-bar/search-bar';
import { ContactCard } from './shared/contact-card/contact-card';
import { MockApiInterceptor } from './core/interceptors/mock-api.interceptor';

@NgModule({
  declarations: [
    App,
    ContactList,
    ContactForm,
    SearchBar,
    ContactCard,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
