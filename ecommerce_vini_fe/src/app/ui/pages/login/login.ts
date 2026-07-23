import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from "@angular/material/button";
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAnchor, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required)
  })

  constructor(private service:UtenteServices){}

    onSubmit(){
    this.service.create({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe({
      next:((r:any) =>{
         console.log(r.msg);
         this.loginForm.reset(); 
      }),
      error:((r:any) => {
        console.log(r);
      })

    })

  }
}
