export interface spedizioneBox {
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