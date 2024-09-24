import { Floor } from './Scene/Floor.mts';
import { ShadowProgram } from './Scene/ShadowProgram.mts';
import { DrawFractal } from './Scene/DrawFractal.mts';
import * as twgl from 'twgl.js';
import { getOptions, Fractals } from './Fractal/FractalOptions.mts';

const m4 = twgl.m4;
type Mat4 = twgl.m4.Mat4;
type GL = WebGL2RenderingContext;

let fractal:DrawFractal|undefined;

const canvas = document.getElementById("Background") as HTMLCanvasElement;
const gl:GL = canvas.getContext("webgl2") as GL;
const sunPosition = [0, 40, -200];
const shadowMap = new ShadowProgram(gl, sunPosition, 1024, 1024);
const offset = -40;
const floor = new Floor(gl, 100, 50, offset, shadowMap.shadowMap_texture);
const height = 60;


let updateFractalB = false;
let updateIterationB = false;
let fractalBuilt = false;

let iteration: number;
let fractalKey: Fractals;

export function updateFractal(key: Fractals){
  if(key !== fractalKey){
    fractalBuilt = false;
    updateFractalB = true;
    
    fractalKey = key;
    iteration = -1;
  }
}


export function updateIteration(i:number){
  if(i !== iteration || !fractalBuilt){
    updateIterationB = true;

    iteration = i;
  }
}

function newFractal(){

  const option = getOptions(fractalKey);
  if(option)
    fractal = new DrawFractal(gl, option.fractal, option.primitiveOffset, height, offset, option.thickness, option.primitives, sunPosition, shadowMap.shadowMap_texture);
}

function newIteration(){
  if(fractal){
    fractal.clear(gl);
    fractal.build(gl, iteration);
    fractalBuilt = true;
  }
}

function getViewProjection(time:number){
  
  const fov = 30 * Math.PI / 180;
  const canvas = gl.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.5;
  const zFar = 10000;
  const projection = m4.perspective(fov, aspect, zNear, zFar);
  
  const radius =  300;
  const speed = time * .1;
  const eye = [
    Math.sin(Math.PI + speed) * radius, 
     0,
    -radius,
    ];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);

  return m4.multiply(projection, view);
}

// @ts-expect-error debug function
function shadowScene(){
  const size = 50;
  const projection = m4.ortho(-size, size, -size*0.5, size*1.5, 0.5, 1000);
  const view = m4.lookAt(sunPosition, [0,0,0], [0,1,0]); 
  const viewProjection = m4.multiply(projection, view);
  scene(viewProjection);
}

function glSettings(gl:GL){
  const multiplier = 2;
  twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement, multiplier);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.384314, 0.454902, 0.494118, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function render(time:number) {

  if(updateFractalB){
    newFractal(); 
    updateFractalB = false;
  }
  if(updateIterationB){
    newIteration(); 
    updateIterationB = false;
  }
        
  time *= 0.001;

  shadowMap.draw(gl, scene);

  glSettings(gl);

  const viewProjection = getViewProjection(time);
  
  scene(viewProjection);
  //shadowScene();
  
  
  requestAnimationFrame(render);
}

function scene(viewProjection:Mat4, drawShadowMap=false){

  const lightMatrix = shadowMap.getViewProjection();
  floor.draw(gl, viewProjection, drawShadowMap, lightMatrix);
  if(fractalBuilt && fractal)
    fractal.draw(gl, viewProjection, drawShadowMap, lightMatrix);
}

requestAnimationFrame(render);

