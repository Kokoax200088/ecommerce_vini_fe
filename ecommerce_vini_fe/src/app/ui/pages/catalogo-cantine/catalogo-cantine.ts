import { Component, inject, OnInit, effect } from '@angular/core';
import { CantinaServices } from '../../../core/services/cantina-services';
import { CardCantina } from "../../../components/card-cantina/card-cantina";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { MatDialog } from '@angular/material/dialog';
import { AuthServices } from '../../../core/services/auth-services';
import { CantinaCreate } from '../../../dialogs/cantina-create/cantina-create';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-catalogo-cantine',
  standalone: true,
  imports: [CardCantina, SearchBar, MatIconModule],
  templateUrl: './catalogo-cantine.html',
  styleUrl: './catalogo-cantine.css',
})
export class CatalogoCantine implements OnInit {
  cantine: any;
  isVenditore = false;
  isVistaFiltrata = false;

  private dialog = inject(MatDialog);
  private authService = inject(AuthServices);
  private route = inject(ActivatedRoute);
  private utenteService = inject(UtenteServices);

  constructor(private cantinaService: CantinaServices) {
    this.cantine = this.cantinaService.cantine;

    effect(() => {
      const userData = this.authService.grant();
      const utente = this.utenteService.loggedUtente();

      if (this.isVistaFiltrata) {
        if (utente) {
          const idReale = (utente as any)?.venditoreDTO?.id || utente.id;
          console.log("[Catalogo] Dati utente pronti! Filtro per ID Venditore:", idReale);
          this.cantinaService.list(undefined, idReale);
        } else if (userData?.userId) {
          console.log("[Catalogo] Sessione ripristinata, chiedo i dati completi per:", userData.userId);
          this.utenteService.findLoggedInfos(userData.userId);
        }
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['filtro'] === 'mie') {
        this.isVistaFiltrata = true;
      } else {
        this.isVistaFiltrata = false;
        console.log("[Catalogo] Vista completa, scarico tutte le cantine.");
        this.cantinaService.list();
      }
    });
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
        if (this.isVistaFiltrata && this.utenteService.loggedUtente()) {
            const utente = this.utenteService.loggedUtente();
            const idReale = (utente as any)?.venditoreDTO?.id || utente?.id;
            this.cantinaService.list(undefined, idReale);
        } else {
            this.cantinaService.list(); 
        }
      }
    }); 
  }

  get isSeller(): boolean {
    return this.authService.grant().isSeller;
  }
}