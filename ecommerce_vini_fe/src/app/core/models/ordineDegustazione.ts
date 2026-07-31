export interface ordineDegustazione {
  id: number;
  id_ordine: number;
  id_status: number;
  id_degustazione: number;
  id_cantina: number;
}

export interface ordineDegustazioneReq {
	data_ordine: string;
  ordineId: number;
	degustazioneId: number;
	statusId: number;
	cantinaId:number;
	quantita: number
}