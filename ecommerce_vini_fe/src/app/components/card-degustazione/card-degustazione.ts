import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UploadImageService } from '../../core/services/uploadImage';
import { Degustazione } from '../../core/models/degustazione';

@Component({
  selector: 'app-card-degustazione',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './card-degustazione.html',
  styleUrl: './card-degustazione.css',
})
export class CardDegustazione {
   @Input() degustazione!: Degustazione;
  immagineUrl: any;
  private cdr = inject(ChangeDetectorRef); // per quando ho le img forzo angular: ho dei componenti cambiati

  constructor(
    private router: Router,
    private uploadImageDegustazioneService: UploadImageService
  ) {}
 ngOnInit(): void {
     if (this.degustazione?.immagini?.length) {
    const immagine = this.degustazione.immagini[this.degustazione.immagini.length - 1];
    this.immagineUrl = immagine.url;
    this.cdr.markForCheck();
  } else {
    this.caricaImmagine();
  }
  }

caricaImmagine(): void {
  this.uploadImageDegustazioneService.list<any>('degustazione', 'idDegustazione', this.degustazione.id).subscribe({
    next: (immagini: any[]) => {
      const immagine = immagini?.[immagini.length - 1];
      this.immagineUrl = immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-degustazione.png';
      console.log("URL IMMAGINE "+this.immagineUrl);
      this.cdr.markForCheck(); 
    },
    error: () => {
      this.immagineUrl = '/image-degustazione.png';
      this.cdr.markForCheck(); 
    }
  });
}

onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = '/image-degustazione.png';
}

}
