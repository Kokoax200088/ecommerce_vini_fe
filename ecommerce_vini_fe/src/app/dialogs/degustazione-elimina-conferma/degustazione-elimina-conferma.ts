import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

export interface DegustazioneEliminaDialogData {
  message: string;
}

@Component({
  selector: 'app-degustazione-elimina-conferma',
  imports: [MatDialogContent, MatDialogActions, MatIcon, MatButtonModule],
  templateUrl: './degustazione-elimina-conferma.html',
  styleUrl: './degustazione-elimina-conferma.css',
})
export class DegustazioneEliminaConferma {
  protected readonly data = inject<DegustazioneEliminaDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DegustazioneEliminaConferma>);

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
