import { Component, Inject, inject, Input, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogActions } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlcoliciCantina } from "../../components/alcolici-cantina/alcolici-cantina";
import { CantinaServices } from '../../core/services/cantina-services';
import { AlcolicoModel } from '../../core/models/alcolico';
import { CantinaALcolico } from '../../core/models/cantina';
import { MatList, MatListItem } from "@angular/material/list";
import { BoxAlcolico } from '../../core/models/box';
import { BoxAlcolicoServices } from '../../core/services/box-alcolico-services';
import { BoxServices } from '../../core/services/box-services';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-box',
  imports: [MatIcon, MatDialogContent, MatFormField, MatLabel, MatFormFieldModule, MatInputModule, MatSelectModule, MatList, MatListItem, FormsModule, ReactiveFormsModule],
  templateUrl: './add-box.html',
  styleUrl: './add-box.css',
})
export class AddBox implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AddBox>);
  listAlcolici = signal<CantinaALcolico[]>([]);
  selectedAlcolicoId: number | null = null;

  createBoxForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    sconto: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)])
  })

  listAlcoliciBox = signal<BoxAlcolico[]>([]); //lista degli alcolici aggiunti al box
  selectedQty = 1;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { title: string, idCantina:number },
      private cantinaService: CantinaServices,
      private boxService: BoxServices,
      private boxAlcolicoService: BoxAlcolicoServices
      ) {}

      ngOnInit(){
        console.log("OnInit idCantina=" + this.data.idCantina);

        this.cantinaService.getCantinaAlcolicoByFilter(this.data.idCantina, null).subscribe({
          next: (resp: CantinaALcolico[]) => {
            this.listAlcolici.set(resp);
            console.log(this.listAlcolici());
          },
          error: (resp) => {
            console.error("Errore in addBox", resp);
          }
        });
      }

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }

  get alcoliciBoxCount(): number {
    return this.listAlcoliciBox().length;
  }

  get selectedAlcolico(): CantinaALcolico | null {
    if (this.selectedAlcolicoId == null) return null;
    return this.listAlcolici().find(x => x.id === this.selectedAlcolicoId) ?? null;
  }

  
  setQtyFromInput(qty: number) {
    this.selectedQty = Math.max(1, Math.floor(qty || 1));
  }

    addOrUpdateSelectedInBox(): void {
    const sel = this.selectedAlcolico;
    if (!sel || this.selectedAlcolicoId == null) return;

    const qtyToAdd = this.selectedQty;

    const alcolicoKey = sel.alcolico.id ?? sel.id;

    this.listAlcoliciBox.update(prev => {
      const idx = prev.findIndex(x => x.alcolico.id === alcolicoKey);

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantita: copy[idx].quantita + qtyToAdd };
        return copy;
      }

      // build the entry (idBox non disponibile ancora)
      const newEntry: BoxAlcolico = {
        id: 0, 
        idBox: 0, //this.data.idBox //purtroppo bisogna settarlo dopo
        alcolico: sel.alcolico,
        quantita: qtyToAdd,
        available: false,
        numberAvailable: 0
      };

      return [...prev, newEntry];
    });
  }

   removeFromBox(alcolicoId: number) {
    this.listAlcoliciBox.update(prev => prev.filter(x => x.alcolico.id !== alcolicoId));
  }

  OnSubmit(){
    //metto questo passaggio intermedio perchè potrebbe essere necessario per la modifica
    this.createBox(this.createBoxForm);
    this.close()
  }

  createBox(form: FormGroup){
    console.log("Creating a box with name: " + form.value.nome);
    this.boxService.create({
      nome: form.value.nome,
      cantinaId: this.data.idCantina,
      sconto: form.value.sconto
    }).subscribe({
      next: (resp: any) => {
        console.log(resp);
        const idCreated = resp?.id;
        console.log("Box created with id: " + idCreated);
        const contents =  this.listAlcoliciBox().map(x => ({
          id: 0,
          boxId: idCreated as number,
          alcolicoId: x.alcolico.id as number,
          quantita: x.quantita as number,
        }));

        contents.forEach(item => {
          console.log(JSON.stringify(item));
          this.boxAlcolicoService.create(item).subscribe({
            next: (r) => console.log('BoxAlcolico created', r),
            error: (err) => console.error('BoxAlcolico create failed', err)
          });
        })
      },
      error: (resp) => {
        console.error("Errore creazione box", resp);
      }
    })
  }
}
