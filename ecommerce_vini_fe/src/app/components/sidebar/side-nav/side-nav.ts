import { Component, inject } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { AuthServices } from '../../../core/services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  public readonly auth = inject(AuthServices);
  constructor(private routing: Router) {}
  
  profile(){
    console.log("access to profile");
    this.routing.navigate(['/profile']);
  }

  logout() {
    this.auth.resetAll();
    //TODO aggiungi il routing alla home dopo il logout
  }
}
