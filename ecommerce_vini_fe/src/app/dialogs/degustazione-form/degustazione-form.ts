import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DegustazioneServices } from '../../core/services/degustazione-services';
import { DegustazioneImmagine } from '../../components/degustazione-immagine/degustazione-immagine';

@Component({
  selector: 'app-degustazione-form',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, DegustazioneImmagine],
  templateUrl: './degustazione-form.html',
  styleUrl: './degustazione-form.css',
})
export class DegustazioneForm implements OnInit {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DegustazioneForm>);
  private readonly degustazioneService = inject(DegustazioneServices);

  msg = signal('');
  salvataggioInCorso = signal(false);
  idDegustazione = signal<number | undefined>(undefined);
  inModifica = signal(false);
  qualcosaSalvato = signal(false);

  form: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    prezzo: new FormControl(null, [Validators.required, Validators.min(0)]),
    dataInizio: new FormControl(null, Validators.required),
    dataFine: new FormControl(null, Validators.required),
    descrizione: new FormControl(null),
  }, { validators: (gruppo) => this.intervalloValido(gruppo) });

  private intervalloValido(gruppo: AbstractControl): ValidationErrors | null {
    const inizio = gruppo.get('dataInizio')?.value;
    const fine = gruppo.get('dataFine')?.value;

    if (!inizio || !fine) {
      return null;
    }

    return new Date(fine) > new Date(inizio) ? null : { intervallo: true };
  }

  get minInizio(): string {
    const ora = new Date();
    ora.setMinutes(ora.getMinutes() - ora.getTimezoneOffset());
    return ora.toISOString().substring(0, 16);
  }

  get minFine(): string {
    return this.form.value.dataInizio ?? this.minInizio;
  }

  get intervalloSbagliato(): boolean {
    return this.form.hasError('intervallo') && this.form.get('dataFine')!.touched;
  }

  ngOnInit(): void {
    const degustazione = this.data?.degustazione;

    if (degustazione?.id != null) {
      this.inModifica.set(true);
      this.idDegustazione.set(degustazione.id);
      this.form.patchValue({
        nome: degustazione.nome,
        prezzo: degustazione.prezzo,
        dataInizio: this.perInput(degustazione.dataInizio),
        dataFine: this.perInput(degustazione.dataFine),
        descrizione: degustazione.descrizione,
      });
    }
  }

  get nomeDegustazione(): string {
    return this.form.value.nome ?? '';
  }

  private perInput(valore: string | null | undefined): string | null {
    if (!valore) {
      return null;
    }

    return String(valore).substring(0, 16);
  }

  private perBackend(valore: string | null | undefined): string | null {
    if (!valore) {
      return null;
    }

    const d = new Date(valore);
    if (isNaN(d.getTime())) {
      return null;
    }

    const giorno = String(d.getDate()).padStart(2, '0');
    const mese = String(d.getMonth() + 1).padStart(2, '0');
    const anno = d.getFullYear();
    const ore = String(d.getHours()).padStart(2, '0');
    const minuti = String(d.getMinutes()).padStart(2, '0');
    const secondi = String(d.getSeconds()).padStart(2, '0');

    return `${giorno}/${mese}/${anno} ${ore}:${minuti}:${secondi}`;
  }

  salva(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg.set(this.form.hasError('intervallo')
        ? 'La data di fine deve essere successiva a quella di inizio.'
        : 'Compila tutti i campi obbligatori.');
      return;
    }

    const v = this.form.value;
    const dataInizio = this.perBackend(v.dataInizio);
    const dataFine = this.perBackend(v.dataFine);

    if (dataInizio == null || dataFine == null) {
      this.msg.set('Date non valide.');
      return;
    }

    this.msg.set('');
    this.salvataggioInCorso.set(true);

    const body: any = {
      nome: v.nome,
      descrizione: v.descrizione,
      prezzo: v.prezzo,
      dataInizio: dataInizio,
      dataFine: dataFine,
      cantinaId: this.data?.idCantina,
    };

    if (this.inModifica()) {
      body.id = this.idDegustazione();
      this.degustazioneService.update(body).subscribe({
        next: () => {
          this.qualcosaSalvato.set(true);
          this.salvataggioInCorso.set(false);
          this.chiudi();
        },
        error: (err) => this.fallito(err)
      });
      return;
    }

    this.degustazioneService.create(body).subscribe({
      next: (resp) => {
        this.salvataggioInCorso.set(false);
        this.qualcosaSalvato.set(true);

        if (resp?.id != null) {
          this.idDegustazione.set(resp.id);
          this.inModifica.set(true);
        }

        this.chiudi();
      },
      error: (err) => this.fallito(err)
    });
  }

  private fallito(err: any): void {
    console.error('Errore nel salvataggio degustazione', err);
    this.salvataggioInCorso.set(false);
    this.msg.set(err?.error?.msg ?? err?.error?.message ?? `Errore nel salvataggio (HTTP ${err?.status ?? '?'}).`);
  }

  chiudi(): void {
    this.dialogRef.close(this.qualcosaSalvato() ? { salvato: true, id: this.idDegustazione() } : false);
  }
}
