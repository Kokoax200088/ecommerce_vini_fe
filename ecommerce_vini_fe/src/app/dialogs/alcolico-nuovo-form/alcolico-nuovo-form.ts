import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlcolicoServices } from '../../core/services/alcolico-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { UtenteServices } from '../../core/services/utente-services';
import { AuthServices } from '../../core/services/auth-services';

@Component({
  selector: 'app-alcolico-nuovo-form',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './alcolico-nuovo-form.html',
  styleUrl: './alcolico-nuovo-form.css',
})
export class AlcolicoNuovoForm implements OnInit {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AlcolicoNuovoForm>);
  private readonly alcolicoService = inject(AlcolicoServices);
  private readonly cantinaService = inject(CantinaServices);
  private readonly utenteService = inject(UtenteServices);
  private readonly auth = inject(AuthServices);

  msg = signal('');
  salvataggioInCorso = signal(false);
  nuovaTipologia = signal(false);
  nuovoColore = signal(false);

  tipologie = this.alcolicoService.tipologie;
  colori = this.alcolicoService.colori;

  nomeNuovaTipologia = new FormControl('');
  nomeNuovoColore = new FormControl('');

  form: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    prezzo: new FormControl(null, [Validators.required, Validators.min(0)]),
    quantita: new FormControl(null, [Validators.required, Validators.min(0)]),
    annata: new FormControl(null),
    gradazione: new FormControl(null),
    idTipologia: new FormControl(null, Validators.required),
    idColore: new FormControl(null, Validators.required),
    provenienza: new FormControl(null),
    descrizione: new FormControl(null),
  });

  ngOnInit(): void {
    this.alcolicoService.listTipologie();
    this.alcolicoService.listColori();

    if (this.utenteService.loggedUtente() == null) {
      const userId = this.auth.grant()?.userId ?? undefined;
      this.utenteService.findLoggedInfos(userId);
    }
  }

  private idVenditore(): number | undefined {
    const utente: any = this.utenteService.loggedUtente();
    return utente?.venditoreDTO?.id;
  }

  apriNuovaTipologia(): void {
    this.nomeNuovaTipologia.setValue('');
    this.nuovaTipologia.set(true);
  }

  annullaNuovaTipologia(): void {
    this.nuovaTipologia.set(false);
  }

  salvaNuovaTipologia(): void {
    const nome = (this.nomeNuovaTipologia.value ?? '').trim();
    if (!nome) {
      return;
    }

    this.alcolicoService.createTipologia(nome).subscribe({
      next: (elenco) => {
        const creata = elenco.find((t) => t.nome === nome);
        if (creata) {
          this.form.patchValue({ idTipologia: creata.id });
        }
        this.nuovaTipologia.set(false);
      },
      error: (err) => {
        console.error('Errore nella creazione tipologia', err);
        this.msg.set('Errore nella creazione della tipologia.');
      }
    });
  }

  apriNuovoColore(): void {
    this.nomeNuovoColore.setValue('');
    this.nuovoColore.set(true);
  }

  annullaNuovoColore(): void {
    this.nuovoColore.set(false);
  }

  salvaNuovoColore(): void {
    const nome = (this.nomeNuovoColore.value ?? '').trim();
    if (!nome) {
      return;
    }

    this.alcolicoService.createColore(nome).subscribe({
      next: (elenco) => {
        const creato = elenco.find((c) => c.nome === nome);
        if (creato) {
          this.form.patchValue({ idColore: creato.id });
        }
        this.nuovoColore.set(false);
      },
      error: (err) => {
        console.error('Errore nella creazione colore', err);
        this.msg.set('Errore nella creazione del colore.');
      }
    });
  }

  salva(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg.set('Compila tutti i campi obbligatori.');
      return;
    }

    const idVend = this.idVenditore();
    if (idVend == null) {
      this.msg.set('Profilo venditore non disponibile, esci e rientra.');
      return;
    }

    const v = this.form.value;
    this.msg.set('');
    this.salvataggioInCorso.set(true);

    this.alcolicoService.create({
      id_venditore: idVend,
      nome: v.nome,
      annata: v.annata,
      id_tipologia_alcolico: v.idTipologia,
      id_colore: v.idColore,
      gradazione: v.gradazione,
      descrizione: v.descrizione,
      provenienza: v.provenienza,
      prezzo: v.prezzo,
      id_caratteristiche: [],
    }).subscribe({
      next: (resp) => {
        this.collegaACantina(resp?.id, v.quantita);
      },
      error: (err) => {
        console.error('Errore nella creazione alcolico', err);
        this.msg.set('Errore nella creazione.');
        this.salvataggioInCorso.set(false);
      }
    });
  }

  private collegaACantina(idAlcolico: number | undefined, quantita: number): void {
    if (idAlcolico == null) {
      this.msg.set('Alcolico creato, ma non collegato alla cantina.');
      this.salvataggioInCorso.set(false);
      return;
    }

    this.cantinaService.createCantinaAlcolico({
      cantinaId: this.data?.idCantina,
      alcolicoId: idAlcolico,
      quantita: quantita,
    }).subscribe({
      next: () => this.chiudi(true),
      error: (err) => {
        console.error('Errore nel collegamento alla cantina', err);
        this.msg.set('Alcolico creato, ma non collegato alla cantina.');
        this.salvataggioInCorso.set(false);
      }
    });
  }

  chiudi(creato: boolean): void {
    this.salvataggioInCorso.set(false);
    this.dialogRef.close(creato);
  }
}
