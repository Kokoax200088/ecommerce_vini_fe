export interface Ordine {
  id: number;
  data_ordine: string;
  totale: number;
  indirizzo_destinazione: string;  
  status: any;
  utente: any;
  listOrdineAlcolico: any[]; 
  listOrdineDegustazione: any[];   
  listOrdineBox: any[];   
}