import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-box',
  imports: [MatIcon, MatDialogContent, MatDialogActions],
  templateUrl: './delete-box.html',
  styleUrl: './delete-box.css',
})
export class DeleteBox {
  protected readonly data = inject<DeleteBox>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteBox>);
  message: string;
  idCantina: number;

  constructor(private routing: Router){
    this.message = this.data.message;
    this.idCantina = this.data.idCantina;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
    this.routing.navigate(['/cantina-dettaglio', this.idCantina],  { queryParams: { refresh: Date.now() }});
  }
}
