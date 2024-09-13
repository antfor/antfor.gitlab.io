import { getDefault, getDefaultIterations } from "./LsystemModule/FractalOptions.mjs";
import { useState,useEffect } from 'react';
import { updateFractal,updateIteration} from './l-system.js';
import { OffCanvas } from './UI/Offcanvas.jsx';


function FractalSettings(){

    const defaultFrac = getDefault();
    const defaultIterations = getDefaultIterations();
    let [fractalKey, setFractalKey] = useState(defaultFrac);
    let [iteration, setIteration] = useState(defaultIterations); 

    console.log(fractalKey, iteration);
    
    useEffect(() => {updateFractal(fractalKey)},[fractalKey]);
    useEffect(() => {updateIteration(iteration)},[iteration,fractalKey]);

    return (
        <div>
            {OffCanvas(fractalKey, setFractalKey, iteration, setIteration)}
        </div>
    );
}

export default FractalSettings;
