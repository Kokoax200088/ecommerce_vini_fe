export interface TipologiaAlcolico {
  id: number;
  nome: string;
}

export interface Colore {
  id: number;
  nome: string;
}

export interface Caratteristica {
  id: number;
  nome: string;
}

export interface AlcolicoModel {
  id: number;
  idVenditore: number;
  nome: string;
  annata: number;
  tipologiaAlcolico: TipologiaAlcolico;
  colore: Colore;
  gradazione: number;
  descrizione: string;
  provenienza: string;
  prezzo: number;
  immagineUrl: string;
  caratteristiche: Caratteristica[];
}