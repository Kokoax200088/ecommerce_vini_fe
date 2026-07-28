import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { UtenteServices } from '../../../core/services/utente-services';
import { TokenServices } from '../../../core/security/token-services';
import { Cliente, MeDTO } from '../../../core/models/user';
import { AuthServices } from '../../../core/services/auth-services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardContent } from "@angular/material/card";
import { MatFormField, MatLabel, MatHint, MatSelect, MatOption } from "@angular/material/select";
import {  MatDatepickerModule, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { UtilitiesServices } from '../../../core/services/utilities-services';

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
  MatNativeDateModule
],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  id = signal('');
  email = signal('');
  loggedUtente = computed(() => this.utenteService.loggedUtente()); //sto provando a prendere le info in questo modo
  //cliente = signal<Cliente[]>([]);

  utenteForm: FormGroup = new FormGroup({
      nome: new FormControl(),
      cognome: new FormControl(),
      dataNascita: new FormControl(),
      
      indirizzo: new FormControl(), //il check si fa dopo se no li chiede entrambi
      partitaIva: new FormControl()
    })

  constructor(
    private routing:Router, 
    private utenteService:UtenteServices,
    private authService:AuthServices,
    private tokenService:TokenServices,
    private utilities:UtilitiesServices
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

    this.utenteService.update({
      id: this.loggedUtente()?.id,
      nome: this.utenteForm.value.nome,
      cognome: this.utenteForm.value.cognome,
      dataNascita: this.utilities.formatDateToDDMMYYYY(this.utenteForm.value.dataNascita)
    }).subscribe({
      next: ((resp:any) => {
        console.log("response post modifica profilo utente: " + resp);
      }),
      error: ((resp:any) => {
        console.log(resp.error.msg);
      })
    })
  }
}
