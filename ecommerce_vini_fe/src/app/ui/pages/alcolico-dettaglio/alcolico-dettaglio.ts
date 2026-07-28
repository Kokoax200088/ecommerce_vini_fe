import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AlcolicoModel } from '../../../core/models/alcolico';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { UploadImageService } from '../../../core/services/uploadImage';

@Component({
  selector: 'app-alcolico-dettaglio',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './alcolico-dettaglio.html',
  styleUrl: './alcolico-dettaglio.css',
})
export class AlcolicoDettaglio implements OnInit {
  id: number = 0;
  alcolico = signal<AlcolicoModel | undefined>(undefined);
  immagineUrl = signal<string>('/image-alcolico.png');

  constructor(
    private route: ActivatedRoute,
    private alcolicoService: AlcolicoServices,
    private uploadImageAlcolicoService: UploadImageService
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alcolicoService.getById(this.id).subscribe({
      next: (resp) => {
        this.alcolico.set(resp);
        this.caricaImmagine();
      },
      error: (err) => {
        console.error('Errore nel caricamento alcolico', err);
      }
    });
  }

  caricaImmagine(): void {
    this.uploadImageAlcolicoService.getById('alcolico', this.id).subscribe({
      next: (immagine: any) => {
        this.immagineUrl.set(immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-alcolico.png');
      },
      error: () => {
        this.immagineUrl.set('/image-alcolico.png');
      }
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/image-alcolico.png';
  }
}
