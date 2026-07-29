import { AlcolicoModel } from "./alcolico";
import { Cantina } from "./cantina";

export interface Box{
    id:number;
    nome:string;
    sconto:DoubleRange; //it should be a percentage
    cantina: Cantina;
    listBoxAlcolico: BoxAlcolico[];
    //listImmagineBox
}

export interface BoxAlcolico{
    id:number;
    idBox: number; //or should I put a reference to the box?
    alcolico: AlcolicoModel;
    quantita: number; 
}