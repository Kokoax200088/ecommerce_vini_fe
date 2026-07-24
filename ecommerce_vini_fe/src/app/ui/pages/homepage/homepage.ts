import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardAlcolico } from '../../../components/card-alcolico/card-alcolico';
import { AlcolicoModel } from '../../../core/models/alcolico';
// import del tuo service per recuperare gli alcolici, es:
// import { AlcolicoService } from '../services/alcolico.service';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, MatIconModule, MatButtonModule, /*CardAlcolico*/],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
   alcolici: AlcolicoModel[] = [];

  constructor(private router: Router /*, private alcolicoService: AlcolicoService */) {}

  ngOnInit(): void {
    // this.alcolicoService.list().subscribe(data => this.alcolici = data);
  }


  navigateListAlcolici(): void {
    this.router.navigate(['/alcolici']); // adatta il path alla tua route
  }

  onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = '/image-alcolico.png';
}
}
