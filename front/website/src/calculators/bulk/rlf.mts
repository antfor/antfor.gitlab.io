



type Tuple<T> = readonly [T,T];

type Cat = {
    protein: Tuple<number>;
    fat: number;
    length: Tuple<number>;
    Period: Period;
}

function toTuple<T>(a:T,b:T):Tuple<T>{
    return [a,b];
}

enum Period{
    Week="week",
    Day="day"
}

const RFL_PARAMS = {
  cat1: { protein: toTuple(2,2.5), fat: 30, length: toTuple(8,12), Period: Period.Week },
  cat2: { protein: toTuple(2.8,3.2), fat: 30, length: toTuple(4,6), Period: Period.Week },
  cat3: { protein: toTuple(3.2,3.5), fat: 30, length: toTuple(10,14), Period: Period.Day },
};

export function getRFL(bf:number, male:boolean = true){

   if((25<=bf && male) || (35<=bf && !male)){
        return RFL_PARAMS.cat3;
   }

   if((15>bf && male) || (25>bf && !male)){
        return RFL_PARAMS.cat1;
   }

   return RFL_PARAMS.cat2;
}

export function getCalories(weight:number, bf:number, cat:Cat, carbs=0):Tuple<number>{

    const lbm = weight * (1-bf);
    const fst = cat.fat * 9 + lbm * cat.protein[0] * 4 + carbs * 4;
    const snd = cat.fat * 9 + lbm * cat.protein[1] * 4 + carbs * 4;

    return [fst,snd];
}

