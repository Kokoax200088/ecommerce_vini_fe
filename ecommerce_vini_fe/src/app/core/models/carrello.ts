import { AlcolicoModel } from "./alcolico";

export interface ProdottoAlcolico {
    id: number;
    id_carrello: number;
    id_alcolico: AlcolicoModel;
    id_cantina: number;
    quantità: number;
}

export interface ProdottoDegustazione {
    id: number;
    id_carrello: number;
    id_degustazione: any;
    id_cantina: number;
    quantità: number;
}

export interface ProdottoBox {
    id: number;
    idCarrello: number;
    box: any;
    idCantina: number;
    quantità: number;
}

export interface ProdottoBoxRequest{
    id: number;
    id_carrello: number;
    id_box: number;
    id_cantina: number;
    quantità: number;
}

export interface CarrelloModel {
id: number;
idCliente: number;
totale: number;
listaBox: any[];
listaDegustazione: any[];
listaProdotti: any[];
quantità: number;
}