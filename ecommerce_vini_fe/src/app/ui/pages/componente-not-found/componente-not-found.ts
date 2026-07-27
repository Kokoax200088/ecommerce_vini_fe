import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-componente-not-found',
  imports: [RouterLink, MatIconModule],
  templateUrl: './componente-not-found.html',
  styleUrl: './componente-not-found.css',
})
export class ComponenteNotFound {}
