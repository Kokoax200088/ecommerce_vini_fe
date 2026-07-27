import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrdiniServices } from '../../core/services/ordini-services';

@Component({
  selector: 'app-ordine-details',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule],
  templateUrl: './ordine-details.html',
  styleUrl: './ordine-details.css',
})
export class OrdineDetails implements OnInit{
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OrdineDetails>);
  private readonly ordineS = inject(OrdiniServices);

  mod: any = signal("");
  ordine: any = signal<any>(null);
  readonly dialog = inject(MatDialog);

  ordiniAlcoliciList = signal<any[]>([]);

  msg = signal("");

  updateForm: FormGroup = new FormGroup({
    data_ordine: new FormControl(null, Validators.required),
    totale: new FormControl(null, Validators.required),
    indirizzo_destinazione: new FormControl(null, Validators.required),
    utente: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
  })

  constructor() {
    if (this.data) {
      this.mod.set(this.data.mod);
      this.ordine.set(this.data.ordine);
    }
  }

  ngOnInit(): void {
    // da scommentare quando disponibili
    // this.ordineAlcolicoS.list().subscribe({
    //   next: ((r: any) => this.ordiniAlcoliciList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });

    if (this.mod() == 'U') {
      this.updateForm.patchValue({
        data_ordine: this.ordine().data_ordine,
        totale: this.ordine().totale,
        indirizzo_destinazione: this.ordine().indirizzo_destinazione,
        utente: this.ordine().utente,
        status: this.ordine().status,
      })
    }
  }
    onSubmit() {
    if (this.mod() == 'U') this.onUpdate();
    if (this.mod() == 'C') this.onCreate();
  }

  onCreate() {
    this.ordineS.create({
      data_ordine: this.updateForm.value.data_ordine,
      totale: this.updateForm.value.totale,
      indirizzo_destinazione: this.updateForm.value.indirizzo_destinazione,
      utente: this.updateForm.value.utente,
      status: this.updateForm.value.status,
    }).subscribe({
      next: ((r: any) => {
        this.dialogRef.close()
      }),
      error: ((r: any) => {
        this.msg.set(r.error.msg)
      })
    })
  }

  onUpdate() {
    const updateBody: any = { id: this.ordine().id }
    if (this.updateForm.controls['data_ordine'].dirty)
      updateBody.data_ordine = this.updateForm.value.data_ordine;
    if (this.updateForm.controls['totale'].dirty)
      updateBody.totale = this.updateForm.value.totale;
    if (this.updateForm.controls['indirizzo_destinazione'].dirty)
      updateBody.indirizzo_destinazione = this.updateForm.value.indirizzo_destinazione;
    if (this.updateForm.controls['utente'].dirty)
      updateBody.utente = this.updateForm.value.utente;
    if (this.updateForm.controls['status'].dirty)
      updateBody.status = this.updateForm.value.status;

    this.ordineS.update(updateBody)
      .subscribe({
        next: ((r: any) => {
          this.dialogRef.close()
        }),
        error: ((r: any) => {
          this.msg.set(r.error.msg)
        })
      })
  }

  remove() {
  }
}