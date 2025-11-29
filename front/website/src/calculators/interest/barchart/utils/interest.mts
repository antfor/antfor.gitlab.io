
enum CompoundRate {
    Annually = 1,
    Semiannually = 2,
    Quarterly = 4,
    Monthly = 12,
}

enum Interval {
    Year = 1,
    HalfYear = 2,
    Quarter = 4,
    Month = 12,
}

function toCrInterest(r: number, cr: number) {
    r = r / 100.0;
    return ((1 + r) ** (1.0 / cr) - 1);
}


function totalSavings(P: number, M: number, r: number, CRpI: number, i: number) {

    const TS = Array(i + 1).fill(0);

    return (TS.map((_, t) => M * ((1 + r) ** (t * CRpI) - 1) / r + P * (1 + r) ** (t * CRpI)));
}

function interestOnPrincipal(P: number, r: number, CRpI: number, i: number) {

    const RP = Array(i + 1).fill(0);

    return (RP.map((_, t) => P * r * (t * CRpI)));
}

function interestOninterestPrincipal(P: number, r: number, CRpI: number, i: number) {

    const RRP = Array(i + 1).fill(0);

    return (RRP.map((_, t) => P * (1 + r) ** (t * CRpI) - P - (P * r * (t * CRpI))));
}


function interestOnMontly(M: number, r: number, CRpI: number, i: number) {

    const RM = Array(i + 1).fill(0);

    return (RM.map((_, t) => M * r * (t * CRpI) * (t * CRpI - 1) * 0.5)); // t-1
}

function interestOninterestMontly(M: number, r: number, CRpI: number, MpI: number, i: number) {

    const RRM = Array(i + 1).fill(0);

    return (RRM.map((_, t) => M * ((1 + r) ** (t * CRpI) - 1) / r - MpI * t - (M * r * (t * CRpI) * (t * CRpI - 1) * 0.5)));
}

class Savings {
    accPrincipel: number[] = [];
    accMonthly: number[] = [];
    totalAcc: number[] = [];
    totalSavings: number[] = [];
    totalInterest: number[] = [];
    interestPrincipel: number[] = [];
    interestMonthly: number[] = [];
    interestInterest: number[] = [];
    interestInterestPrincipal: number[] = [];
    interestInterestMonthly: number[] = [];
}

/*
    P: Principal
    M: Monthly saving /mån
    r: interest        /year
    t: time
    cr: compound rate
*/
function calcSavings(P: number, M: number, r: number, i: number, IpY = Interval.Year, CRpY = CompoundRate.Monthly): Savings {

    const CRpI = CRpY * 1.0 / IpY; // to month
    const MpI = M * 12.0 / IpY; // convert to interval
    r = toCrInterest(r, CRpY);
    M = M * 12.0 / CRpY;

    const s = new Savings();

    s.accPrincipel = Array<number>(i + 1).fill(P);
    s.accMonthly = Array.from({ length: i + 1 }, (_, t) => MpI * t);
    s.totalAcc = s.accMonthly.map((M) => M + P);

    if (r == 0) {
        s.totalSavings = s.totalAcc;

        const zero = Array<number>(i + 1).fill(0);
        s.totalInterest = zero;
        s.interestPrincipel = zero;
        s.interestMonthly = zero;
        s.interestInterest = zero;
        s.interestInterestPrincipal = zero;
        s.interestInterestMonthly = zero;

    } else {
        s.totalSavings = totalSavings(P, M, r, CRpI, i);

        s.totalInterest = s.totalSavings.map((ts, i) => ts - s.totalAcc[i]);

        s.interestPrincipel = interestOnPrincipal(P, r, CRpI, i);
        s.interestMonthly = interestOnMontly(M, r, CRpI, i);

        s.interestInterest = s.totalSavings.map((ts, i) => ts - s.totalAcc[i] - s.interestPrincipel[i] - s.interestMonthly[i]);

        s.interestInterestPrincipal = interestOninterestPrincipal(P, r, CRpI, i);
        s.interestInterestMonthly = interestOninterestMontly(M, r, CRpI, MpI, i);
    }


    return s;
}



export { calcSavings, Interval, CompoundRate, Savings };