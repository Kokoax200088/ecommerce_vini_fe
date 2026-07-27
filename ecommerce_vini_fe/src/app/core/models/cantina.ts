import { AlcolicoModel } from "./alcolico";
import { ImmagineCantinaModel } from "./immagineCantina";

export interface CantinaALcolico{
    alcolico: AlcolicoModel;
    id:number;
    idCantina: number;
    quantita: number;
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