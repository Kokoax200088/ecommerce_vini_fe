import { Component,inject, OnInit } from '@angular/core';
import { CantinaServices } from '../../../core/services/cantina-services';
import { CardCantina } from "../../../components/card-cantina/card-cantina";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { MatDialog } from '@angular/material/dialog';
import { AuthServices } from '../../../core/services/auth-services';
import { CantinaCreate } from '../../../dialogs/cantina-create/cantina-create';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-catalogo-cantine',
  imports: [CardCantina, SearchBar,MatIconModule],
  templateUrl: './catalogo-cantine.html',
  styleUrl: './catalogo-cantine.css',
})
export class CatalogoCantine implements OnInit {
  cantine: any;
  isVenditore = false;

  private dialog = inject(MatDialog);
  private authService = inject(AuthServices);

  constructor(private cantinaService: CantinaServices) {
    this.cantine = this.cantinaService.cantine;
  }

  ngOnInit(): void {
    this.cantinaService.list();

    const userData = this.authService.grant();
    if (userData.isSeller) {
      this.isVenditore = true;
    }
  }

  onSearch(query: string): void {
    this.cantinaService.list(query);
  }
  
  apriNuovaCantina(): void {
    const dialogRef = this.dialog.open(CantinaCreate, {
      width: '80%',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(risultato => {
      if (risultato === true) {
        this.cantinaService.list(); 
      }
    }); 

  }

  get isSeller(): boolean {
  return this.authService.grant().isSeller;
}
}