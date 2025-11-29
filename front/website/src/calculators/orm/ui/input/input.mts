import { useState, useEffect, RefObject } from 'react';

export function isNaNoE(value: (number | string)) {
    return isNaN(Number(value)) || value === "";
}

export const MaxwWeight = 2205;

export function isValidWeight(weight: (number | string), maxwWeight: number = MaxwWeight) {
    return !isNaNoE(weight) && 1 <= Number(weight) && Number(weight) <= maxwWeight;
}
export function isValidReps(reps: (number | string)) {
    return !isNaNoE(reps) && 1 <= Number(reps) && Number(reps) <= 20;
}

export function IsRefMonted<T>(ref: RefObject<T>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(Boolean(ref.current));
    }, [ref]);

    return mounted;
}
