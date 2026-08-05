import { ComponentType } from '@angular/cdk/overlay';
import { inject, Service } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Service()
export class UtilitiesServices {

    private dialog = inject(MatDialog)

    /**
    * chiamate generalizzato d'un dialog usando generics di Typescript
    * T = tipo del componente del dialog
    * D = tipo dei dati passati (data)
    * R = tipo del valore ritornato da afterClosed()
    */
    openDialog<T, D = any, R = any>(
        component: ComponentType<T>,
        data?: D,
        config?: MatDialogConfig<D>
    ): MatDialogRef<T, R> {

        const baseConfig: MatDialogConfig<D> = {
            width: '1100px',
            maxWidth: '90vw',
            height: 'auto',
            maxHeight: '200vh',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            panelClass: 'wide-dialog',
            data
        };

        return this.dialog.open<T, D, R>(component, {
            ...baseConfig,
            ...config   // per sovrascrivere qualcosa di specifico
        });
    }

    //funzione di conversione da datePicker a date nel nostro controller
    formatDateToDDMMYYYY(input: string | Date | null | undefined): string | null {
    if (!input) {
        return null;
    }

    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  readonly regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
}