import * as twgl from 'twgl.js';
import { FractalFactory, Fractal } from './Lsystem/FractalFactory.mts';
import { createTetrahedron } from './Primitives/Primitives.mts';

type Vec3 = [number, number, number];
const scale:Vec3 = [1, 1, 1];


function linePrim(step:number , thickness=step/8.0){
    return twgl.primitives.createCylinderVertices(thickness, step, 9, 1);
}

function tetranPrim(step:number){
    return createTetrahedron(step);
}

const factory = new FractalFactory();
type fOptions = (step?:number, thicc?:number) => FractalOptions;
const options = new Map<Fractals, fOptions>();

export enum Fractals{
    DRAGON = "Dragon",
    KOCHSNOWFLAKE = "KochSnowflake",
    BUSH_C = "Bush_C",
    SYMPODIALTREE_A = "SympodialTree_A",
    TERNARYTREE_A = "ternaryTree_A",
    PARAMETRICTREE = "parametricTree",
    TETRAHEDRON = "Tetrahedron",
}

interface FractalOptions{
    readonly fractal: Fractal;
    readonly primitives: twgl.Arrays;
    readonly primitiveOffset: number;
    readonly thickness: (i:number) => number;
    readonly minIterations: number;
    readonly maxIterations: number;
    readonly defultIterations: number;
}

options.set(Fractals.DRAGON, dragon);
function dragon(step=4, thickness = step/8.0):FractalOptions{
    
    return {
        fractal: factory.dragon(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => thickness,
        
        minIterations: 1,
        maxIterations: 12,
        defultIterations: 8,
    };
} 

options.set(Fractals.KOCHSNOWFLAKE, kochSnowflake);
function kochSnowflake(step=4, thickness = step/8.0):FractalOptions{

    return {
        fractal: factory.kochSnowflake(scale, step),
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => thickness,

        minIterations: 0,
        maxIterations: 4,
        defultIterations: 2,
    };
}



options.set(Fractals.BUSH_C, bushCCol);
function bushCCol(step=4, thickness = step/8.0):FractalOptions{
    
    return {
        fractal: factory.bushCCol(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => 0,
        
        minIterations: 1,
        maxIterations: 4,
        defultIterations: 2,
    };
} 

options.set(Fractals.SYMPODIALTREE_A, sympodialTreeA);
function sympodialTreeA(step=15, thickness = step/8.0):FractalOptions{
    
    return {
        fractal: factory.sympodialTreeA(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => 0,
        
        minIterations: 1,
        maxIterations: 13,
        defultIterations: 10,
    };
}

options.set(Fractals.TERNARYTREE_A, ternaryTreeA);
function ternaryTreeA(step=4, thickness = step*4):FractalOptions{
    
    return {
        fractal: factory.ternaryTreeA(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => 0,
        
        minIterations: 1,
        maxIterations: 7,
        defultIterations: 4,
    };
}

options.set(Fractals.PARAMETRICTREE, parametricTree);
function parametricTree(step=4, thickness = step/8.0):FractalOptions{
    
    return {
        fractal: factory.parametricTree(scale, step),
    
        primitives: linePrim(step, thickness),
        primitiveOffset: step,
        thickness: () => 0,
        
        minIterations: 1,
        maxIterations: 10,
        defultIterations: 5,
    };
}

const defaultFractal = Fractals.TETRAHEDRON;
const defaultIterations = 3;
options.set(Fractals.TETRAHEDRON, sierpinskitetrahedron);
function sierpinskitetrahedron(step=50):FractalOptions{
    
    return {
        fractal: factory.sierpinskitetrahedron(scale, step),
    
        primitives: tetranPrim(step),
        primitiveOffset: 0,
        thickness: (i:number) => step * Math.sqrt(2.0/3.0)*(0.5**i),
        
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

export function getOptions(key=defaultFractal):(FractalOptions|undefined){
    const fractal = options.get(key);
    if(fractal){
        return fractal();
    }
    return undefined;
}

export function getFractals(){
    return  Array.from(options.keys());
}

export function getIteration(key:Fractals){

    const fractal = options.get(key);
    if(fractal){
        return fractal().defultIterations;
    }
    return -1;
}



