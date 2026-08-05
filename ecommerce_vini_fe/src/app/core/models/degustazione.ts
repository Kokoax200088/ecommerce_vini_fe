export interface Degustazione {
    id: number;
    nome: string;
    descrizione: string;
    prezzo: number;
    dataInizio: string;
    dataFine: string;
    id_cantina: number;
    alcolici: any[];
    immagini: any[];
}