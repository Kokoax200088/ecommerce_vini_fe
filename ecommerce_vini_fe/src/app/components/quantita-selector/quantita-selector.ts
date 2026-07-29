import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-quantita-selector',
  imports: [CommonModule],
  templateUrl: './quantita-selector.html',
  styleUrl: './quantita-selector.css',
})
export class QuantitaSelector {
  @Input() quantitaMassima!: number; //numero scorta disponibile
  @Output() aggiungiCarrello = new EventEmitter<number>();

  count = signal(0);

  incrementa(): void {
    if (this.count() < this.quantitaMassima) {
      this.count.update(v => v + 1);
    }
  }

  decrementa(): void {
    if (this.count() > 0) {
      this.count.update(v => v - 1);
    }
  }

  onAggiungiCarrello(): void {
    if (this.count() > 0) {
      this.aggiungiCarrello.emit(this.count());
       this.count.set(0);
    }
  }
}
