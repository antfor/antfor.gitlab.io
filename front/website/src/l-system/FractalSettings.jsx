import React from 'react';
import ReactDOM from 'react-dom/client';
import { getDefault, getDefaultIterations } from "./LsystemModule/FractalOptions.mjs";
import { useState,useEffect } from 'react';
import { updateFractal,updateIteration} from './l-system.js';
import { Settings } from './UI/Settings.jsx';


export function FractalSettings(){

    const defaultFrac = getDefault();
    const defaultIterations = getDefaultIterations();
    let [fractalKey, setFractalKey] = useState(defaultFrac);
    let [iteration, setIteration] = useState(defaultIterations); 

    console.log(fractalKey, iteration);
    
    useEffect(() => {updateFractal(fractalKey)},[fractalKey]);
    useEffect(() => {updateIteration(iteration)},[iteration]);

    return (
        <div>
            <h1>Fractal Canvas</h1>
            {Settings(fractalKey, setFractalKey, iteration, setIteration)}
        </div>
    );
}

const root = document.getElementById("Lsystem");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FractalSettings></FractalSettings>
  </React.StrictMode>
)