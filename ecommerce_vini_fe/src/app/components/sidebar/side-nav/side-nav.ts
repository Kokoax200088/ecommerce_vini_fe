import { Component } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  constructor(private authService: AuthServices) {}
  
  logout() {
    this.authService.resetAll(); //CHECK devo fare una funzione di logout o la resetAll svolge la stessa funzione?
  }
}
