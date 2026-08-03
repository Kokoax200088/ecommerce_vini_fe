import { Component, inject, Input, Output, EventEmitter, computed } from '@angular/core';
import { RatingServices } from '../../core/services/rating-services';
import { UtenteServices } from '../../core/services/utente-services';
import { NotificationServices } from '../../core/services/notification-services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthServices } from '../../core/services/auth-services';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-add-rating',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatCardModule],
  templateUrl: './add-rating.html',
  styleUrl: './add-rating.css',
})
export class AddRating {
  @Input({ required: true }) idAlcolico!: number;
  @Input({ required: true }) idCantina!: number;
  @Output() ratingCreated = new EventEmitter<any>();
  hoveredRating = 0;

  private ratingService = inject(RatingServices);
    private utenteService = inject(UtenteServices);
    private authService = inject(AuthServices);
  
  private notification = inject(NotificationServices);
  
    loggedUtente = computed(() => this.utenteService.loggedUtente());

    ngOnInit(): void {
  const userId = this.authService.grant()?.userId ?? undefined;
  this.utenteService.findLoggedInfos(userId);
}

   ratingForm: FormGroup = new FormGroup({
    valutazione: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    commento: new FormControl(''),
  });

  setRating(rating: number): void {
    this.ratingForm.get('valutazione')?.setValue(rating);
    this.ratingForm.get('valutazione')?.markAsTouched();
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  isStarSelected(star: number): boolean {
    const currentRating = this.ratingForm.get('valutazione')?.value || 0;
    
    if (this.hoveredRating > 0) {
      return star <= this.hoveredRating;
    }
    return star <= currentRating;
  }

  onSubmit(): void {
    if (this.ratingForm.invalid) {
      this.ratingForm.markAllAsTouched();
      return;
    }

    const idCliente = this.utenteService.loggedUtente()?.clienteDTO.id;
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


