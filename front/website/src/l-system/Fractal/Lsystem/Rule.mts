import {State} from './State.mts';

//pred
export type value = number | number[];
type predElem = string | value;
export type pred = string | predElem[];

//succ
export type valuFunction = ((val:value) => pred)
type succElem = pred | undefined | valuFunction;
export type succ = succElem | succElem[];

//func
export type func = ((state:State, val?:value) => void);


export class Rule {
  public readonly pred: pred;
  public readonly succ: succ;
  public readonly func: func;
  public readonly valuFunction: boolean;

    public constructor(pred:pred, succ:succ, func:func, val = false) {
      this.pred = pred;
      this.succ = succ;
      this.func = func;
      this.valuFunction = val;
    }
  
}