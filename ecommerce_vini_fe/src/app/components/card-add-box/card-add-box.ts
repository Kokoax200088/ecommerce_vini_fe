import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBox } from '../../dialogs/add-box/add-box';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-card-add-box',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './card-add-box.html',
  styleUrl: './card-add-box.css',
})
export class CardAddBox {
@Input() idCantina!: number;

  constructor(private dialog:MatDialog) {
  }

  ngOnInit(): void {
    console.log("ID CANTINA PER FAVORE ADDBOX="+this.idCantina);
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
  }
}
