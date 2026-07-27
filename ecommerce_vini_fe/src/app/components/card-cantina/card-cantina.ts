import { Component, Input } from '@angular/core';
import { UploadImageService } from '../../core/services/uploadImage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-cantina',
  imports: [],
  templateUrl: './card-cantina.html',
  styleUrl: './card-cantina.css',
})
export class CardCantina {
 @Input() cantina!: Cantina;
  immagineUrl: any;

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
    },
    error: () => {
      this.immagineUrl = '/image-cantina.png';
    }
  });
}

onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = '/image-cantina.png';
}

  vaiAlDettaglio(): void {
    this.router.navigate(['/cantina', this.cantina.id]);
  }
}
