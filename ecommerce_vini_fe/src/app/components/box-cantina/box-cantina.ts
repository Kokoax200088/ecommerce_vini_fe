import { Component, Input } from '@angular/core';
import { BoxServices } from '../../core/services/box-services';

@Component({
  selector: 'app-box-cantina',
  imports: [],
  templateUrl: './box-cantina.html',
  styleUrl: './box-cantina.css',
})
export class BoxCantina {
  @Input() idCantina!:number;
  listBoxCantina: any;

  constructor(private boxService:BoxServices){
    //this.listBoxCantina = this.boxService
  }

  ngOnInit(): void{
    //qui dovrei inizializzare la lista dei box in base all'id cantina
  }

}
