import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { UploadImageService } from '../../core/services/uploadImage';

@Component({
  selector: 'app-upload-image',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule],
  templateUrl: './upload-image.html',
  styleUrl: './upload-image.css',
})
export class UploadImage {

  private readonly dialog = inject(MatDialog);
  private uploadServices = inject(UploadImageService);
  private dialogRef = inject(MatDialogRef<UploadImage>);
  private readonly data = inject(MAT_DIALOG_DATA);

  // dati passati dal componente chiamante: { entity: 'box'|'degustazione'|'cantina'|'alcolico', idParamName: 'id_box'|..., id: number, imageUrl?: string }
  entity: string = '';
  idParamName: string = '';
  itemId!: number;

  imageUrl = signal<string | null>(null);
  msg = signal('');

  fileName: string = '';
  selectedFile: File | null = null;

  titolo = signal<string>('');

  constructor() {
    if (this.data) {
      this.entity = this.data.entity;
      this.idParamName = this.data.idParamName;
      this.itemId = this.data.id;
      this.titolo.set(this.data.titolo ?? 'elemento');
    }
  }

  ngOnInit(): void {
    if (this.data?.imageUrl != null) {
      this.imageUrl.set(this.data.imageUrl);
    }
  }

  onAnnulla(): void {
    this.dialogRef.close(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.fileName = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = input.files[0];
    this.fileName = this.selectedFile.name;
    this.msg.set('');

    const reader = new FileReader();
    reader.onload = () => this.imageUrl.set(reader.result as string);
    reader.readAsDataURL(this.selectedFile);
  }

  onUpload() {
    if (!this.selectedFile) {
      this.msg.set('Scegli prima un\'immagine.');
      return;
    }

    this.uploadServices.create(this.entity, this.selectedFile, this.idParamName, this.itemId)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (r: any) => {
          console.log(r.error?.msg);
          this.msg.set(r.error?.msg ?? 'Errore upload');
        }
      });
  }


  //COSA DEVO METTERE PER CHIAMARE IL DIALOG?
  /**this.dialog.open(UploadImage, {
  data: {
    entity: 'alcolico',
    idParamName: 'id_alcolico',
    id: alcolico.id,
    titolo: `${alcolico.nome}`,
    imageUrl: alcolico.image
  }
});**/
}