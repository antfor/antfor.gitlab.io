
function intrest(P, r ,t){

    return P * (1 + r)**(t) - P;
}

const CompoundRate = {
    
        Annually: 1,
        Semiannually: 2,
        Quarterly: 4,
        Monthly: 12,
    };  

function annuallyToCompoundRateIntrest(r, compoundRate){
        r = r/100.0;
        return (1 + r)**(1/compoundRate) - 1;
}

function intrestOnPrincipal(P, r, t){

    let RP = Array(t + 1).fill(0);

    for(let i = 1; i <= t; i++){

        RP[i] = P * (1 + r) - P + RP[i-1];
    }
    return RP;
}

function intrestOnMontly(Mt ,M, r ,t){

    let RM = Array(t +1).fill(0);

    for(let i = 1; i <= t; i++){

       RM[i] =  Mt[i-1] * (1 + r) - Mt[i-1] + RM[i-1];
    }
    return RM;
}

function intrestOnIntrest(RP, RM, r ,t){

  let RR = Array(t +1).fill(0);
  
  for(let i = 1; i <= t; i++){
    let lastYearIntrest = RP[i-1] + RM[i-1] + RR[i-1];

    RR[i] = lastYearIntrest * (1 + r) - lastYearIntrest + RR[i-1];
  }

  return RR;

}



/*
    P: Principal
    M: Monthly saving
    r: intrest
    t: time
    cr: compound rate

       let s = {

        accPrincipel: [],
        accMonthly: [],

        intrestPrincipel: [],
        intrestMonthly: [],
        intrestIntrest: [],

        totalAcc: [],
        totalIntrest: [],

        totalSavings: []
    };
*/
function calc(P,M,r,t,cr=CompoundRate.Annually){

    r = annuallyToCompoundRateIntrest(r, cr);

    let Pt = Array(t + 1).fill(P);
    let Mt = Pt.map((_,i) => M * i * 12/cr);

    let RP = intrestOnPrincipal(P,r,t);
    let RM = intrestOnMontly(Mt, M,r,t);
    let RR = intrestOnIntrest(RP, RM, r, t);

    let RT = RP.map((rp,i) => rp + RM[i] + RR[i]);
    let Acc = Pt.map((pt,i) => pt + Mt[i]);

    let T = Acc.map((acc,i) => acc + RT[i]);


    console.log(RT);
    console.log(T);
    console.log(Acc);
}


/*
    P: Principal
    M: Monthly saving
    r: intrest
    t: time
    cr: compound rate
*/
function calcSavings(P,M,r,t,cr=CompoundRate.Annually){

    r = annuallyToCompoundRateIntrest(r, cr);

    let s = {};

    s.accPrincipel = Array(t + 1).fill(P);
    s.accMonthly = Array(t + 1).fill() .map((_,i) => M * i * 12/cr);

    s.intrestPrincipel = intrestOnPrincipal(P,r,t);
    s.intrestMonthly = intrestOnMontly(s.accMonthly, M,r,t);
    s.intrestIntrest = intrestOnIntrest(s.intrestPrincipel, s.intrestMonthly, r, t);

    s.totalIntrest = s.intrestPrincipel.map((ip,i) => ip + s.intrestMonthly[i] + s.intrestIntrest[i]);
    s.totalAcc = s.accPrincipel.map((ap,i) => ap + s.accMonthly[i]);

    s.totalSavings = s.totalAcc.map((acc,i) => acc + s.totalIntrest[i]);

    return s;
}



export {calc, calcSavings, CompoundRate};