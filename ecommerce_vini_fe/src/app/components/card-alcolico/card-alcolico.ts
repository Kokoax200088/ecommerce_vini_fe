import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UploadImageService } from '../../core/services/uploadImage';
import { AlcolicoModel } from '../../core/models/alcolico';

@Component({
  selector: 'app-card-alcolico',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './card-alcolico.html',
  styleUrl: './card-alcolico.css',
})
export class CardAlcolico {
   @Input() alcolico!: AlcolicoModel;
  immagineUrl: any;
  private cdr = inject(ChangeDetectorRef); // per quando ho le img forzo angular: ho dei componenti cambiati

  constructor(
    private router: Router,
    private uploadImageAlcolicoService: UploadImageService
  ) {}
 ngOnInit(): void {
    this.caricaImmagine();
  }

caricaImmagine(): void {
  this.uploadImageAlcolicoService.getById('alcolico', this.alcolico.id).subscribe({
    next: (immagine: any) => {
      this.immagineUrl = immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-alcolico.png';
      this.cdr.markForCheck(); 
    },
    error: () => {
      this.immagineUrl = '/image-alcolico.png';
      this.cdr.markForCheck(); 
    }
  });
}

onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = '/image-alcolico.png';
}

  vaiAlDettaglio(): void {
    this.router.navigate(['/alcolico', this.alcolico.id]);
  }
}
