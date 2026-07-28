import { Component, signal } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from "@angular/material/button";
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCardContent, MatCardModule } from "@angular/material/card";
import { UtenteServices } from '../../../core/services/utente-services';
import { TokenServices } from '../../../core/security/token-services';
import { AuthServices } from '../../../core/services/auth-services';
imimports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAnchor, ReactiveFormsModule, MatCardContent]
import { Router } from '@angular/router';
import { MeDTO } from '../../../core/models/user';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatAnchor, ReactiveFormsModule, MatCardModule, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  msg = signal('');
  email = ""; //questo ci servirà per fare la schermata di benvenuto?

  loginForm: FormGroup = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required)
  })

  constructor(
    private account:TokenServices,
    private auth: AuthServices,
    private routing:Router,
    private util: UtilitiesServices,
    private service:UtenteServices
  ){}

    onSubmit(){
      console.log("trying to log in");

      this.account.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: (resp:MeDTO) => {
          this.msg.set("");
          console.log("QUESTA E' LA RESP:" + resp);

          this.auth.setAuthenticated(resp);
          this.routing.navigate(['']);
          //stuff about the dialog here, not useful for now
        },
        error: (resp:any) => {
          console.log(resp);
          this.msg.set(resp.error.msg);
          this.email = this.loginForm.value.email;
        }
      });
  }

  registrazione(){
    console.log("open registrazione page");
  }

  /*onResendChange(e: MatCheckboxChange) {
    console.log('resend change', e.checked);
  }*/
}
