import { AlcolicoModel } from "./alcolico";

export interface ProdottoAlcolico {
    id: number;
    idCarrello: number;
    alcolico: AlcolicoModel;
    idCantina: number;
    quantita: number;
}

export interface ProdottoDegustazione {
    id: number;
    idCarrello: number;
    degustazione: any;
    idCantina: number;
    quantita: number;
}

export interface ProdottoBox {
    id: number;
    idCarrello: number;
    box: any;
    idCantina: number;
    quantita: number;
}

export interface CarrelloModel {
id: number;
idCliente: number;
totale: number;
listaProdotti: ProdottoAlcolico[];
listaDegustazione: ProdottoDegustazione[];
listaBox: ProdottoBox[];
quantita: number;
}