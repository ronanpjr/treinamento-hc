import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, phoneValidator()],
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

  get phoneControl(): FormControl<string> {
    return this.contactForm.controls.phone;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.notificationService.error('Preencha um telefone valido antes de salvar.');
      return;
    }

    const phone = this.normalizePhone(this.phoneControl.value);

    if (this.editingContactId !== null) {
      this.contactService
        .updateContact({
          id: this.editingContactId,
          name: this.nameControl.value,
          phone,
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
      .createContact({
        name: this.nameControl.value,
        phone,
      })
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
        next: data => {
          this.contactForm.patchValue({
            name: data.name,
            phone: data.phone,
          });
        },
        error: () => {
          this.notificationService.error('Nao foi possivel carregar o contato para edicao.');
          this.router.navigate(['/contacts']);
        },
      });
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('55')) {
      return digits;
    }

    return `55${digits}`;
  }
}

function phoneValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const digits = control.value.replace(/\D/g, '');

    if (!digits) {
      return null;
    }

    const isLocalBrazilianNumber = digits.length === 10 || digits.length === 11;
    const isCountryCodeBrazilianNumber = (digits.length === 12 || digits.length === 13) && digits.startsWith('55');

    return isLocalBrazilianNumber || isCountryCodeBrazilianNumber ? null : { phoneFormat: true };
  };
}
