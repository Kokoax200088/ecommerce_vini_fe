import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SpedizioneServices } from '../../core/services/spedizione-alcolico-services';
import { SpedizioneBoxServices } from '../../core/services/spedizione-box-services';
import { AuthServices } from '../../core/services/auth-services';
import { STATUS_SPEDIZIONE } from '../../core/models/status';

type TipoSpedizione = 'ALCOLICO' | 'BOX';

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
  private readonly spedizioniBoxService = inject(SpedizioneBoxServices);
  private readonly authServices = inject(AuthServices);

  readonly mod: string = this.data?.mod ?? 'V';
  readonly tipo: TipoSpedizione = this.data?.tipo ?? 'ALCOLICO';
  readonly spedizione: any = this.data?.spedizione ?? null;

  readonly isUpdating = signal(false);
  readonly errore = signal<string | null>(null);
  readonly isSeller = computed(() => this.authServices.grant().isSeller);

  get isBox(): boolean {
    return this.tipo === 'BOX';
  }

  get isConsegnata(): boolean {
    return this.spedizione?.status?.id === STATUS_SPEDIZIONE.CONSEGNATO;
  }

  get canMarkAsDelivered(): boolean {
    return this.isSeller() && !this.isConsegnata;
  }

  get ordine(): any {
    if (!this.spedizione) return null;
    return this.isBox ? this.spedizione.ordBox : this.spedizione.ordine_alcolico;
  }

  get prodotto(): any {
    return this.isBox ? this.ordine?.box : this.ordine?.alcolico;
  }

  get prodottoLabel(): string {
    return this.isBox ? 'Box' : 'Alcolico';
  }

  customerName(cliente: any): string {
    if (!cliente) return 'Cliente sconosciuto';
    const utente = cliente.utente;
    const nome = [utente?.nome, utente?.cognome].filter(Boolean).join(' ');
    return nome || utente?.email || `Cliente #${cliente.id}`;
  }

  cantinaName(cantina: any): string {
    if (!cantina) return '—';
    return cantina.nome ?? cantina.ragione_sociale ?? `Cantina #${cantina.id}`;
  }

  ordineLabel(ordine: any): string {
    if (!ordine) return '—';
    return `#${ordine.id}`;
  }

  productName(prodotto: any): string {
    if (!prodotto) return '—';
    return prodotto.nome ?? `Prodotto #${prodotto.id}`;
  }

  segnaConsegnata(): void {
    if (!this.spedizione || this.isConsegnata || !this.isSeller()) return;

    this.isUpdating.set(true);
    this.errore.set(null);

    const richiesta = this.isBox
      ? this.spedizioniBoxService.updateStatus(this.spedizione.id, STATUS_SPEDIZIONE.CONSEGNATO)
      : this.spedizioniService.updateStatus(this.spedizione.id, STATUS_SPEDIZIONE.CONSEGNATO);

    richiesta.subscribe({
      next: (spedizioneAggiornata: any) => {
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