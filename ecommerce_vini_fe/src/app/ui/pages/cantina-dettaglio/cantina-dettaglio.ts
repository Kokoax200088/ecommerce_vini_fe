import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CantinaServices } from '../../../core/services/cantina-services';
import { UploadImageService } from '../../../core/services/uploadImage';
import { MatIcon } from "@angular/material/icon";
import { Cantina, CantinaALcolico } from '../../../core/models/cantina';
import { CardAlcolico } from "../../../components/card-alcolico/card-alcolico";
import { AlcolicoServices } from '../../../core/services/alcolico-services';

@Component({
  selector: 'app-cantina-dettaglio',
  standalone: true,
  imports: [MatIcon, CardAlcolico],
  templateUrl: './cantina-dettaglio.html',
  styleUrl: './cantina-dettaglio.css',
})
export class CantinaDettaglio implements OnInit {
  id: number = 0;
  cantina!: Cantina;
  listCantinaALcolico?: CantinaALcolico[];
  alcolici: any;
  immagineUrl: string = '/image-cantina.png';

  constructor(
    private route: ActivatedRoute,
    private cantinaService: CantinaServices,
    private uploadImageCantinaService: UploadImageService
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cantinaService.getById(this.id).subscribe({
      next: (resp) => {
        this.cantina = resp;
        this.listCantinaALcolico = resp.listCantinaAlcolico;
        this.caricaImmagine();
      },
      error: (err) => {
        console.error('Errore nel caricamento cantina', err);
      }
    });
    
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
}