import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBox } from '../../dialogs/add-box/add-box';
import { MatIconModule } from "@angular/material/icon";
import { BoxCantina } from '../box-cantina/box-cantina';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-add-box',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './card-add-box.html',
  styleUrl: './card-add-box.css',
})
export class CardAddBox {
@Input() idCantina!: number;

  constructor(private dialog:MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    //console.log("ID CANTINA PER FAVORE ADDBOX="+this.idCantina);
  }

  aggiungiBox() {
    console.log("AggiungiBox in CardAddBox");
    const dialogRef = this.dialog.open(AddBox, {
        width: '900px',
        height: '900px',
        data: {
          title: 'Inserisci nuovo box',
          idCantina: this.idCantina
          //message: `Sei sicuro di voler eliminare ${row.nome} ${row.cognome}?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Dialog chiuso con successo');
          this.router.navigate(['/box-cantina'], { queryParams: { refresh: true } });
        } else {
          console.log('Dialog chiuso senza successo');
        }
});
  }
}
