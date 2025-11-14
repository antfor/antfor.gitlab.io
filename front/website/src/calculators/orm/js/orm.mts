
const maxReps = 20;
const minPercantage = 0.5;

type PR = {
    weight:number,
    reps:number,
    orm:number,
    dif:number,
}

export type Result = {
    orm: number,
    percantage: number[],
    weight: number[],
    reps: number[],
    minPRs:PR[],
};

export type Nothing = {
    msg:string;
}

export type Weights={
    dumbels:number[],
    barbel:number,
    ezbar:number,
    plates: number[],
};

//todo increment by 5 works fine for bench, ez bar, so maybe only dumbels
const defaultWeights:Weights = {
    dumbels: [6,8,10,12.5,15],
    barbel: 20,
    ezbar: 10,
    plates: [2.5,10,15,20],
};

export type Settings = {
    increment: number,
    dumbel: boolean, 
    barbel: boolean, 
    ezbar: boolean, 
    plates: boolean,
    formula: FORMULA,
};

export enum FORMULA {
    EPLEY,
    BRZYCKI,
}

const defaultSettings = {
    increment: 5,
    dumbel: true, 
    barbel: true, 
    ezbar: true, 
    plates: true,
    formula: FORMULA.EPLEY,
}



export function calcOneRepMaxWithIncrement(weight:number, reps:number, settings:Settings=defaultSettings):Result{
    //if(reps>maxReps)
        //return {msg:"Maximum number of reps is 20"};
    //if(1>reps)
        //return {msg:"Minimum number of reps is 1"};

    const orm = oneRepMax(weight,reps, settings.formula);
    const weights = getWeightsIncrement(orm, settings.increment);
    const per = getPercentage(orm, weights);
    const repRange = getMaxReps(orm, weights, settings.formula);
    const pr = minPr(orm, weights, repRange, settings.formula);

    return {orm:orm, percantage:per, weight:weights, reps:repRange, minPRs:pr};
}

export function calcOneRepMaxWithWeight(weight:number, reps:number, equipment:Weights=defaultWeights, settings:Settings=defaultSettings):Result{
    //if(reps>maxReps)
        //return {msg:"Maximum number of reps is 20"};
    //if(1>reps)
        //return {msg:"Minimum number of reps is 1"};

    const orm = oneRepMax(weight,reps, settings.formula);
    const weights = getWeights(orm, equipment, settings);
    const per = getPercentage(orm, weights);
    const repRange = getMaxReps(orm, weights, settings.formula);
    const pr = minPr(orm, weights, repRange, settings.formula);

    return {orm:orm, percantage:per, weight:weights, reps:repRange, minPRs:pr};
}

function oneRepMax(weight:number, reps:number, formula:FORMULA):number{

    switch (formula) {
        case FORMULA.BRZYCKI: return BrzyckiORM(weight, reps);
        case FORMULA.EPLEY: return EpleyORM(weight, reps);
        default: return EpleyORM(weight, reps);
    } 
}

function EpleyORM(w:number, r:number){
    if(r == 1)
        return w;
    return w * (1 + r/30);
}

function BrzyckiORM(w:number, r:number){
    return w * 36/(37-r);
}


function getWeights(orm:number, weights:Weights, settings:Settings=defaultSettings):number[]{
    //todo
    if(settings.barbel)
        return [weights.barbel, weights.ezbar];

    return [orm]
}

function getWeightsIncrement(orm:number, inc:number):number[]{

    const max = Math.floor(orm/inc);
    const min = Math.round(minPercantage*orm/inc)
    const len = max-min+1;
    return Array.from({length: len}, (_,i) => inc * (max-i));
}


function round(n:number, d=0){
    const pow = 10**d;
    return Math.round(n * pow) / pow;
}

function getPercentage(orm:number, weights:number[]):number[]{
    return weights.map((w)=>round(w/orm,2)+0);
}

function getMaxReps(orm:number, weights:number[], formula:FORMULA):number[]{
    
    let maxRepFun;
    switch(formula){
        case FORMULA.BRZYCKI: maxRepFun = BrzyckiMaxRep; break;
        case FORMULA.EPLEY: maxRepFun = EpleyMaxRep; break;
        default: maxRepFun = EpleyMaxRep; break;
    }

    return weights.map((w) => maxRepFun(orm, w));   
}

function EpleyMaxRep(orm:number, w:number):number{

    const reps = (orm/(w)-1)*30;
    if(reps<=1)
        return 1;

   
    const eps = 0.0001;
    console.log(reps+eps);
    return Math.floor(reps+eps);
}

function BrzyckiMaxRep(orm:number, w:number):number{
   
    const reps = 37 - w * 36 / orm;
    const eps = 0.0001;
    return Math.floor(reps+eps);
}



function minPr(orm:number, ws:number[], rs:number[], formula:FORMULA):PR[]{

    const len = Math.min(ws.length,rs.length);
   
    let ormFun: (w:number, r:number) => number;
    switch(formula){
        case FORMULA.BRZYCKI: ormFun = BrzyckiORM; break;
        case FORMULA.EPLEY: ormFun = EpleyORM; break;
        default: ormFun = EpleyORM; break;
    }

    const PRs = Array.from({length: len}, (_,i) =>({weight:ws[i], reps:rs[i]+1, orm:ormFun(ws[i], rs[i]+1)}));
    const result = PRs.map((pr) =>({ ...pr, dif: pr.orm-orm }));
    const filter = result.filter((v)=>v.reps<maxReps);
    const sorted = filter.sort((a: { dif: number; }, b: { dif: number; }) => a.dif - b.dif);

    return sorted;

}