import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

export interface AlcolicoEliminaDialogData {
  message: string;
}

@Component({
  selector: 'app-alcolico-elimina-conferma',
  imports: [MatDialogContent, MatDialogActions, MatIcon, MatButtonModule],
  templateUrl: './alcolico-elimina-conferma.html',
  styleUrl: './alcolico-elimina-conferma.css',
})
export class AlcolicoEliminaConferma {
  protected readonly data = inject<AlcolicoEliminaDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AlcolicoEliminaConferma>);

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
