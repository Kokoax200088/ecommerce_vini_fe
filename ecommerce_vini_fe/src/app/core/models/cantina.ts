import { ImmagineCantinaModel } from "./immagineCantina";

export interface Cantina {
    id: number;
    nome: string;
    idVenditore: number;
    posizione: string;

    listCantinaAlcolico?: any[];
    listRatingCantina?: any[];
    listBox?: any[];
    listDegustazione?: any[];
    immagineUrl: string;
    listImmagineCantina?: ImmagineCantinaModel[];
}