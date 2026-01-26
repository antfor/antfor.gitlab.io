import { useState, useEffect, RefObject } from 'react';

export function isNaNoE(value: (number | string)) {
    return isNaN(Number(value)) || value === "";
}

export const MaxwWeight = 2205;

export function isValidWeight(weight: (number | string), maxwWeight: number = MaxwWeight) {
    if(isNaNoE(weight))
        return false;
    
    const n = Number(weight);
    return 1 <= n && n <= maxwWeight;
}
export function isValidReps(reps: (number | string)) {
    if (isNaNoE(reps))
        return false;

    const n = Number(reps);

    return Number.isInteger(n) && n >= 1 && n <= 20;
}

export function IsRefMonted<T>(ref: RefObject<T>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(Boolean(ref.current));
    }, [ref]);

    return mounted;
}
