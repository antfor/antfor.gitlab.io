import { getDefault, getDefaultIterations } from "../Fractal/FractalOptions.mts";
import { useState,useEffect } from 'react';
import { updateFractal,updateIteration} from '../scene.js';
import { OffCanvas } from './Offcanvas.jsx';


function FractalSettings(){

    const defaultFrac = getDefault();
    const defaultIterations = getDefaultIterations();
    let [fractalKey, setFractalKey] = useState(defaultFrac);
    let [iteration, setIteration] = useState(defaultIterations); 
    
    useEffect(() => {updateFractal(fractalKey)},[fractalKey]);
    useEffect(() => {updateIteration(iteration)},[iteration,fractalKey]);

    return (
        <div>
            {OffCanvas(fractalKey, setFractalKey, iteration, setIteration)}
        </div>
    );
}

export default FractalSettings;
