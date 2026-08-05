import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { User } from '../../../core/models/user';
import { UtenteServices } from '../../../core/services/utente-services';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { MatIcon } from '@angular/material/icon';
import { NotificationServices } from '../../../core/services/notification-services';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    MatSelectModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatCardModule, 
    MatIcon, 
    ReactiveFormsModule
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  account = signal<User | null>(null);
  msg = signal<string>('');

  private readonly notification = inject(NotificationServices);
  private readonly routing = inject(Router);
  private readonly utenteService = inject(UtenteServices);
  private readonly utilities = inject(UtilitiesServices);

  utenteForm = new FormGroup({
    nome: new FormControl<string | null>(null, Validators.required),
    cognome: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, this.passwordComplexityValidator(this.utilities.regex)]),
    ruolo: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
    dataNascita: new FormControl<Date | string | null>(null, [Validators.required, this.minEtaValidator(18)]),
    indirizzo: new FormControl<string | null>(null),
    partitaIva: new FormControl<string | null>(null)
  });

  onSubmit(): void {
    this.msg.set('');

    if (this.utenteForm.invalid) {
      this.utenteForm.markAllAsTouched();
      return;
    }

    if (this.utenteForm.value.ruolo === 1) {
      this.createClienteForm();
    } else {
      this.createVenditoreForm();
    }
  }

  private createClienteForm(): void {
    const rawValue = this.utenteForm.getRawValue();

    this.utenteService.createCliente({
      nome: rawValue.nome!,
      cognome: rawValue.cognome!,
      email: rawValue.email!,
      password: rawValue.password!,
      dataNascita: this.utilities.formatDateToDDMMYYYY(rawValue.dataNascita),
      idRuolo: rawValue.ruolo,
      indirizzo: rawValue.indirizzo,
    }).subscribe({
      next: () => {
        this.utenteForm.reset();
        this.notification.success("Creato Account cliente");
        this.routing.navigate(['/login']);
      },
      error: (resp: any) => {
        this.notification.error("Errore durante la registrazione. Riprovare.");
        this.msg.set(resp?.error?.msg || 'Errore di sistema');
      }
    });
  }

  private createVenditoreForm(): void {
    const rawValue = this.utenteForm.getRawValue();

    this.utenteService.createVenditore({
      nome: rawValue.nome!,
      cognome: rawValue.cognome!,
      email: rawValue.email!,
      password: rawValue.password!,
      dataNascita: this.utilities.formatDateToDDMMYYYY(rawValue.dataNascita),
      idRuolo: rawValue.ruolo,
      partitaIva: rawValue.partitaIva,
    }).subscribe({
      next: () => {
        this.utenteForm.reset();
        this.notification.success("Creato Account venditore");
        this.routing.navigate(['/login']);
      },
      error: (resp: any) => {
        this.notification.error("Errore durante la registrazione. Riprovare.");
        this.msg.set(resp?.error?.msg || 'Errore di sistema');
      }
    });
  }

  private minEtaValidator(minEta: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const dataNascita = new Date(control.value);
      if (isNaN(dataNascita.getTime())) return null;

      const oggi = new Date();
      let eta = oggi.getFullYear() - dataNascita.getFullYear();
      const diffMesi = oggi.getMonth() - dataNascita.getMonth();

      if (diffMesi < 0 || (diffMesi === 0 && oggi.getDate() < dataNascita.getDate())) {
        eta--;
      }

      return eta >= minEta ? null : { minorenne: { etaAttuale: eta, etaMinima: minEta } };
    };
  }

  passwordComplexityValidator(regex: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Se vuoto lascia gestire a Validators.required

    const valid = regex.test(control.value);
    return valid ? null : { passwordDebole: true };
  };
}
}