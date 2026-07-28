import { Component, Input } from '@angular/core';
import { CantinaALcolico } from '../../core/models/cantina';
import { CantinaServices } from '../../core/services/cantina-services';
import { CardAlcolico } from "../card-alcolico/card-alcolico";

@Component({
  selector: 'app-alcolici-cantina',
  imports: [CardAlcolico],
  templateUrl: './alcolici-cantina.html',
  styleUrl: './alcolici-cantina.css',
})
export class AlcoliciCantina {
  @Input() idCantina!: number;
  listCantinaALcolico: any;

  constructor(private cantinaService: CantinaServices) {
    this.listCantinaALcolico = this.cantinaService.alcolici;
  }

   ngOnInit(): void {
    this.cantinaService.listAlcolici(this.idCantina);
  }
  

}
