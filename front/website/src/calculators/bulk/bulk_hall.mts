type Params = {
  rhoF?: number;      // kcal per kg stored fat
  adaptCoeff?: number; // fraction of intake change that becomes AT (e.g., 0.1 = 10%)
  tau?: number; // AT time constant in days (default 21)
  activityK?: number; // activity coefficient (k) such that A = k * weight
};

export function hallSim(
  surplus:number,
  w0: number,                         
  bf0: number,                        
  f1: number,
  days: number = 365*10, 
  cutof = 1,                   
  params: Params = {},
) {
  // defaults based on Hall papers and practical choices
  const rhoF = params.rhoF ?? 7700;      // kcal per kg stored fat
  const adapt = params.adaptCoeff ?? 0.1; // AT per kcal change
  const tau = params.tau ?? 21; // days to approach AT target
  const results = [];
  
  let F = w0 * bf0;
  let L = w0 - F;
  let adaptive = 0;
  let adaptive_target = 0;

  const bmrFromLBM = (lbm:number) => 370 + 21.6 * lbm;

  const baseBMR = bmrFromLBM(L);
  const baseTDEE = baseBMR * f1;
  const k = (baseTDEE - baseBMR) / w0;
  const intake = baseTDEE + surplus;
  const maxAdaptive = 0.15 * baseBMR;

  const dt = 1;
  const maxSteps = days/dt;

  for (let step = 0; step < maxSteps; step+=dt) {
   
    const day = Math.round(step);
    const weight = F + L;
    const bmr = bmrFromLBM(L);
    const activity = k * weight;
    
    const tdee = bmr + activity + adaptive;

    adaptive_target = adapt * (intake - tdee);
    adaptive += (adaptive_target-adaptive) * dt/tau ;
    adaptive = Math.min(Math.max(adaptive, -maxAdaptive), maxAdaptive);

    const energyImbalance = intake - tdee;

    const dF  = energyImbalance / rhoF * dt

    L = Math.max(0.0, L);
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

    if(Math.abs(energyImbalance) <= cutof){
        return results;
    }
  }
  return results;
}
