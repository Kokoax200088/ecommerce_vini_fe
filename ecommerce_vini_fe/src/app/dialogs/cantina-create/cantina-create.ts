import { Component, inject, OnInit, signal, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { CantinaServices } from '../../core/services/cantina-services';
import { UploadImageService } from '../../core/services/uploadImage';
import { AuthServices } from '../../core/services/auth-services';
import { NotificationServices } from '../../core/services/notification-services';
import { ImmagineCantinaModel } from '../../core/models/immagineCantina';

@Component({
  selector: 'app-cantina-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatDialogModule],
  templateUrl: './cantina-create.html',
  styleUrl: './cantina-create.css'
})
export class CantinaCreate implements OnInit {
  cantinaForm!: FormGroup;
  isEditMode = false;
  cantinaId: number | null = null;
  immagini = signal<ImmagineCantinaModel[]>([]);

  private fb = inject(FormBuilder);
  private cantinaService = inject(CantinaServices);
  private uploadImageService = inject(UploadImageService);
  private authService = inject(AuthServices); 
  private notifications = inject(NotificationServices);
  private cdr = inject(ChangeDetectorRef); 

  constructor(
    public dialogRef: MatDialogRef<CantinaCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  ngOnInit(): void {
    console.log("DATI RICEVUTI DAL DIALOGO:", this.data);

    this.cantinaForm = this.fb.group({
      nome: ['', Validators.required],
      posizione: ['', Validators.required],
      descrizione: ['']
    });

    if (this.data && this.data.id) {
      this.isEditMode = true;
      this.cantinaId = this.data.id;
      this.caricaDatiCantina();
      this.caricaImmagini();
    }
  }

  private caricaDatiCantina(): void {
    this.cantinaService.getById(this.cantinaId!).subscribe({
      next: (cantina: any) => {
        this.cantinaForm.patchValue(cantina);
      }
    });
  }

  private caricaImmagini(): void {
    if (!this.cantinaId) return;
    this.uploadImageService.list<ImmagineCantinaModel>('cantina', 'idCantina', this.cantinaId).subscribe({
      next: (imgs) => this.immagini.set(imgs)
    });
  }

  triggerFileInput(): void {
    document.getElementById('fileMultiplo')?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.cantinaId) return;

    Array.from(input.files).forEach(file => {
      this.uploadImageService.create('cantina', file, 'id_cantina', this.cantinaId!).subscribe({
        next: () => {
          this.notifications.success(`Immagine "${file.name}" salvata con successo!`);
          this.caricaImmagini();
        },
        error: (err: any) => {
          const errMsg = err.error?.msg || "Errore sconosciuto dal server";
          this.notifications.error(`Fallimento per "${file.name}": ${errMsg}`);
        }
      });
    });
    input.value = ''; 
  }

  eliminaImmagine(idImmagine: number): void {
    this.uploadImageService.delete('cantina', idImmagine).subscribe({
      next: () => {
        this.notifications.success("Immagine eliminata");
        this.caricaImmagini();
      }
    });
  }

  onSubmit(): void {
    if (this.cantinaForm.invalid) {
      this.cantinaForm.markAllAsTouched();
      return;
    }

    const venditoreLoggatoId = 1; 

    const requestPayload = { 
      ...this.cantinaForm.value,
      venditoreId: venditoreLoggatoId 
    };

    if (this.isEditMode) {
      requestPayload.id = this.cantinaId;
      this.cantinaService.update(requestPayload).subscribe({
        next: () => {
          this.notifications.success("Cantina aggiornata");
          this.dialogRef.close(true);
        }
      });
    } else {
      this.cantinaService.create(requestPayload).subscribe({
        next: (nuovaCantinaDaBackend: any) => {
          this.cantinaId = nuovaCantinaDaBackend.id; 
          this.isEditMode = true;
          
          this.notifications.success("Cantina creata! Ora puoi aggiungere le immagini.");
          this.caricaImmagini();
          this.cdr.detectChanges(); 
        },
        error: () => this.notifications.error("Errore durante la creazione della cantina")
      });
    }
  }
  
  onAnnulla(): void {
    this.dialogRef.close(!!this.cantinaId);
  }
}