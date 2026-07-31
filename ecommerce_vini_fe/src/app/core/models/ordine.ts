export interface Ordine {
  id: number;
  data_ordine: string;
  totale: number;
  indirizzoDestinazione: string;  
  id_status: any;
  id_utente: any;
  listOrdineAlcolico: any[];       
}