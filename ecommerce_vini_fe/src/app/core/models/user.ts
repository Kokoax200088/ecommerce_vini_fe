export interface User {
    id: number;
    nome: string;
    cognome: string;
//    email: string;
//    password: string;
    ruolo: string; //non integer?
    dataNascita: string; //date?

    //TEST per vedere se funziona loggedUSer
    indirizzo: string;
    partitaIva: string;
    idCarrello: number;
    clienteDTO: any;
    idVenditore: number;
}

export interface Cliente extends User {
    indirizzo: string;
    utente: any;
}

export interface Venditore extends User {
    partitaIva: string;
    utente: any;
}

export interface UserReq{
    nome: string;
    cognome: string;
    email: string;
    password: string;
    ruolo: number; //integer?
    dataNascita: string; //date?

    indirizzo: string;
    partitaIva: string;
}

export interface LoginReq{
    email: string;
    password: string;
}

export interface LoginDTO{
    accessToken: string,
    tokenType: string
}

export interface MeDTO{
    id: string,
    email: string, //dove lo prendiamo però?
    role: string,
//    mailValidate: string,
//    carrelloSize: number
}