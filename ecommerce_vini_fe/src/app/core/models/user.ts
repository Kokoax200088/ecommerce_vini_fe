export interface User {
    nome: string;
    cognome: string;
//    email: string;
//    password: string;
    ruolo: string; //non integer?
    dataNascita: string; //date?
}

export interface Cliente extends User {
    indirizzo: string;
}

export interface Venditore extends User {
    partitaIva: string;
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