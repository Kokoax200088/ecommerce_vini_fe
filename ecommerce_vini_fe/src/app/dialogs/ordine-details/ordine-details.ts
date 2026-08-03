import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-ordine-details',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, CurrencyPipe, DatePipe],
  templateUrl: './ordine-details.html',
  styleUrl: './ordine-details.css',
})
export class OrdineDetails {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OrdineDetails>);

  readonly ordine: any = this.data?.ordine ?? null;

  customerName(utente: any): string {
    if (!utente) return 'Cliente sconosciuto';
    const nome = [utente.nome, utente.cognome].filter(Boolean).join(' ');
    return nome || 'Cliente sconosciuto';
  }

  close(): void {
    this.dialogRef.close();
  }
}