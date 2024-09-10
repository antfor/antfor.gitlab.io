import * as twgl from 'twgl.js';
import { FractalFactory } from './FractalFactory.mjs';
import { createTetrahedron } from './PrimitivesModule/Primitives.mjs';

const scale = [1, 1, 1];

function linePrim(step , thickness=step/8.0){
    return twgl.primitives.createCylinderVertices(thickness, step, 9, 1);
}

function tetranPrim(step){
    return createTetrahedron(step);
}

const factory = new FractalFactory();


function dragon(step=4, thickness = step/8.0){
    
    return {
        fractal: factory.dragon(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: (i) => thickness,
        
        minIterations: 0,
        maxIterations: 12,
        defultIterations: 4,
    };
} 

function bushCCol(step=4, thickness = step/8.0){
    
    return {
        fractal: factory.bushCCol(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: (i) => 0,
        
        minIterations: 0,
        maxIterations: 4,
        defultIterations: 2,
    };
} 

function sympodialTreeA(step=15, thickness = step/8.0){
    
    return {
        fractal: factory.sympodialTreeA(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: (i) => 0,
        
        minIterations: 0,
        maxIterations: 14,
        defultIterations: 10,
    };
}


function sierpinskitetrahedron(step=50){
    
    return {
        fractal: factory.sierpinskitetrahedron(scale, step),
    
        primitives: tetranPrim(step),
        primitiveOffset: 0,
        thickness: (i) => step * Math.sqrt(2.0/3.0)*(0.5**i),
        
        minIterations: 0,
        maxIterations: 8,
        defultIterations: 3,
    };
}
