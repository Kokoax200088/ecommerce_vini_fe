export interface spedizioneAlcolico {
    id: number;
	corriere: string;
	codice_tracciamento: string;
	cantina: any;
	cliente: any;
	status: any;
	ordine_alcolico: any;
}

export interface SpedizioneAlcolicoReq {
  id?: number;
  corriere: string;
  codice_tracciamento: string;
  id_cantina: number;
  id_status: number;
  id_ordine_alcolico: number;
}