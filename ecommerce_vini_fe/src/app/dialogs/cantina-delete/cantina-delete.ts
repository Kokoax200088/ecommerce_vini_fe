import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CantinaServices } from '../../core/services/cantina-services';

@Component({
  selector: 'app-cantina-delete',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './cantina-delete.html',
  styleUrl: './cantina-delete.css'
})
export class CantinaDelete {
  public data = inject<{ idCantina: number, message: string }>(MAT_DIALOG_DATA); 
  private dialogRef = inject(MatDialogRef<CantinaDelete>);
  
  private cantinaService = inject(CantinaServices);
  private router = inject(Router);

  close(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.cantinaService.delete(this.data.idCantina).subscribe({
      next: () => {
        this.dialogRef.close(true); 
        this.router.navigate(['/home']); 
      },
      error: (err: any) => {
        console.error('Errore durante l\'eliminazione della cantina', err);
      }
    });
  }
}