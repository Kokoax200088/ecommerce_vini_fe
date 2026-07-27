import { Component, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import {  AuthServices } from '../../../core/services/auth-services';
import { Router } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { User } from '../../../core/models/user';
import { UtenteServices } from '../../../core/services/utente-services';
import { UtilitiesServices } from '../../../core/services/utilities-services';

@Component({
  selector: 'app-registration',
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatCardModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  // initialize signal with null to satisfy expected arguments
  account = signal<User | null>(null);
  msg = signal('');
  //@ViewChild('registrationForm') registrationForm!: NgForm;

  utenteForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    cognome: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    ruolo: new FormControl(1, Validators.required),
    dataNascita: new FormControl(null, Validators.required),
    
    indirizzo: new FormControl(null, null), //il check si fa dopo se no li chiede entrambi
    partitaIva: new FormControl(null, null)
  })

  constructor(private routing:Router, private utenteService:UtenteServices, private utilities:UtilitiesServices) {}
  
  ngOnInit(): void{
    //qui nella repo c'era il codice se dovessi aggiornare il profilo
    //non registrarlo, lo qualora dovesse servire in futuro
  }
  
  onSubmit() {
    console.log("trying to register user with role ", this.utenteForm.value.ruolo);
    this.msg.set("");

    if (this.utenteForm.value.ruolo === 1){
      this.createClienteForm(this.utenteForm);
    } else {
      this.createVenditoreForm(this.utenteForm);
    }
  }
  
  createClienteForm(form: FormGroup){
    console.log("creating cliente data: " + this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita));
    if (this.utenteForm.valid) {
      this.utenteService.createCliente({
        nome: this.utenteForm.value.nome,
        cognome: this.utenteForm.value.cognome,
        email: this.utenteForm.value.email,
        password: this.utenteForm.value.password,
        dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita),
        idRuolo: this.utenteForm.value.ruolo,

        indirizzo: this.utenteForm.value.indirizzo,
      }).subscribe({
        next: ((resp:any) => {
          console.log("QUESTA E' LA RESP: " + resp);
        }),
        error: ((resp:any) => {
          console.log(resp.error.msg);
          this.msg.set(resp.error.msg);
          })
      });
    }
  }

  createVenditoreForm(form: FormGroup){
    console.log("creating venditore");
    if (this.utenteForm.valid) {
      this.utenteService.createVenditore({
        nome: this.utenteForm.value.nome,
        cognome: this.utenteForm.value.cognome,
        email: this.utenteForm.value.email,
        password: this.utenteForm.value.password,
        dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita),
        idRuolo: this.utenteForm.value.ruolo,

        partitaIva: this.utenteForm.value.partitaIva,
      }).subscribe({
        next: ((resp:any) => {
          console.log("QUESTA E' LA RESP: " + resp);
        }),
        error: ((resp:any) => {
          console.log(resp.error.msg);
          this.msg.set(resp.error.msg);
          })
      });
    }
  }

}
