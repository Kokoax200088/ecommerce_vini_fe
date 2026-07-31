import { Component, inject, Input, Output } from '@angular/core';
import { EventEmitter } from 'stream';
import { RatingServices } from '../../core/services/rating-services';
import { UtenteServices } from '../../core/services/utente-services';
import { NotificationServices } from '../../core/services/notification-services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-rating',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './add-rating.html',
  styleUrl: './add-rating.css',
})
export class AddRating {
  @Input({ required: true }) idAlcolico!: number;
  @Input({ required: true }) idCantina!: number;
  @Output() ratingCreated = new EventEmitter<any>();

  private ratingService = inject(RatingServices);
  private utenteService = inject(UtenteServices);
  private notification = inject(NotificationServices);

   ratingForm: FormGroup = new FormGroup({
    valutazione: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    commento: new FormControl(''),
  });

  onSubmit(): void {
    if (this.ratingForm.invalid) {
      this.ratingForm.markAllAsTouched();
      return;
    }

    const idCliente = this.utenteService.loggedUtente()?.id;
    if (!idCliente) {
      this.notification.error('Impossibile identificare il cliente');
      return;
    }

    this.ratingService.createRatingAlcolico({
      id_alcolico: this.idAlcolico,
      id_cantina: this.idCantina,
      id_cliente: idCliente,
      valutazione: this.ratingForm.value.valutazione,
      commento: this.ratingForm.value.commento,
    }).subscribe({
      next: (resp) => {
        this.notification.success('Recensione aggiunta correttamente');
        this.ratingForm.reset();
        this.ratingCreated.emit(resp);
      },
      error: (err) => {
        console.log('errore creazione recensione:', err);
        this.notification.error('Errore durante invio della recensione');
      },
    });
  }
}


