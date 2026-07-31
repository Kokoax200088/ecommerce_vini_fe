import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

export interface DeleteUserDialogData {
  message: string;
}

@Component({
  selector: 'app-delete-user',
  imports: [MatDialogContent, MatDialogActions, MatIcon, MatButtonModule],
  templateUrl: './delete-user.html',
  styleUrl: './delete-user.css',
})
export class DeleteUser {
  protected readonly data = inject<DeleteUserDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteUser>);

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
