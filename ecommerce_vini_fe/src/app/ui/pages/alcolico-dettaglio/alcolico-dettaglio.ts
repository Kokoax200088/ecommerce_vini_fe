import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AlcolicoModel } from '../../../core/models/alcolico';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { CantinaServices } from '../../../core/services/cantina-services';
import { UploadImageService } from '../../../core/services/uploadImage';
import { AuthServices } from '../../../core/services/auth-services';
import { AddRating } from "../../../components/add-rating/add-rating";
import { ViewRating } from "../../../components/view-rating/view-rating";

@Component({
  selector: 'app-alcolico-dettaglio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon, ViewRating, AddRating],
  templateUrl: './alcolico-dettaglio.html',
  styleUrl: './alcolico-dettaglio.css',
})
export class AlcolicoDettaglio implements OnInit {
  id: number = 0;
  alcolico = signal<AlcolicoModel | undefined>(undefined);
  immagineUrl = signal<string>('/image-alcolico.png');
  inModifica = signal<boolean>(false);
  msg = signal<string>('');

  idCantinaAlcolico = signal<number | undefined>(undefined);
  idCantina = signal<number | undefined>(undefined);
  quantita = signal<number | undefined>(undefined);
  private cdr = inject(ChangeDetectorRef);

  public readonly auth = inject(AuthServices);
  tipologie: any;
  colori: any;

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    annata: new FormControl<number | null>(null),
    gradazione: new FormControl<number | null>(null),
    prezzo: new FormControl<number | null>(null, Validators.required),
    provenienza: new FormControl(''),
    descrizione: new FormControl(''),
    idTipologia: new FormControl<number | null>(null, Validators.required),
    idColore: new FormControl<number | null>(null, Validators.required),
    quantita: new FormControl<number | null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private alcolicoService: AlcolicoServices,
    private cantinaService: CantinaServices,
    private uploadImageAlcolicoService: UploadImageService,
    private location: Location
  ) {
    this.tipologie = this.alcolicoService.tipologie;
    this.colori = this.alcolicoService.colori;
  }

  tornaIndietro(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaAlcolico();
    this.caricaGiacenza();
    this.alcolicoService.listTipologie();
    this.alcolicoService.listColori();
  }

  caricaAlcolico(): void {
    this.alcolicoService.getById(this.id).subscribe({
      next: (resp) => {
        this.alcolico.set(resp);
        this.caricaImmagine();
      },
      error: (err) => {
        console.error('Errore nel caricamento alcolico', err);
      }
    });
  }

  caricaGiacenza(): void {
    this.cantinaService.getCantinaAlcolicoByFilter(undefined, this.id).subscribe({
      next: (resp) => {
        const riga = resp?.[0];
        this.idCantinaAlcolico.set(riga?.id);
        this.idCantina.set(riga?.idCantina);
        this.quantita.set(riga?.quantita);
      },
      error: (err) => {
        console.error('Errore nel caricamento giacenza', err);
      }
    });
  }

 caricaImmagine(): void {
  this.uploadImageAlcolicoService.list<any>('alcolico', 'idAlcolico', this.id).subscribe({
    next: (immagini: any[]) => {
      const immagine = immagini?.[immagini.length - 1];
      this.immagineUrl.set(immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-alcolico.png');
      this.cdr.markForCheck();
    },
    error: () => {
      this.immagineUrl.set('/image-alcolico.png');
      this.cdr.markForCheck();
    }
  });
}

  apriModifica(): void {
    const a = this.alcolico();
    if (!a) return;

    this.form.patchValue({
      nome: a.nome,
      annata: a.annata,
      gradazione: a.gradazione,
      prezzo: a.prezzo,
      provenienza: a.provenienza,
      descrizione: a.descrizione,
      idTipologia: a.tipologiaAlcolico?.id ?? null,
      idColore: a.colore?.id ?? null,
      quantita: this.quantita() ?? null,
    });
    this.msg.set('');
    this.inModifica.set(true);
  }

  annullaModifica(): void {
    this.inModifica.set(false);
    this.msg.set('');
  }

  salva(): void {
    const a = this.alcolico();
    if (!a || this.form.invalid) {
      this.msg.set('Compila tutti i campi obbligatori.');
      return;
    }

    const v = this.form.value;
    const body = {
      id_alcolico: a.id,
      id_venditore: (a as any).id_venditore ?? a.idVenditore,
      nome: v.nome,
      annata: v.annata,
      id_tipologia_alcolico: v.idTipologia,
      id_colore: v.idColore,
      gradazione: v.gradazione,
      descrizione: v.descrizione,
      provenienza: v.provenienza,
      prezzo: v.prezzo,
      id_caratteristiche: a.caratteristiche?.map((c) => c.id) ?? [],
    };

    this.alcolicoService.update(body).subscribe({
      next: () => {
        this.salvaQuantita();
        this.caricaAlcolico();
        this.inModifica.set(false);
        this.msg.set('Modifiche salvate.');
      },
      error: (err) => {
        console.error('Errore nel salvataggio alcolico', err);
        this.msg.set('Errore nel salvataggio.');
      }
    });
  }

  salvaQuantita(): void {
    const idRiga = this.idCantinaAlcolico();
    const nuovaQuantita = this.form.value.quantita;
    if (idRiga == null || nuovaQuantita == null) return;

    this.cantinaService.updateCantinaAlcolico({
      id: idRiga,
      cantinaId: this.idCantina(),
      alcolicoId: this.id,
      quantita: nuovaQuantita,
    }).subscribe({
      next: () => {
        this.quantita.set(nuovaQuantita);
      },
      error: (err) => {
        console.error('Errore nel salvataggio quantita', err);
      }
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/image-alcolico.png';
  }


  reloadRating() {
  
        this.caricaAlcolico();
  }

  
}
