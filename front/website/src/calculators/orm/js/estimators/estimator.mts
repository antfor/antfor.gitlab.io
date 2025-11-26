


export enum FORMULA {
    EPLEY,
    BRZYCKI,
}

export interface OrmEstimator {
  readonly orm: (w:number,r:number)=>number;
  readonly maxRep: (w:number,r:number)=>number;
  readonly formula: FORMULA; 
};

export class EstimatorFactory{

    estimator(id:FORMULA){
        switch(id){
            case FORMULA.BRZYCKI: return brzyckiEst;
            case FORMULA.EPLEY: return epleyEst;
            default: return brzyckiEst;
        }
    }

    brzycki(){return brzyckiEst;};
    epley(){return epleyEst;};
}

//--Brzycki---------------------------
//todo add max reps
const brzyckiEst:OrmEstimator = {
    orm: BrzyckiORM,
    maxRep: BrzyckiMaxRep,
    formula: FORMULA.BRZYCKI,
};

function BrzyckiORM(w:number, r:number){
    return w * 36/(37-r);
}

function BrzyckiMaxRep(orm:number, w:number):number{
   
    const reps = 37 - w * 36 / orm;
    const eps = 0.0001;
    return Math.floor(reps+eps);
}



//--EPLEY---------------------------

const epleyEst:OrmEstimator = {
    orm: EpleyORM,
    maxRep: EpleyMaxRep,
    formula: FORMULA.EPLEY,
};

function EpleyORM(w:number, r:number){
    if(r == 1)
        return w;
    return w * (1 + r/30);
}


function EpleyMaxRep(orm:number, w:number):number{

    const reps = (orm/(w)-1)*30;
    if(reps<=1)
        return 1;

   
    const eps = 0.0001;
    return Math.floor(reps+eps);
}

