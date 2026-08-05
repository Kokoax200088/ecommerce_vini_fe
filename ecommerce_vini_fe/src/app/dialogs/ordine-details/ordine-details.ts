import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpedizioneServices } from '../../core/services/spedizione-alcolico-services';
import { SpedizioneAlcolicoReq } from '../../core/models/spedizione-alcolico';
import { STATUS_ORDINE, STATUS_SPEDIZIONE } from '../../core/models/status';
import { SpedizioneBoxReq } from '../../core/models/spedizione-box';
import { SpedizioneBoxServices } from '../../core/services/spedizione-box-services';
import { AuthServices } from '../../core/services/auth-services';
import { NotificationServices } from '../../core/services/notification-services';
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
  private readonly spedizioniBoxService = inject(SpedizioneBoxServices);
  private readonly authServices = inject(AuthServices);
  private readonly notification = inject(NotificationServices);

  readonly ordine: any = this.data?.ordine ?? null;

  readonly showSpedizioneForm = signal(false);
  readonly isSubmitting = signal(false);
  readonly errore = signal<string | null>(null);
  readonly isSeller = computed(() => this.authServices.grant().isSeller);
  corriere = '';
  codiceTracciamento = '';

  get isConsegnata(): boolean {
    return this.ordine?.status?.id === STATUS_ORDINE.FINITO;
  }

  get canMarkAsDelivered(): boolean {
    return this.isSeller() && !this.isConsegnata;
  }
  get prodotti(): { nome: string; quantita: number }[] {
    if (!this.ordine) return [];

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
    const righeOrdineBox: any[] = this.ordine.ordineBox ?? [];

    const hasAlcolico = righeOrdine.length > 0;
    const hasBox = righeOrdineBox.length > 0;

    if (!hasAlcolico && !hasBox) {
      this.errore.set('Nessun prodotto alcolico o box presente in questo ordine: impossibile creare una spedizione.');
      return;
    }

    const idStatus = STATUS_SPEDIZIONE.IN_CORSO;
    const corriere = this.corriere.trim();
    const codiceTracciamento = this.codiceTracciamento.trim();

    const payloadsAlcolico: SpedizioneAlcolicoReq[] = [];
    if (hasAlcolico) {
      for (const riga of righeOrdine) {
        const idOrdineAlcolico = riga?.id;
        const idCantina = riga?.cantina?.id;

        if (!idOrdineAlcolico || !idCantina) {
          this.errore.set('Dati ordine incompleti: impossibile creare la spedizione alcolico (riga ordine o cantina mancante).');
          return;
        }

        const payloadAlcolico: SpedizioneAlcolicoReq = {
          id_ordine_alcolico: idOrdineAlcolico,
          id_cantina: idCantina,
          id_status: idStatus,
          corriere,
          codice_tracciamento: codiceTracciamento,
        };

        const unita = riga?.quantita ?? 1;
        for (let i = 0; i < unita; i++) {
          payloadsAlcolico.push({ ...payloadAlcolico });
        }
      }
    }

    const payloadsBox: SpedizioneBoxReq[] = [];
    if (hasBox) {
      for (const item of righeOrdineBox) {
        const itemCantinaId: number = item.box?.id_cantina;
        const itemOrdineBoxId: number = item.id;

        if (!itemCantinaId || !itemOrdineBoxId) {
          this.errore.set('Dati ordine incompleti: impossibile creare la spedizione box (cantina o riga ordine mancante).');
          return;
        }

        const payloadBox: SpedizioneBoxReq = {
          corriere,
          codice_tracciamento: codiceTracciamento,
          id_cantina: itemCantinaId,
          id_status: idStatus,
          id_ordbox: itemOrdineBoxId,
        };

        const unita = item?.quantita ?? 1;
        for (let i = 0; i < unita; i++) {
          payloadsBox.push({ ...payloadBox });
        }
      }
    }

    this.isSubmitting.set(true);
    this.errore.set(null);

    const richieste: Observable<any>[] = [];
    payloadsAlcolico.forEach((payloadAlcolico) => richieste.push(this.spedizioniService.create(payloadAlcolico)));
    payloadsBox.forEach((payloadBox) => richieste.push(this.spedizioniBoxService.create(payloadBox)));

    forkJoin(richieste).subscribe({
      next: (spedizioni) => {
        this.isSubmitting.set(false);
        this.dialogRef.close({ converted: true, ordineId: this.ordine.id, spedizioni });
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