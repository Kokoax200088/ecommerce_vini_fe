export interface SpedizioneBox {
    id: number;
	corriere: String;
	codice_tracciamento: String;
/*	cantina: Cantina;
	cliente: Cliente;
	status: Status;
	ordBox: OrdineBox; */
    cantina: any;
    cliente: any;
    status: any;
    ordBox: any;
}

export interface SpedizioneBoxReq {
  corriere: string,
  codice_tracciamento: string,
  id_cantina: number,
  id_cliente: number,
  id_status: number,
  id_ordbox: number
}