import {toNumber, parseFloatSafe, formatValue, isNaNoE} from '../utils/parse.mts';
import {Interval} from '../utils/intrest.mts';



export type intrestSettings ={
    intrest: Value, 
    startMoney: Value,
    monthlySaving: Value,
    time: Value,
    Interval: Interval,
}

export type breakdownSettings ={
    intrestBreakdown: boolean,
    intrestOnIntrestBreakdown: boolean,
    accBreakdown: boolean,
}

export function defultIntrestSettings():intrestSettings {
    return {
        intrest: new Value("7", 20, 0, 0.1, Any, 0.01),
        startMoney: new Value("5000", 10000, 0, 100, Any),
        monthlySaving: new Value("100", 10000, 0, 100, Any),
        time: new Value("20", 30, 0, 1, 100),
        Interval: Interval.Year,
    };
}

export function defultBreakdownSettings():breakdownSettings {
    return {
        intrestBreakdown: false,
        intrestOnIntrestBreakdown: false,
        accBreakdown: false,
    };
}

type setter<T> = React.Dispatch<React.SetStateAction<T>>
type key<T> = keyof T
type value = (string|Interval)
export function updateIntrestSettings(setSettings:setter<intrestSettings>, key:key<intrestSettings>, value:value){

    if(key == "Interval"){
        setSettings(prev => ({...prev, Interval: value as Interval }));
    }else{
        setSettings(prev => ({...prev, [key]: prev[key].setValue(value as string) }));
    }     
}

export function updateBreakdownSettings(setSettings:setter<breakdownSettings>, key:key<breakdownSettings>, value:boolean){
    setSettings(prev => ({...prev, [key]: value }));
}



const Any = "any";
type NoA = number |  typeof Any;

export class Value{
    
    readonly #value: string;
    readonly defult: number;
  
    readonly minCoarseControl: number;
    readonly maxCoarseControl: number;
    readonly step: number;
    
    readonly maxFineControl: NoA;
    readonly stepFineControl: number;
  
    constructor(value: string, max: number, min: number, step:number, max2:NoA=max, step2:number=step, defult: number =0){
        this.#value = value;
        this.defult = defult;
        this.minCoarseControl = min;
        this.maxCoarseControl = max;
        this.step = step;
        this.maxFineControl = max2;
        this.stepFineControl = step2;
    }
  
    getValue(){
        return this.#value;
    }
  
    getNumber(){
        return this.#getValid(parseFloatSafe(this.#value, this.defult));
    }
    
    getFormatValue(decimals:number){
        return formatValue(this.#value, decimals);
    }
  
    #getValid(n:number){
        if(n < this.minCoarseControl){
            return this.minCoarseControl;
        }else if(this.maxFineControl === Any){
            return n;
        }else if(n > this.maxFineControl){
            return this.maxFineControl;
        }else{
            return n;
        }
    }

    setValue(e:string){
        let n = toNumber(e);
        if(!isNaNoE(n) && this.maxFineControl !== Any){
           if(parseFloat(n)>this.maxFineControl){
                n = this.maxFineControl.toString();
           }else if(parseFloat(n)<this.minCoarseControl){
                n = this.minCoarseControl.toString();
           }
        }
        return new Value(n, this.maxCoarseControl, this.minCoarseControl, this.step, this.maxFineControl, this.stepFineControl, this.defult);
    }
}