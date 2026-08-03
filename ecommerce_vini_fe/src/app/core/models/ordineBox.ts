export interface ordineBox {
    id: number,
	ordine: any,
	status: any,
	box: any,
	cantina: any,
}

export interface ordineBoxReq {
	data_ordine: string;
	ordineId: number;
	boxId: number;
	statusId: number;
	cantinaId: number;
	quantita: number;
}