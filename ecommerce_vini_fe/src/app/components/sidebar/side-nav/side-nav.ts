import { Component, computed, inject } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { AuthServices } from '../../../core/services/auth-services';
import { Router } from '@angular/router';
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  public readonly auth = inject(AuthServices);
  constructor(private routing: Router, private authService: AuthServices) {
  }
  
  profile(){
    console.log("access to profile");
    this.routing.navigate(['/profile']);
  }

  logout() {
    this.auth.resetAll();
    this.routing.navigate(['/']);
  }
}
