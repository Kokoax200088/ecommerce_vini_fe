import { AlcolicoModel } from "./alcolico";
import { ImmagineCantinaModel } from "./immagineCantina";

export interface CantinaALcolico{
    id:number;
    idCantina: number;
    alcolico: AlcolicoModel;
    quantita: number;
}


export interface CantinaDegustazione{
    id: number;
    nome: string;
    descrizione: string;
    prezzo: number;
    dataInizio: Date;
    dataFine: Date;
    idCantina: number;
    listAlcolici: AlcolicoModel[];
}

export interface Cantina {
    id: number;
    nome: string;
    idVenditore: number;
    posizione: string;
    descrizione:string;

    listCantinaAlcolico?: CantinaALcolico[];
    listRatingCantina?: any[];
    listBox?: any[];
    listDegustazione?: any[];
    immagineUrl: string;
    listImmagineCantina?: ImmagineCantinaModel[];
}