import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlcolicoModel } from '../../core/models/alcolico';
import { AlcolicoServices } from '../../core/services/alcolico-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { UtenteServices } from '../../core/services/utente-services';

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

  msg = signal('');
  salvataggioInCorso = signal(false);

  tipologie = this.alcolicoService.tipologie;
  colori = this.alcolicoService.colori;

  form: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    prezzo: new FormControl(null, Validators.required),
    quantita: new FormControl(0, Validators.required),
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
  }

  private idVenditore(): number | undefined {
    const utente: any = this.utenteService.loggedUtente();
    return utente?.venditoreDTO?.id ?? utente?.id;
  }

  salva(): void {
    const idVend = this.idVenditore();
    if (this.form.invalid || idVend == null) {
      this.msg.set('Compila tutti i campi obbligatori.');
      return;
    }

    const v = this.form.value;
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
      next: () => {
        this.collegaACantina(v.nome, v.quantita ?? 0);
      },
      error: (err) => {
        console.error('Errore nella creazione alcolico', err);
        this.msg.set('Errore nella creazione.');
        this.salvataggioInCorso.set(false);
      }
    });
  }

  private collegaACantina(nome: string, quantita: number): void {
    this.alcolicoService.getByNome(nome).subscribe({
      next: (resp: AlcolicoModel[]) => {
        const creato = resp?.reduce((a, b) => (a.id > b.id ? a : b));
        if (!creato) {
          this.chiudi(true);
          return;
        }
        this.cantinaService.createCantinaAlcolico({
          cantinaId: this.data?.idCantina,
          alcolicoId: creato.id,
          quantita: quantita,
        }).subscribe({
          next: () => this.chiudi(true),
          error: (err) => {
            console.error('Errore nel collegamento alla cantina', err);
            this.msg.set('Alcolico creato, ma non collegato alla cantina.');
            this.salvataggioInCorso.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Errore nel recupero alcolico creato', err);
        this.chiudi(true);
      }
    });
  }

  chiudi(creato: boolean): void {
    this.salvataggioInCorso.set(false);
    this.dialogRef.close(creato);
  }
}
