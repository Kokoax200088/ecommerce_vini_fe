import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardAlcolico } from '../../../components/card-alcolico/card-alcolico';
import { AlcolicoModel } from '../../../core/models/alcolico';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
// import del tuo service per recuperare gli alcolici, es:
// import { AlcolicoService } from '../services/alcolico.service';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, MatIconModule, MatButtonModule, CardAlcolico],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  alcolici: any; 

  constructor(private router: Router, private alcolicoService: AlcolicoServices) {
    this.alcolici = this.alcolicoService.alcolici;
  }

  ngOnInit(): void {
    this.alcolicoService.list(); 
  }


  navigateListAlcolici(): void {
    this.router.navigate(['/alcolici']); 
  }

  navigateListCantine(): void {
    this.router.navigate(['/cantine']);
  }

}
