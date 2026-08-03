import { Component, inject, Input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { UtenteServices } from '../../core/services/utente-services';

@Component({
  selector: 'app-view-rating',
  imports: [MatIcon, MatCardModule],
  templateUrl: './view-rating.html',
  styleUrl: './view-rating.css',
})
export class ViewRating {
  @Input({ required: true }) idCliente!: number;
  @Input({ required: true }) valutazione!: number;
  @Input({ required: false }) commento?: string;

  cliente = signal<any>(undefined);

  
  private utenteService = inject(UtenteServices);

  ngOnInit(): void {
  this.utenteService.getClienteById(this.idCliente).subscribe({
      next: (resp: any) => this.cliente.set(resp),
      error: (err: any) => console.log('errore recupero cliente:', err)
    });
}



  readonly stelle = [1, 2, 3, 4, 5];
}
