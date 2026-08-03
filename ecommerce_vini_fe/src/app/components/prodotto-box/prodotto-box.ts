import { Component, inject, Input, OnInit } from '@angular/core';
import { CardBox } from '../card-box/card-box';
import { CarrelloService } from '../../core/services/carrello-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { BoxAlcolico } from '../../core/models/box';

@Component({
  selector: 'app-prodotto-box',
  imports: [CardBox],
  templateUrl: './prodotto-box.html',
  styleUrl: './prodotto-box.css',
})
export class ProdottoBox implements OnInit {
  @Input() listProdottoBox!: any[];
  @Input() idCart!: number;

  private carrelloService = inject(CarrelloService);
  private cantinaService = inject(CantinaServices);

  constructor() {}

  ngOnInit() {}

  rimuoviPezzo(item: any): void {
    console.debug('rimuoviPezzo item:', item);

    const quantitaAttuale: number = item?.quantità ?? item?.quantita ?? 0;

    if (quantitaAttuale <= 0) return;

    const quantitaNuova = quantitaAttuale - 1;

    // ---- 1) Aggiorna carrello (listProdottoBox) ----
    const rigaId = item?.id;
    if (rigaId == null) return;

    if (quantitaNuova === 0) {
      this.listProdottoBox = this.listProdottoBox.filter((x: any) => x.id !== rigaId);
    } else {
      this.listProdottoBox = this.listProdottoBox.map((x: any) => {
        if (x.id !== rigaId) return x;

        return {
          ...x,
          quantità: quantitaNuova,
          quantita: quantitaNuova,
        };
      });
    }

    // ---- 2) Aggiorna stock cantina-alcolico ----
    const cantinaId = item?.cantina?.id;
    if (cantinaId == null) return;

    const listBoxAlc = item?.box?.listBoxAlcolico;
    if (!Array.isArray(listBoxAlc) || listBoxAlc.length === 0) return;

    for (const boxAlc of listBoxAlc) {
      const alcolicoId = boxAlc?.alcolico?.id;
      const quantitaPerBox: number = boxAlc?.quantita ?? 0;

      if (alcolicoId == null) continue;
      if (quantitaPerBox <= 0) continue;

      const delta = quantitaPerBox;

      this.cantinaService.getCantinaAlcolicoByFilter(cantinaId, alcolicoId).subscribe({
        next: (resp: any) => {
          const row = Array.isArray(resp) ? resp[0] : resp;
          if (!row) return;

          const nuovaQuantita = (row.quantita ?? 0) + delta;

          const { alcolico: _alcolico, ...rowWithoutAlcolico } = row;

          this.cantinaService
            .updateCantinaAlcolico({
              ...rowWithoutAlcolico,
              cantinaId: cantinaId,
              alcolicoId: alcolicoId,
              quantita: nuovaQuantita,
            })
            .subscribe({
              next: () => {
                console.debug('Stock aggiornato', {
                  cantinaId,
                  alcolicoId,
                  delta,
                  nuovaQuantita,
                });
              },
              error: (err) => console.error('Update stock fallito', err),
            });
        },
        error: (err) => console.error('Get CantinaAlcolico fallito', err),
      });
    }

    const updateBody: any = {
      id: item.id,
      id_carrello: this.idCart, //FIXME perchè undefined?
      id_box: item.box?.id ?? item?.id_box,
      id_cantina: item.cantina?.id ?? item?.id_cantina,
      quantità: quantitaNuova,
    };
    console.log("ID CARRELLO: " + this.idCart);
    if (this.idCart == null) return;
    if (quantitaNuova === 0) {
      this.carrelloService.deleteProdottoBox(item.id).subscribe({
        next: () => this.carrelloService.getCartById(this.idCart).subscribe(),
        error: (err:any) => console.error('deleteProdottoBox fallito', err),
      });
    } else {
      this.carrelloService.updateProdottoBox(updateBody).subscribe({
        next: () => this.carrelloService.getCartById(this.idCart).subscribe(),
        error: (err) => console.error('updateProdottoBox fallito', err),
      });
    }
  }
}
