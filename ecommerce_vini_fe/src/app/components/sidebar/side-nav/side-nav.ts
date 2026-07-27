import { Component, inject } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  public readonly auth = inject(AuthServices);
  constructor() {}
  
  logout() {
  }
}
