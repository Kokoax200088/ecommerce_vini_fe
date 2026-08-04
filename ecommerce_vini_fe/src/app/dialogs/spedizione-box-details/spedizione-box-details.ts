import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpedizioneBoxServices } from '../../core/services/spedizione-box-services';
import { SpedizioneBox } from '../../core/models/spedizione-box';
// import { CantinaServices } from '../../services/cantina-services';
// import { ClienteServices } from '../../services/cliente-services';
// import { StatusServices } from '../../services/status-services';
// import { OrdineBoxServices } from '../../services/ordine-box-services';

@Component({
  selector: 'app-spedizione-box-details',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule],
  templateUrl: './spedizione-box-details.html',
  styleUrl: './spedizione-box-details.css',
})
export class SpedizioneBoxDetails implements OnInit {

  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SpedizioneBoxDetails>);
  private readonly spedizioneBoxS = inject(SpedizioneBoxServices);
  // private readonly cantinaS = inject(CantinaServices);
  // private readonly clienteS = inject(ClienteServices);
  // private readonly statusS = inject(StatusServices);
  // private readonly ordineBoxS = inject(OrdineBoxServices);

  mod: any = signal("");
  spedizionebox = signal<SpedizioneBox | null>(null);
  readonly dialog = inject(MatDialog);

  // Liste per popolare le mat-select (per ora vuote, in attesa dei service reali)
  cantineList = signal<any[]>([]);
  clientiList = signal<any[]>([]);
  statusList = signal<any[]>([]);
  ordiniBoxList = signal<any[]>([]);

  msg = signal("");

  updateForm: FormGroup = new FormGroup({
    corriere: new FormControl(null, Validators.required),
    codice_tracciamento: new FormControl(null, Validators.required),
    cantina: new FormControl(null, Validators.required),
    cliente: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    ordine_box: new FormControl(null, Validators.required),
  })

  constructor() {
    if (this.data) {
      this.mod.set(this.data.mod);
      this.spedizionebox.set(this.data.spedizione);
    }
  }

  ngOnInit(): void {
    // da scommentare quando disponibili
    // this.cantinaS.list().subscribe({
    //   next: ((r: any) => this.cantineList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });
    // this.clienteS.list().subscribe({
    //   next: ((r: any) => this.clientiList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });
    // this.statusS.list().subscribe({
    //   next: ((r: any) => this.statusList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });
    // this.ordineBoxS.list().subscribe({
    //   next: ((r: any) => this.ordiniBoxList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });

    if (this.mod() == 'U') {
      this.updateForm.patchValue({
        corriere: this.spedizionebox()!.corriere,
        codice_tracciamento: this.spedizionebox()!.codice_tracciamento,
        cantina: this.spedizionebox()!.cantina?.id,
        cliente: this.spedizionebox()!.cliente?.id,
        status: this.spedizionebox()!.status?.id,
        ordine_box: this.spedizionebox()!.ordBox?.id,
      })
    }
  }

  onSubmit() {
    if (this.mod() == 'U') this.onUpdate();
    if (this.mod() == 'C') this.onCreate();
  }

  onCreate() {
    this.spedizioneBoxS.create({
      corriere: this.updateForm.value.corriere,
      codice_tracciamento: this.updateForm.value.codice_tracciamento,
      cantina: this.updateForm.value.cantina,
      cliente: this.updateForm.value.cliente,
      status: this.updateForm.value.status,
      ordBox: this.updateForm.value.ordine_box,
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
    const updateBody: any = { id: this.spedizionebox()!.id }
    if (this.updateForm.controls['corriere'].dirty)
      updateBody.corriere = this.updateForm.value.corriere;
    if (this.updateForm.controls['codice_tracciamento'].dirty)
      updateBody.codice_tracciamento = this.updateForm.value.codice_tracciamento;
    if (this.updateForm.controls['cantina'].dirty)
      updateBody.cantina = this.updateForm.value.cantina;
    if (this.updateForm.controls['cliente'].dirty)
      updateBody.cliente = this.updateForm.value.cliente;
    if (this.updateForm.controls['status'].dirty)
      updateBody.status = this.updateForm.value.status;
    if (this.updateForm.controls['ordine_box'].dirty)
      updateBody.ordBox = this.updateForm.value.ordine_box;

    this.spedizioneBoxS.update(updateBody)
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