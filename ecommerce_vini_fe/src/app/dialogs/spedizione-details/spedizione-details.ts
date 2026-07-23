import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpedizioneServices } from '../../core/services/spedizione-services';
// import { CantinaServices } from '../../services/cantina-services';
// import { ClienteServices } from '../../services/cliente-services';
// import { StatusServices } from '../../services/status-services';
// import { OrdineAlcolicoServices } from '../../services/ordine-alcolico-services';

@Component({
  selector: 'app-spedizione-details',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule],
  templateUrl: './spedizione-details.html',
  styleUrl: './spedizione-details.css',
})
export class SpedizioneDetails implements OnInit {

  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SpedizioneDetails>);
  private readonly spedizioneS = inject(SpedizioneServices);
  // private readonly cantinaS = inject(CantinaServices);
  // private readonly clienteS = inject(ClienteServices);
  // private readonly statusS = inject(StatusServices);
  // private readonly ordineAlcolicoS = inject(OrdineAlcolicoServices);

  mod: any = signal("");
  spedizione: any = signal<any>(null);
  readonly dialog = inject(MatDialog);

  // Liste per popolare le mat-select (per ora vuote, in attesa dei service reali)
  cantineList = signal<any[]>([]);
  clientiList = signal<any[]>([]);
  statusList = signal<any[]>([]);
  ordiniAlcoliciList = signal<any[]>([]);

  msg = signal("");

  updateForm: FormGroup = new FormGroup({
    corriere: new FormControl(null, Validators.required),
    codice_tracciamento: new FormControl(null, Validators.required),
    cantina: new FormControl(null, Validators.required),
    cliente: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    ordine_alcolico: new FormControl(null, Validators.required),
  })

  constructor() {
    if (this.data) {
      this.mod.set(this.data.mod);
      this.spedizione.set(this.data.spedizione);
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
    // this.ordineAlcolicoS.list().subscribe({
    //   next: ((r: any) => this.ordiniAlcoliciList.set(r)),
    //   error: ((r: any) => console.log(r.error.msg))
    // });

    if (this.mod() == 'U') {
      this.updateForm.patchValue({
        corriere: this.spedizione().corriere,
        codice_tracciamento: this.spedizione().codice_tracciamento,
        cantina: this.spedizione().cantina?.id,
        cliente: this.spedizione().cliente?.id,
        status: this.spedizione().status?.id,
        ordine_alcolico: this.spedizione().ordine_alcolico?.id,
      })
    }
  }

  onSubmit() {
    if (this.mod() == 'U') this.onUpdate();
    if (this.mod() == 'C') this.onCreate();
  }

  onCreate() {
    this.spedizioneS.create({
      corriere: this.updateForm.value.corriere,
      codice_tracciamento: this.updateForm.value.codice_tracciamento,
      cantina: this.updateForm.value.cantina,
      cliente: this.updateForm.value.cliente,
      status: this.updateForm.value.status,
      ordine_alcolico: this.updateForm.value.ordine_alcolico,
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
    const updateBody: any = { id: this.spedizione().id }
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
    if (this.updateForm.controls['ordine_alcolico'].dirty)
      updateBody.ordine_alcolico = this.updateForm.value.ordine_alcolico;

    this.spedizioneS.update(updateBody)
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