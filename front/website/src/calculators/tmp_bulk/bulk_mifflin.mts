


//Mifflin–St Jeor equation
function bmr(m:number, h:number, a:number, male:boolean = true){
    const s = male? 5:-165;
    return(10*m+6.25*h-5*a+s)
}

function bmrPrim(bmr:number, h:number, a:number, male:boolean = true){
    const s = male? 5:-165;
    return((bmr-s+5*a-6.25*h)/10);
    
}

export function mifflin_bulk_weight_fixed(surplus:number, f1:number, f2:number, m:number, h:number, a:number, male:boolean = true){
    
    const base_tdee = bmr(m,h,a,male)*f1;
    const new_bmr = (base_tdee + surplus)/f2;

    return bmrPrim(new_bmr,h,a,male);
}


//Tdee(w) = Bmr(w)+ A(w) => A(w) = k * w  (activity energy A scales proportionally with mass)
export function mifflin_bulk_weight(surplus:number, f1:number, m:number, h:number, a:number, male:boolean = true){
    
    const base_bmr = bmr(m,h,a,male)
    const base_tdee = base_bmr*f1;
    const k = (base_tdee-base_bmr)/m;
    const new_tdee = (base_tdee + surplus);
    const s = male ? 5:-165;
    const c = 6.25*h - 5*a + s;

    return (new_tdee - c)/(10+k); 
}