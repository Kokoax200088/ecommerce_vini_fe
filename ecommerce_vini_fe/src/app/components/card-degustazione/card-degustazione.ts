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
    this.caricaImmagine();
  }

caricaImmagine(): void {
  this.uploadImageDegustazioneService.getById('degustazione', this.degustazione.id).subscribe({
    next: (immagine: any) => {
      this.immagineUrl = immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-degustazione.png';
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

  vaiAlDettaglio(): void {
    this.router.navigate(['/degustazione', this.degustazione.id]);
  }
}
