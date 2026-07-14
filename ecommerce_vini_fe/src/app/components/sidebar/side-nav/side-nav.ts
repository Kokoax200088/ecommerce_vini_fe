import { Component } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  constructor(private authService: AuthService) {}
  
  logout() {
    this.authService.logout();
  }
}
