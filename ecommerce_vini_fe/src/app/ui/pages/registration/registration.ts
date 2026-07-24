import { Component, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {  AuthServices } from '../../../core/services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  msg = signal('');
  @ViewChild('registrationForm') registrationForm!: NgForm;

  constructor(private routing:Router, private authService:AuthServices) {}

  
//TODO: Cambiare
  onSubmit() {
    if (this.registrationForm.valid) {
      this.authService.registration(this.registrationForm.value);
    } else {
      this.msg.set('Per favore, compila tutti i campi richiesti.');
    }
  }
}
