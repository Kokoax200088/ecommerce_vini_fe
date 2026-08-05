import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SpedizioneServices } from '../../core/services/spedizione-alcolico-services';
import { STATUS_SPEDIZIONE } from '../../core/models/status';
import { NotificationServices } from '../../core/services/notification-services';

@Component({
  selector: 'app-spedizione-details',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './spedizione-details.html',
  styleUrl: './spedizione-details.css',
})
export class SpedizioneDetails {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SpedizioneDetails>);
  private readonly spedizioniService = inject(SpedizioneServices);
  private readonly notification = inject(NotificationServices);

  readonly mod: string = this.data?.mod ?? 'V';
  readonly spedizione: any = this.data?.spedizione ?? null;

  readonly isUpdating = signal(false);
  readonly errore = signal<string | null>(null);

  get isConsegnata(): boolean {
    return this.spedizione?.status?.id === STATUS_SPEDIZIONE.CONSEGNATO;
  }

  customerName(cliente: any): string {
    if (!cliente) return 'Cliente sconosciuto';
    const nome = [cliente.nome, cliente.cognome].filter(Boolean).join(' ');
    return nome || cliente.email || `Utente #${cliente.id}`;
  }

  cantinaName(cantina: any): string {
    if (!cantina) return '—';
    return cantina.nome ?? cantina.ragione_sociale ?? `Cantina #${cantina.id}`;
  }

  ordineLabel(ordineAlcolico: any): string {
    if (!ordineAlcolico) return '—';
    return `#${ordineAlcolico.id}`;
  }

  segnaConsegnata(): void {
    if (!this.spedizione || this.isConsegnata) return;

    this.isUpdating.set(true);
    this.errore.set(null);

    // NOTA: assumo che SpedizioneServices esponga un metodo updateStatus(id, idStatus).
    // Se il service espone invece un update(id, payload) generico, va sostituita questa chiamata.
    this.spedizioniService.updateStatus(this.spedizione.id, STATUS_SPEDIZIONE.CONSEGNATO).subscribe({
      next: (spedizioneAggiornata: any) => {
        this.notification.success("Spedizione confermata.");
        this.isUpdating.set(false);
        this.dialogRef.close({ updated: true, spedizione: spedizioneAggiornata });
      },
      error: (err: any) => {
        this.isUpdating.set(false);
        this.errore.set('Errore durante l\'aggiornamento dello stato. Riprova.');
        console.error(err);
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}