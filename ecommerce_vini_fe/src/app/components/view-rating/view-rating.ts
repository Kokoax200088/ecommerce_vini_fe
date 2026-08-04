import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { UtenteServices } from '../../core/services/utente-services';
import { AuthServices } from '../../core/services/auth-services';
import { MatButtonModule } from '@angular/material/button';
import { RatingServices } from '../../core/services/rating-services';

@Component({
  selector: 'app-view-rating',
  imports: [MatIcon, MatCardModule, MatButtonModule],
  templateUrl: './view-rating.html',
  styleUrl: './view-rating.css',
})
export class ViewRating {
  @Input({ required: true }) idCliente!: number;
  @Input({ required: true }) idRating!: number;
  @Input({ required: true }) valutazione!: number;
  @Input({ required: false }) commento?: string;
  @Input({ required: true }) type!: string;
  @Output() eliminato = new EventEmitter<number>();

  cliente = signal<any>(undefined);

  
  private utenteService = inject(UtenteServices);
  private ratingService = inject(RatingServices);
  public readonly auth = inject(AuthServices);

  ngOnInit(): void {
  this.utenteService.getClienteById(this.idCliente).subscribe({
      next: (resp: any) => this.cliente.set(resp),
      error: (err: any) => console.log('errore recupero cliente:', err)
    });
}


onElimina() {
  if (this.type === 'alcolico') {
    this.ratingService.deleteRatingAlcolico(this.idRating).subscribe({
        next: () => {
          console.log('Recensione alcolico eliminata con successo');
          this.eliminato.emit(this.idRating);
        },
        error: (err) => console.error('Errore durante l\'eliminazione della recensione alcolico:', err)
      });
    } else if (this.type === 'cantina') {
      this.ratingService.deleteRatingCantina(this.idRating).subscribe({
        next: () => {
          console.log('Recensione cantina eliminata con successo');
          this.eliminato.emit(this.idRating);
        },
        error: (err) => console.error('Errore durante l\'eliminazione della recensione cantina:', err)
      });
  }
}

  readonly stelle = [1, 2, 3, 4, 5];
}
