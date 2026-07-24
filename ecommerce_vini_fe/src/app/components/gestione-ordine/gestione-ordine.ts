import { Component, inject, OnInit } from '@angular/core';
import { OrdiniServices } from '../../core/services/ordini-services';
import {MatListModule} from '@angular/material/list';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-gestione-ordine',
  imports: [MatListModule, CurrencyPipe],
  templateUrl: './gestione-ordine.html',
  styleUrl: './gestione-ordine.css',
})
export class GestioneOrdine implements OnInit{
    private readonly ordiniService = inject(OrdiniServices);
    readonly ordini = this.ordiniService.ordini;
    ngOnInit(): void {
      this.ordiniService.list();
    }
}