
const CompoundRate = {
    
        Annually: 1,
        Semiannually: 2,
        Quarterly: 4,
        Monthly: 12,
};  

const Interval = {
    Year: 1,
    HalfYear: 2,
    Quarter: 4,
    Month: 12,
}

function toCrIntrest(r, cr){
        r = r/100.0;
        return ((1 + r)**(1.0/cr) - 1);
}


function totalSavings(P, M, r, CRpI, i){
    let TS = Array(i + 1).fill(0);

    return (TS.map((_, t)=> M * ((1+r)**(t*CRpI)-1)/r + P*(1+r)**(t*CRpI)));
}

function intrestOnPrincipal(P, r, CRpI, i){

    let RP = Array(i + 1).fill(0);

    return(RP.map((_, t)=> P * r * (t*CRpI)));
}


function intrestOnMontly(M, r, CRpI, i){

    let RM = Array(i + 1).fill(0);
    return(RM.map((_,t)=> M*r*(t*CRpI)*(t*CRpI-1)*0.5)); // t-1
}

/*
    P: Principal
    M: Monthly saving /mån
    r: intrest        /year
    t: time
    cr: compound rate
*/
function calcSavings(P,M,r,i,IpY=Interval.Year,CRpY=CompoundRate.Monthly){

    const CRpI = CRpY * 1.0/IpY; // to month
    const MpI= M * 12.0 / IpY; // convert to interval
    r = toCrIntrest(r, CRpY);
    M = M * 12.0/CRpY;

    let s = {};

    s.accPrincipel = Array(i + 1).fill(P);
    s.accMonthly = Array(i + 1).fill().map((_,t) => MpI * t);
    s.totalAcc = s.accPrincipel.map((ap,i) => ap + s.accMonthly[i]);
    

    s.intrestPrincipel = intrestOnPrincipal(P,r,CRpI,i);
    s.intrestMonthly = intrestOnMontly(M,r,CRpI,i);

    s.totalSavings = totalSavings(P,M,r,CRpI,i);
 
    s.totalIntrest = s.totalSavings.map((ts,i) => ts - s.totalAcc[i]);
   
    s.intrestIntrest= s.totalSavings.map((ts,i) => ts - s.totalAcc[i] - s.intrestPrincipel[i] - s.intrestMonthly[i]);

    return s;
}



export {calcSavings, Interval, CompoundRate};