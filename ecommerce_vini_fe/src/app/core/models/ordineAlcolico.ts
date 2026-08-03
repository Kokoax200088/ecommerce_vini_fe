export interface ordineAlcolico{
    id: number;
	id_ordine: any;
	status: any;
	alcolico: any;
	cantina: any;
}

export interface ordineAlcolicoReq {
	data_ordine: string;
	ordineId: number;
	alcolicoId: number;
	statusId: number;
	cantinaId: number;
	quantita: number;
}