import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ContactService } from '../../../core/services/contact.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  private readonly destroyRef = inject(DestroyRef);
  private readonly contactService = inject(ContactService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private editingContactId: number | null = null;

  readonly contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[1-9]{2}9\d{8}$/)],
    }),
  });

  constructor() {
    this.tryEnableEditMode();
  }

  get isEditMode(): boolean {
    return this.editingContactId !== null;
  }

  get nameControl(): FormControl<string> {
    return this.contactForm.controls.name;
  }

  get numberControl(): FormControl<string> {
    return this.contactForm.controls.number;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.notificationService.error('Preencha um telefone valido antes de salvar.');
      return;
    }

    if (this.editingContactId !== null) {
      this.contactService
        .updateContact({
          id: this.editingContactId,
          ...this.contactForm.getRawValue(),
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notificationService.success('Contato atualizado com sucesso.');
            this.router.navigate(['/contacts']);
          },
          error: () => {
            this.notificationService.error('Nao foi possivel atualizar o contato. Tente novamente.');
          },
        });
      return;
    }

    this.contactService
      .createContact(this.contactForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.success('Contato salvo com sucesso.');
          this.router.navigate(['/contacts']);
        },
        error: () => {
          this.notificationService.error('Nao foi possivel salvar o contato. Tente novamente.');
        },
      });
  }

  private tryEnableEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);
    if (!Number.isInteger(id) || id < 1) {
      this.notificationService.error('Contato invalido para edicao.');
      this.router.navigate(['/contacts']);
      return;
    }

    this.editingContactId = id;
    this.contactService
      .getContactById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.contactForm.patchValue({
            name: data.name,
            number: data.number,
          });
        },
        error: () => {
          this.notificationService.error('Nao foi possivel carregar o contato para edicao.');
          this.router.navigate(['/contacts']);
        },
      });
  }
}
