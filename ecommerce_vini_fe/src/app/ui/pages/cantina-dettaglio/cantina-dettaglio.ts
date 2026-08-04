import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CantinaServices } from '../../../core/services/cantina-services';
import { UploadImageService } from '../../../core/services/uploadImage';
import { MatIcon } from "@angular/material/icon";
import { Cantina } from '../../../core/models/cantina';
import { AlcoliciCantina } from '../../../components/alcolici-cantina/alcolici-cantina';
import { DegustazioniCantina } from "../../../components/degustazioni-cantina/degustazioni-cantina";
import { BoxCantina } from "../../../components/box-cantina/box-cantina";
import { ViewRating } from "../../../components/view-rating/view-rating";
import { AddRatingCantina } from "../../../components/add-rating-cantina/add-rating-cantina";
import { AlcolicoNuovo } from "../../../components/alcolico-nuovo/alcolico-nuovo";
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../core/services/utente-services'; 
import { CantinaCreate } from '../../../dialogs/cantina-create/cantina-create';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CantinaDelete } from '../../../dialogs/cantina-delete/cantina-delete';

@Component({
  selector: 'app-cantina-dettaglio',
  standalone: true,
  imports: [MatIcon, AlcoliciCantina, MatButtonModule, DegustazioniCantina, BoxCantina, ViewRating, AddRatingCantina, AlcolicoNuovo],
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
  public readonly utenteService = inject(UtenteServices); 

  constructor(
    private route: ActivatedRoute,
    private cantinaService: CantinaServices,
    private uploadImageCantinaService: UploadImageService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("CantinaDettaglio instanziato, idCantina:" + this.id);
    
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
    this.uploadImageCantinaService.list<any>('cantina', 'idCantina', this.id).subscribe({
      next: (immagini: any[]) => {
        if (immagini && immagini.length > 0) {
          const primaImmagine = immagini[0];
          this.immagineUrl = primaImmagine.url ?? primaImmagine.path ?? primaImmagine.nomeFile ?? '/image-cantina.png';
        } else {
          this.immagineUrl = '/image-cantina.png';
        }
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

  get isOwner(): boolean {
    if (!this.cantina || !this.cantina.idVenditore) return false;

    if (!this.auth.grant().isSeller) return false;

    const utenteCorrente: any = this.utenteService.loggedUtente();

    if (!utenteCorrente) return false;

    // Recupera l'ID del venditore dal venditoreDTO dell'utente loggato
    const idVenditoreLoggato = utenteCorrente.venditoreDTO?.id;

    if (!idVenditoreLoggato) return false;

    return Number(this.cantina.idVenditore) === Number(idVenditoreLoggato);
}
}