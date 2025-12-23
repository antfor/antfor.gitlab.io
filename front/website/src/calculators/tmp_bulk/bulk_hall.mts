type Params = {
  rhoF?: number;      // kcal per kg stored fat
  rhoL?: number;      // kcal per kg lean tissue
  pRatio?: number;    // fraction of energy change stored as lean
  adaptCoeff?: number;// adaptive thermogenesis per kcal change (fraction)
  activityK?: number; // activity coefficient (k) such that A = k * weight
};

export function hallSim(
  surplus:number,
  w0: number,                         // initial weight (kg)
  bf0: number,                        // initial body fat fraction (0-1)
  f1: number,                         // initial activity multiplier (PAL-like)
  gainWeight:boolean = true, 
  days?: number, 
  cutof = 1,                   
  params: Params = {},
) {
  // defaults based on Hall papers and practical choices
  const rhoF = params.rhoF ?? 7700;      // kcal per kg stored fat (practical)
  const rhoL = params.rhoL ?? 1000;      // kcal per kg lean (approx)
  const p = params.pRatio ?? 0.1;        // lean partitioning (0.0–0.3 typical)
  const adapt = params.adaptCoeff ?? 0.0005; // AT per kcal change (tunable)
  const results = [];

  // initial compartments
  let F = w0 * bf0;
  let L = w0 - F;

  // helper: BMR from Katch–McArdle
  const bmrFromLBM = (lbm:number) => 370 + 21.6 * lbm;

  // estimate activity coefficient k so that base A = base_tdee - base_bmr
  const baseBMR = bmrFromLBM(L);
  const baseTDEE = baseBMR * f1;
  const k = (baseTDEE - baseBMR) / w0; // A = k * w
  const intake = baseTDEE + surplus;

  const cmp = days == null ? ()=>true : (day:number)=> day < days;

  for (let day = 0; cmp(day); day++) {
   
    const weight = F + L;
    const bmr = bmrFromLBM(L);
    const activity = k * weight;
    const adaptive = adapt * (intake - baseTDEE); // simple AT proportional to intake change
    const tdee = bmr + activity + adaptive;

    const energyImbalance = intake - tdee; // positive => storage
    // partition energy imbalance into lean and fat
    const dE_lean = p * energyImbalance;
    const dE_fat = (1 - p) * energyImbalance;

    // convert energy to mass (kg)
    const dL = dE_lean / rhoL;
    const dF = dE_fat / rhoF;

    L = Math.max(0.0, L + dL);
    F = Math.max(0.0, F + dF);

    results.push({
      day,
      weight: L + F,
      fat: F,
      lean: L,
      intake,
      tdee,
      bmr,
      activity,
      energyImbalance
    });

    if(gainWeight && energyImbalance <= cutof){
        return results;
    }else if(!gainWeight && energyImbalance >= cutof){
        return results;
    }
  }
  return results;
}
