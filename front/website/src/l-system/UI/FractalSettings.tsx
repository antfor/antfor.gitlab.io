import { getDefault, getDefaultIterations } from "../Fractal/FractalOptions.mts";
import { useState,useEffect } from 'react';
import { updateFractal,updateIteration} from '../scene.ts';
import { OffCanvas } from './Offcanvas.tsx';


function FractalSettings(){

    const defaultFrac = getDefault();
    const defaultIterations = getDefaultIterations();
    const [fractalKey, setFractalKey] = useState(defaultFrac);
    const [iteration, setIteration] = useState(defaultIterations); 
    
    useEffect(() => {updateFractal(fractalKey)},[fractalKey]);
    useEffect(() => {updateIteration(iteration)},[iteration,fractalKey]);

    return (
        <div>
            {OffCanvas({fractalKey, setFractalKey, iteration, setIteration})}
        </div>
    );
}

export default FractalSettings;
