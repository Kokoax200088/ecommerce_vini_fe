import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { UtenteServices } from '../../../core/services/utente-services';
import { TokenServices } from '../../../core/security/token-services';
import { Cliente, MeDTO } from '../../../core/models/user';
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  email = signal('');
  cliente: Cliente | undefined;

  constructor(
    private routing:Router, 
    private utenteService:UtenteServices,
    private authService:AuthServices,
    private tokenService:TokenServices
    ){}

  ngOnInit(): void {
    // set the signal value from token service
    this.tokenService.me().subscribe({
      next: (resp:MeDTO) => {
        const userId = this.authService.grant().userId;
        if (userId) {
          this.email.set(userId);
          this.initCliente(userId);
          console.log("nome=" + (this.cliente?.nome ?? 'undefined'));
        }
      },
      error: (resp:any) => {
        console.log("errore in init profile" + resp);
      }
    });
  }

  initCliente(email: string) { //FIXME da rivedere tutta questa parte
    // assume list returns an Observable<Cliente[]> or Observable<Cliente>
    const result: any = this.utenteService.list(undefined, undefined, email, undefined, undefined);
    if (result && typeof result.subscribe === 'function') {
      result.subscribe({
        next: (res: any) => {
          if (Array.isArray(res)) {
            this.cliente = res.length ? res[0] : undefined; // prende solo il primo result, email è univoca anyways
          } else {
            this.cliente = res as Cliente;
          }
        },
        error: (err: any) => console.log('errore initCliente', err)
      });
    } else if (result) {
      // synchronous return
      this.cliente = result as Cliente;
      console.log("INIT nome=" + this.cliente.nome);
    }
  }

}
