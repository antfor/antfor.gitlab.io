import {FORMULA, EstimatorFactory} from "./estimators/estimator.mjs"

const maxReps = 20;
const minPercantage = 0.5;
const estimatorFactory = new EstimatorFactory;

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


export function calcOneRepMax(weight:number, reps:number, increment:number=5, formula:FORMULA=FORMULA.BRZYCKI):Result{
    if(1>weight){
        throw new Error("Minimum weight is 1kg");
    }
    if(1>reps){
        throw new Error("Minimum number of reps is 1");
    }
     if(maxReps<reps){
        throw new Error("Maximum number of reps is 20");
    }

    const estimator = estimatorFactory.estimator(formula);

    const orm = estimator.orm(weight,reps);
    const weights = getWeights(orm, increment);
    const per = getPercentage(orm, weights);
    const repRange = getRepRange(orm, weights, estimator.maxRep);
    const pr = minPr(orm, weights, repRange, estimator.orm);

    return {orm:orm, percantage:per, weight:weights, reps:repRange, minPRs:pr};
}

function getWeights(orm:number, inc:number):number[]{

    if(inc <= 0){ //just give standard percentages in this case
        const maxPercantage = 0.95;
        const gap = 0.05;
        const len = 1 + (maxPercantage*100 - minPercantage*100)/(gap*100);
        return Array.from({length: len}, (_,i) => (maxPercantage-gap*i)*orm);
    }

    const max = Math.floor(orm/inc);
    const min = Math.round(minPercantage*orm/inc)
    const len = max-min+1;
    return Array.from({length: len}, (_,i) => inc * (max-i));
}

function getPercentage(orm:number, weights:number[]):number[]{
    return weights.map((w)=>(w*100/orm)+0);
}
function getRepRange(orm:number, weights:number[], maxRep:(w:number, r:number) => number):number[]{
    return weights.map((w) => maxRep(orm, w));
}

function minPr(orm:number, ws:number[], rs:number[], ormEst:(w:number, r:number) => number):PR[]{

    const len = Math.min(ws.length,rs.length);
    const PRs = Array.from({length: len}, (_,i) =>({weight:ws[i], reps:rs[i]+1, orm:ormEst(ws[i], rs[i]+1)}));

    const result = PRs.map((pr) =>({ ...pr, dif: pr.orm-orm }));
    const filter = result.filter((v)=>v.reps<maxReps);
    const sorted = filter.sort((a: { dif: number; }, b: { dif: number; }) => a.dif - b.dif);

    return sorted;
}