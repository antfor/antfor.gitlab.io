
enum CompoundRate {
    Annually= 1,
    Semiannually= 2,
    Quarterly= 4,
    Monthly= 12,
} 

enum Interval {
    Year= 1,
    HalfYear= 2,
    Quarter= 4,
    Month= 12,
}

function toCrIntrest(r:number, cr:number){
        r = r/100.0;
        return ((1 + r)**(1.0/cr) - 1);
}


function totalSavings(P:number, M:number, r:number, CRpI:number, i:number){
    
    const TS = Array(i + 1).fill(0);

    return (TS.map((_, t)=> M * ((1+r)**(t*CRpI)-1)/r + P*(1+r)**(t*CRpI)));
}

function intrestOnPrincipal(P:number, r:number, CRpI:number, i:number){

    const RP = Array(i + 1).fill(0);

    return(RP.map((_, t)=> P * r * (t*CRpI)));
}

function intrestOnintrestPrincipal(P:number, r:number, CRpI:number, i:number){

    const RRP = Array(i + 1).fill(0);

    return(RRP.map((_, t)=> P*(1+r)**(t*CRpI) - P - (P * r * (t*CRpI)) ));
}


function intrestOnMontly(M:number, r:number, CRpI:number, i:number){

    const RM = Array(i + 1).fill(0);

    return(RM.map((_,t)=> M*r*(t*CRpI)*(t*CRpI-1)*0.5)); // t-1
}

function intrestOnintrestMontly(M:number, r:number, CRpI:number, MpI:number, i:number){

    const RRM = Array(i + 1).fill(0);

    return(RRM.map((_,t)=> M * ((1+r)**(t*CRpI)-1)/r - MpI * t - (M*r*(t*CRpI)*(t*CRpI-1)*0.5) )); 
}

class Savings{
    accPrincipel: number[] = [];
    accMonthly: number[] = [];
    totalAcc: number[] = [];
    totalSavings: number[] = [];
    totalIntrest: number[] = [];
    intrestPrincipel: number[] = [];
    intrestMonthly: number[] = [];
    intrestIntrest: number[] = [];
    intrestIntrestPrincipal: number[] = [];
    intrestIntrestMonthly: number[] = [];
}

/*
    P: Principal
    M: Monthly saving /mån
    r: intrest        /year
    t: time
    cr: compound rate
*/
function calcSavings(P:number,M:number,r:number,i:number,IpY=Interval.Year,CRpY=CompoundRate.Monthly):Savings{

    const CRpI = CRpY * 1.0/IpY; // to month
    const MpI= M * 12.0 / IpY; // convert to interval
    r = toCrIntrest(r, CRpY);
    M = M * 12.0/CRpY;

    const s = new Savings();

    s.accPrincipel = Array<number>(i + 1).fill(P);
    s.accMonthly = Array.from({length: i+1}, (_,t) => MpI * t);
    s.totalAcc = s.accMonthly.map((M) => M + P);

    if(r==0){
        s.totalSavings = s.totalAcc;

        const zero = Array<number>(i + 1).fill(0);
        s.totalIntrest = zero;
        s.intrestPrincipel = zero;
        s.intrestMonthly = zero;
        s.intrestIntrest = zero;
        s.intrestIntrestPrincipal = zero;
        s.intrestIntrestMonthly = zero;

    }else{
        s.totalSavings = totalSavings(P,M,r,CRpI,i);

        s.totalIntrest = s.totalSavings.map((ts,i) => ts - s.totalAcc[i]);
   
        s.intrestPrincipel = intrestOnPrincipal(P,r,CRpI,i);
        s.intrestMonthly = intrestOnMontly(M,r,CRpI,i);
     
        s.intrestIntrest = s.totalSavings.map((ts,i) => ts - s.totalAcc[i] - s.intrestPrincipel[i] - s.intrestMonthly[i]);
        
        s.intrestIntrestPrincipal = intrestOnintrestPrincipal(P,r,CRpI,i);
        s.intrestIntrestMonthly = intrestOnintrestMontly(M,r,CRpI,MpI,i);
    }


    return s;
}



export {calcSavings, Interval, CompoundRate, Savings};