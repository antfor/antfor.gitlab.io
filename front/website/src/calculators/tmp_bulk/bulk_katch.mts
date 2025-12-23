


//Katch–McArdle equation
function bmr(m:number, bf:number){
    const lean_body_mass = m * (1 - bf);
    return(370 + 21.6 * lean_body_mass);
}

function bmrPrim(bmr:number, bf:number){

    return (bmr - 370)/((1-bf)*21.6)
}

export function katch_bulk_weight_fixed(surplus:number, m:number, bf:number, f1:number, f2:number = f1){
    
    const base_tdee = bmr(m,bf)*f1;
    const new_bmr = (base_tdee + surplus)/f2;

    return bmrPrim(new_bmr, bf);
}


//Tdee(w) = Bmr(w)+ A(w) => A(w) = k * w  (activity energy A scales proportionally with mass)
export function katch_bulk_weight(surplus:number, m:number, bf:number, f1:number){
    
    const base_bmr = bmr(m,bf);
    const base_tdee = base_bmr*f1;
    const new_tdee = (base_tdee + surplus);

    const k = (base_tdee - base_bmr)/m;
    const lbm = m * (1-bf);
    //option 1:
    //new_tdee = 370 + 21.6*lbm + w*k; =>
    //weight = (new_tdee - 370 + 21.6*lbm)/k

    //option 2:
    //new_tdee = 370 + 21.6*w*(1-bf) + w*k;
    //weight = (new_tdee - 370)/(21.6 * (1-bf) + k);
    
    return (new_tdee - 370)/(21.6 * (1-bf) + k);
}

export function katch_bulk_weight_gain(surplus:number, m:number, bf:number, f1:number){
    
    const base_bmr = bmr(m,bf)
    const base_tdee = base_bmr*f1;
    const k = (base_tdee - base_bmr)/m;
    const new_tdee = (base_tdee + surplus);
    
    const end_weight = (new_tdee - 370)/(21.6 * (1-bf) + k);

    let weight = m;
    const lean_mass = (1-bf)*m;
    const data = [weight];
    const intake = new_tdee;
    
    while(end_weight>=weight){
        const new_bmr = bmr(weight, 1-lean_mass/weight);
        const new_f = k * weight;
        const dif = intake - new_bmr*new_f;
        weight += dif/7.7;
         
        data.push(weight);
    }
    return data;
}