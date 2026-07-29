import { AlcolicoModel } from "./alcolico";

export interface ProdottoAlcolico {
    id: number;
    idCarrello: number;
    alcolico: AlcolicoModel;
    idCantina: number;
    quantità: number;
}

export interface ProdottoDegustazione {
    id: number;
    idCarrello: number;
    degustazione: any;
    idCantina: number;
    quantità: number;
}

export interface ProdottoBox {
    id: number;
    idCarrello: number;
    box: any;
    idCantina: number;
    quantità: number;
}

export interface CarrelloModel {
id: number;
idCliente: number;
totale: number;
listaBox: ProdottoBox[];
listaDegustazione: ProdottoDegustazione[];
listaProdotti: ProdottoAlcolico[];
quantità: number;
}