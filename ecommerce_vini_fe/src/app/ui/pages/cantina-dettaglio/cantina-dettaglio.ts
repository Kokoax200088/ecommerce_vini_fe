import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CantinaServices } from '../../../core/services/cantina-services';
import { UploadImageService } from '../../../core/services/uploadImage';
import { MatIcon } from "@angular/material/icon";
import { Cantina, CantinaALcolico } from '../../../core/models/cantina';
import { CardAlcolico } from "../../../components/card-alcolico/card-alcolico";
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { AlcoliciCantina } from '../../../components/alcolici-cantina/alcolici-cantina';
import { DegustazioniCantina } from "../../../components/degustazioni-cantina/degustazioni-cantina";
import { BoxCantina } from "../../../components/box-cantina/box-cantina";

@Component({
  selector: 'app-cantina-dettaglio',
  standalone: true,
  imports: [MatIcon, AlcoliciCantina, DegustazioniCantina, BoxCantina],
  templateUrl: './cantina-dettaglio.html',
  styleUrl: './cantina-dettaglio.css',
})
export class CantinaDettaglio implements OnInit {
  id: number = 0;
  cantina!: Cantina;
  alcolici: any;
  immagineUrl: string = '/image-cantina.png';
  private cdr = inject(ChangeDetectorRef);

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
}