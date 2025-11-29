import { FORMULA, EstimatorFactory } from "./estimator.mjs"

const maxReps = 20;
const minPercentage = 0.5;
const estimatorFactory = new EstimatorFactory;

export type PR = {
    weight: number,
    reps: number,
    orm: number,
    dif: number,
}

export type Match = {
    percentage: number,
    weight: number,
    reps: number,
}

export type Result = {
    orm: number,
    match: Match[],
    minPRs: PR[],
};

function round(n: number, d = 0) {
    const pow = 10 ** d;
    return Math.round(n * pow) / pow;
}

export function simplifyValue(value: number, decimals: number) {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
    }).format(round(value, decimals) + 0); // +0 to remove -0
}

export function orm(weight: number, reps: number, formula: FORMULA = FORMULA.EPLEY) {
    return simplifyValue(estimatorFactory.estimator(formula).orm(weight, reps), 2);
}

//                                                                                           EPLEY   BRZYCKI
export function calcOneRepMax(weight: number, reps: number, increment: number = 5, formula: FORMULA = FORMULA.EPLEY): Result {
    if (1 > weight) {
        throw new Error("Minimum weight is 1kg");
    }
    if (1 > reps) {
        throw new Error("Minimum number of reps is 1");
    }
    if (maxReps < reps) {
        throw new Error("Maximum number of reps is 20");
    }

    const estimator = estimatorFactory.estimator(formula);

    const orm = estimator.orm(weight, reps);
    const weights = getWeights(orm, increment);
    const repRange = getRepRange(orm, weights, estimator.maxRep);

    const match = getMatch(orm, weights, repRange,);
    const pr = minPr(orm, weights, repRange, estimator.orm);

    return { orm: orm, match: match, minPRs: pr };
}



function getWeights(orm: number, inc: number): number[] {

    if (inc <= 0) { //just give standard percentages in this case
        const maxPercentage = 0.95;
        const gap = 0.05;
        const len = 1 + (maxPercentage * 100 - minPercentage * 100) / (gap * 100);
        return Array.from({ length: len }, (_, i) => (maxPercentage - gap * i) * orm);
    }

    const max = Math.floor(orm / inc);
    if (max < 1) {
        return [];
    }
    const min = Math.round(minPercentage * orm / inc);
    const len = max - min + 1;
    return Array.from({ length: len }, (_, i) => inc * (max - i));
}

function getPercentage(orm: number, weights: number[]): number[] {
    return weights.map((w) => (w * 100 / orm) + 0);
}

function getRepRange(orm: number, weights: number[], maxRep: (w: number, r: number) => number): number[] {
    return weights.map((w) => maxRep(orm, w));
}



function minPr(orm: number, ws: number[], rs: number[], ormEst: (w: number, r: number) => number): PR[] {

    const len = Math.min(ws.length, rs.length);
    const PRs = Array.from({ length: len }, (_, i) => ({ weight: ws[i], reps: rs[i] + 1, orm: ormEst(ws[i], rs[i] + 1) }));

    const result = PRs.map((pr) => ({ ...pr, dif: pr.orm - orm }));
    const filter = result.filter((v) => v.reps < maxReps);

    return filter;
}

function getMatch(orm: number, weights: number[], reps: number[]): Match[] {

    const per = getPercentage(orm, weights);
    const len = Math.min(per.length, Math.min(weights.length, reps.length));

    const getMatch = (p: number, w: number, r: number) => ({ percentage: p, weight: w, reps: r });
    const match = Array.from({ length: len }, (_, i) => getMatch(per[i], weights[i], reps[i]));

    return match;
}