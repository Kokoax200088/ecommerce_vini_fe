import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from "./components/sidebar/side-nav/side-nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideNav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce_vini_fe');
}
