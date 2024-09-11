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
const options = new Map();


options.set("Dragon", dragon);
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

options.set("Bush_C", bushCCol);
function bushCCol(step=4, thickness = step/8.0){
    
    return {
        fractal: factory.bushCCol(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: (i) => 0,
        
        minIterations: 1,
        maxIterations: 4,
        defultIterations: 2,
    };
} 

options.set("SympodialTree_A", sympodialTreeA);
function sympodialTreeA(step=15, thickness = step/8.0){
    
    return {
        fractal: factory.sympodialTreeA(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: (i) => 0,
        
        minIterations: 1,
        maxIterations: 13,
        defultIterations: 10,
    };
}

const defaultFractal = "Tetrahedron";
const defaultIterations = 3;
options.set("Tetrahedron", sierpinskitetrahedron);
function sierpinskitetrahedron(step=50){
    
    return {
        fractal: factory.sierpinskitetrahedron(scale, step),
    
        primitives: tetranPrim(step),
        primitiveOffset: 0,
        thickness: (i) => step * Math.sqrt(2.0/3.0)*(0.5**i),
        
        minIterations: 0,
        maxIterations: 7,
        defultIterations: 3,
    };
}

export function getDefault(){
    return defaultFractal;
}

export function getDefaultIterations(){
    return defaultIterations;
}

export function getOptions(key=defaultFractal){
    return options.get(key)();
}

export function getFractals(){
    return  Array.from(options.keys());
}

export function getIteration(key){
    return options.get(key)().defultIterations;
}



