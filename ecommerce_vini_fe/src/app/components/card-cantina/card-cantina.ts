import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { UploadImageService } from '../../core/services/uploadImage';
import { Router, RouterModule } from '@angular/router';
import { Cantina } from '../../core/models/cantina';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-cantina',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './card-cantina.html',
  styleUrl: './card-cantina.css',
})
export class CardCantina {
 @Input() cantina!: Cantina;
  immagineUrl: any;
  private cdr = inject(ChangeDetectorRef); // per quando ho le img forzo angular: ho dei componenti cambiati

  constructor(
    private router: Router,
    private uploadImageCantinaService: UploadImageService
  ) {}


 ngOnInit(): void {
    this.caricaImmagine();
  }
  
caricaImmagine(): void {
  this.uploadImageCantinaService.getById('cantina', this.cantina.id).subscribe({
    next: (immagine: any) => {
      this.immagineUrl = immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-cantina.png';
      this.cdr.markForCheck(); 
    },
    error: () => {
      this.immagineUrl = '/image-cantina.png';
      this.cdr.markForCheck(); 
    }
  });
}

onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = '/image-cantina.png';
}

  vaiAlDettaglioCantina(): void {
    this.router.navigate(['/cantina-dettaglio', this.cantina.id]);
  }

  get mediaValutazione(): number {
  const ratings = this.cantina.listRatingCantina;
  if (!ratings || ratings.length === 0) {
    return 0;
  }
  const somma = ratings.reduce((acc, r) => acc + r.valutazione, 0);
  return somma / ratings.length;
}

get numeroRecensioni(): number {
  return this.cantina.listRatingCantina?.length ?? 0;
}

readonly stelle = [1, 2, 3, 4, 5];
}
