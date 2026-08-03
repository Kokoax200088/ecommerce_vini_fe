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
import { CardAddBox } from "../../../components/card-add-box/card-add-box";
import { ViewRating } from "../../../components/view-rating/view-rating";
import { AlcolicoNuovo } from "../../../components/alcolico-nuovo/alcolico-nuovo";
import { AddRatingCantina } from "../../../components/add-rating-cantina/add-rating-cantina";
import { AuthServices } from '../../../core/services/auth-services';
import { CantinaCreate } from '../../../dialogs/cantina-create/cantina-create';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CantinaDelete } from '../../../dialogs/cantina-delete/cantina-delete';

@Component({
  selector: 'app-cantina-dettaglio',
  standalone: true,
  imports: [MatIcon, AlcoliciCantina,MatButtonModule, DegustazioniCantina, BoxCantina, ViewRating, AlcolicoNuovo, AddRatingCantina, CardAddBox],
  templateUrl: './cantina-dettaglio.html',
  styleUrl: './cantina-dettaglio.css',
})
export class CantinaDettaglio implements OnInit {
  id: number = 0;
  cantina!: Cantina;
  alcolici: any;
  immagineUrl: string = '/image-cantina.png';
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  public readonly auth = inject(AuthServices);

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

    console.log("CantinaDettaglio instanziato, idCantina:" + this.id);
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

reloadCantina() {
 this.cantinaService.getById(this.id).subscribe({
      next: (resp) => {
        this.cantina = resp;
     this.caricaImmagine();
     this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento cantina', err);
      }
    });
  }
  
  apriModificaCantina() {
    console.log("Apri Modifica Cantina con ID:", this.cantina.id);
    const dialogRef = this.dialog.open(CantinaCreate, {
      width: '60%',
      data: { id: this.cantina.id }
    });
      
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadCantina();
        window.location.reload();
      }
    });
  }  

  apriEliminaCantina(): void {
    this.dialog.open(CantinaDelete, {
      width: '40%',
      data: {
        idCantina: this.cantina?.id,
        message: `Sei sicuro di voler eliminare la cantina "${this.cantina?.nome}"? L'operazione è irreversibile.`
      }
    });
  }

  get isSeller(): boolean {
    return this.auth.grant().isSeller;
  }
}