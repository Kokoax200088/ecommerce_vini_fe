import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { AbstractControl, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UtenteServices } from '../../../core/services/utente-services';
import { TokenServices } from '../../../core/security/token-services';
import { Cliente, MeDTO } from '../../../core/models/user';
import { AuthServices } from '../../../core/services/auth-services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardContent, MatCardHeader, MatCardTitle, MatCardModule } from "@angular/material/card";
import { MatFormField, MatLabel, MatHint, MatSelect, MatOption } from "@angular/material/select";
import {  MatDatepickerModule, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { NotificationServices } from '../../../core/services/notification-services';

@Component({
  selector: 'app-profile',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatInputModule,
    MatNativeDateModule,
    MatCardHeader,
    MatCardTitle,
    MatCardModule
],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  id = signal('');
  email = signal('');
  loggedUtente = computed(() => this.utenteService.loggedUtente()); //sto provando a prendere le info in questo modo
  //cliente = signal<Cliente[]>([]);
  
  private notification = inject(NotificationServices);
  private utilities = inject(UtilitiesServices);
  public authService = inject(AuthServices);
  showPasswordForm = signal(false);
  private payload : {} = {};

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('',  [Validators.required, this.passwordComplexityValidator(this.utilities.regex)]),
    confirmPassword: new FormControl('', [Validators.required])
  },
  { validators: this.passwordsMatchValidator.bind(this)});


  utenteForm: FormGroup = new FormGroup({
      nome: new FormControl(),
      cognome: new FormControl(),
      dataNascita: new FormControl<Date | string | null>(null,[this.minEtaValidator(18)]),
      
      indirizzo: new FormControl(), //il check si fa dopo se no li chiede entrambi
      partitaIva: new FormControl()
    })

  constructor(
    private routing:Router, 
    private utenteService:UtenteServices,
    private tokenService:TokenServices
    ){}

  ngOnInit(): void {
    // set the signal value from token service
    this.tokenService.me().subscribe({
      next: (resp:MeDTO) => {
        const userId = this.authService.grant().userId;
        if (userId) {
          this.email.set(userId);
          this.utenteService.findLoggedInfos(userId);
          console.log("nome=" + (this.loggedUtente()?.nome));
        }
      },
      error: (resp:any) => {
        console.log("errore in init profile" + resp);
      }
    });

  }

  onSubmit() {
    console.log("submit in profile");

    if (this.authService.grant().isCustomer){
      this.payload = {
        id: this.loggedUtente()?.id,
        nome: this.utenteForm.value.nome,
        cognome: this.utenteForm.value.cognome,
        dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita),
        indirizzo: this.utenteForm.value.indirizzo
      }

      this.utenteService.updateCliente(this.payload).subscribe({
      next: ((resp:any) => {
        console.log("response post modifica profilo utente: " + resp);
        this.utenteForm.clearValidators();
        this.utenteForm.reset();
        this.notification.success("Utente aggiornato correttamente");
        this.utenteService.findLoggedInfos(this.email());
      }),
      error: ((resp:any) => {
        console.log(resp.error.msg);
        this.notification.error("Errore aggiornamento");
      })
    })
    }
    if (this.authService.grant().isSeller){
      this.payload = {
        id: this.loggedUtente()?.id,
        nome: this.utenteForm.value.nome,
        cognome: this.utenteForm.value.cognome,
        dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita),
        partitaIva: this.utenteForm.value.partitaIva
      }

      this.utenteService.updateVenditore(this.payload).subscribe({
      next: ((resp:any) => {
        console.log("response post modifica profilo utente: " + resp);
        this.utenteForm.clearValidators();
        this.utenteForm.reset();
        this.notification.success("Utente aggiornato correttamente");
        this.utenteService.findLoggedInfos(this.email());
      }),
      error: ((resp:any) => {
        console.log(resp.error.msg);
        this.notification.error("Errore aggiornamento");
      })
    })
    }
        
    if (this.authService.grant().isAdmin){
      this.payload = {
        id: this.loggedUtente()?.id,
        nome: this.utenteForm.value.nome,
        cognome: this.utenteForm.value.cognome,
        dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita)
      }

      this.utenteService.update(this.payload).subscribe({
      next: ((resp:any) => {
        console.log("response post modifica profilo utente: " + resp);
        this.utenteForm.reset();
        this.notification.success("Utente aggiornato correttamente");
        this.utenteService.findLoggedInfos(this.email());
      }),
      error: ((resp:any) => {
        console.log(resp.error.msg);
        this.notification.error("Errore aggiornamento");
      })
    })
    }
  }

 onSubmitPassword() {
  if (this.passwordForm.invalid) return;

  if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
    this.notification.error('Le nuove password non coincidono');
    return;
  }

  const payload = {
    email: this.email(), 
    oldPassword: this.passwordForm.value.currentPassword,
    newPassword: this.passwordForm.value.newPassword
  };

  this.utenteService.changePassword(payload).subscribe({
    next: (resp: any) => {
      this.notification.success('Password cambiata correttamente');
      this.passwordForm.reset();
      this.showPasswordForm.set(false);
    },
    error: (resp: any) => {
      console.log(resp);
      this.notification.error(resp?.error?.msg ?? 'Errore aggiornamento password');
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
passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPasswordControl = group.get('confirmPassword');

  if (!newPassword || !confirmPasswordControl?.value) return null;

  if (newPassword !== confirmPasswordControl.value) {
    // Imposta l'errore direttamente sul controllo del campo
    confirmPasswordControl.setErrors({ passwordsMismatch: true });
    return { passwordsMismatch: true };
  } else {
    // Rimuove l'errore custom se le password ora coincidono
    if (confirmPasswordControl.hasError('passwordsMismatch')) {
      delete confirmPasswordControl.errors?.['passwordsMismatch'];
      confirmPasswordControl.updateValueAndValidity({ onlySelf: true });
    }
    return null;
  }
}

passwordComplexityValidator(regex: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Se vuoto lascia gestire a Validators.required

    const valid = regex.test(control.value);
    return valid ? null : { passwordDebole: true };
  };
}
}
