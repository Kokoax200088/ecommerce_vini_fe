import { Component, inject, OnInit } from '@angular/core';
import { OrdiniServices } from '../../core/services/ordini-services';
@Component({
  selector: 'app-gestione-ordine',
  imports: [],
  templateUrl: './gestione-ordine.html',
  styleUrl: './gestione-ordine.css',
})
export class GestioneOrdine implements OnInit{
    private readonly ordiniService = inject(OrdiniServices);

    ngOnInit(): void {
      this.ordiniService.list();
    }
}