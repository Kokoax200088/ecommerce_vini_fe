import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-view-rating',
  imports: [MatIcon, MatCardModule],
  templateUrl: './view-rating.html',
  styleUrl: './view-rating.css',
})
export class ViewRating {
  @Input({ required: true }) nomeUtente!: string;
  @Input({ required: true }) cogmomeUtente!: string;
  @Input({ required: true }) valutazione!: number;
  @Input({ required: false }) commento?: string;


  readonly stelle = [1, 2, 3, 4, 5];
}
