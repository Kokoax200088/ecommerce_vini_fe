import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpedizioneServices } from '../../core/services/spedizione-alcolico-services';
import { SpedizioneAlcolicoReq } from '../../core/models/spedizione-alcolico';
import { STATUS_SPEDIZIONE } from '../../core/models/status';
@Component({
  selector: 'app-ordine-details',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './ordine-details.html',
  styleUrl: './ordine-details.css',
})
export class OrdineDetails {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OrdineDetails>);
  private readonly spedizioniService = inject(SpedizioneServices);

  readonly ordine: any = this.data?.ordine ?? null;

  readonly showSpedizioneForm = signal(false);
  readonly isSubmitting = signal(false);
  readonly errore = signal<string | null>(null);

  corriere = '';
  codiceTracciamento = '';

  get prodotti(): { nome: string; quantita: number }[] {
    if (!this.ordine) return [];

    // Nomi campo come restituiti realmente da OrdineDTO (backend)
    const righeAlcolico: any[] = this.ordine.ordineAlcolico ?? [];
    const righeBox: any[] = this.ordine.ordineBox ?? [];
    const righeDegustazione: any[] = this.ordine.ordineDeg ?? [];

    const daAlcolico = righeAlcolico.map((riga: any) => ({
      nome: riga.alcolico?.nome ?? `Alcolico #${riga.alcolico?.id ?? riga.id}`,
      quantita: riga.quantita ?? 1,
    }));

    const daBox = righeBox.map((riga: any) => ({
      nome: riga.box?.nome ?? `Box #${riga.box?.id ?? riga.id}`,
      quantita: riga.quantita ?? 1,
    }));

    // OrdineDegustazioneDTO espone solo id_degustazione: Integer (nessun
    // oggetto DegustazioneDTO popolato), quindi non è disponibile un nome.
    const daDegustazione = righeDegustazione.map((riga: any) => ({
      nome: `Degustazione #${riga.id_degustazione}`,
      quantita: riga.quantita ?? 1,
    }));

    return [...daAlcolico, ...daBox, ...daDegustazione];
  }

  customerName(utente: any): string {
    if (!utente) return 'Cliente sconosciuto';
    const nome = [utente.nome, utente.cognome].filter(Boolean).join(' ');
    return nome || 'Cliente sconosciuto';
  }

  apriFormSpedizione(): void {
    this.errore.set(null);
    this.showSpedizioneForm.set(true);
  }

  annullaSpedizione(): void {
    this.showSpedizioneForm.set(false);
    this.corriere = '';
    this.codiceTracciamento = '';
    this.errore.set(null);
  }

confermaSpedizione(): void {
    if (!this.ordine) return;

    if (!this.corriere.trim() || !this.codiceTracciamento.trim()) {
      this.errore.set('Inserisci corriere e codice di tracciamento.');
      return;
    }

    const righeOrdine: any[] = this.ordine.ordineAlcolico ?? [];
    const idOrdineAlcolico = righeOrdine[0]?.id;
    const idCantina = righeOrdine[0]?.cantina?.id;
    const idCliente = this.ordine.utente?.id;
    const idStatus = STATUS_SPEDIZIONE.IN_PREPARAZIONE;

    if (!idOrdineAlcolico || !idCantina || !idCliente) {
      this.errore.set('Dati ordine incompleti: impossibile creare la spedizione (riga ordine, cantina o cliente mancante).');
      return;
    }

    this.isSubmitting.set(true);
    this.errore.set(null);

    const payload: SpedizioneAlcolicoReq = {
      id_ordine_alcolico: idOrdineAlcolico,
      id_cliente: idCliente,
      id_cantina: idCantina,
      id_status: idStatus,
      corriere: this.corriere.trim(),
      codice_tracciamento: this.codiceTracciamento.trim(),
    };

    this.spedizioniService.create(payload).subscribe({
      next: (spedizione) => {
        this.isSubmitting.set(false);
        this.dialogRef.close({ converted: true, ordineId: this.ordine.id, spedizione });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errore.set('Errore durante la creazione della spedizione. Riprova.');
        console.error(err);
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}