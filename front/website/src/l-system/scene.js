import { Floor } from './Scene/Floor.mts';
import { ShadowProgram } from './Scene/ShadowProgram.mts';
import { DrawFractal } from './Scene/DrawFractal.mts';
import * as twgl from 'twgl.js';
import { getOptions} from './Fractal/FractalOptions.mts';
"use strict";

const m4 = twgl.m4;

let fractal;

const gl = document.getElementById("Background").getContext("webgl2");
const sunPosition = [0, 40, -200];
const shadowMap = new ShadowProgram(gl, sunPosition, 1024, 1024);
const offset = -40;
const floor = new Floor(gl, 100, 50, offset, shadowMap.shadowMap_texture);
const height = 60;


let updateFractalB = false;
let updateIterationB = false;
let fractalBuilt = false;

let iteration;
let fractalKey;

export function updateFractal(key){
  if(key !== fractalKey){
    fractalBuilt = false;
    updateFractalB = true;
    
    fractalKey = key;
    iteration = -1;
  }
}


export function updateIteration(i){
  if(i !== iteration || !fractalBuilt){
    updateIterationB = true;
    fractalBuilt = true;

    iteration = i;
  }

}

function newFractal(){

  let option = getOptions(fractalKey);

  fractal = new DrawFractal(gl, option.fractal, option.primitiveOffset, height, offset, option.thickness, option.primitives, sunPosition, shadowMap.shadowMap_texture);

}

function newIteration(){
    fractal.clear(gl);
    fractal.build(gl, iteration);
 
}

//const fpsElem = document.querySelector("#fps");
let fps_time = 0;
let fps_frames = 0;
let time_prev = 0;
function FPS(timeMS){
  const deltaTime = timeMS - time_prev;         
  time_prev = timeMS;                           
  fps_time += deltaTime;                       
  fps_frames += 1;                             
  if (fps_time > 1000.0) { 
    let fps = 1000 * fps_frames / fps_time;
    //fpsElem.textContent = fps.toFixed(1);  
    fps_time = fps_frames = 0;               
  } 
}

function getViewProjection(time){
  
  const fov = 30 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
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

function shadowScene(){
  const size = 50;
  let projection = m4.ortho(-size, size, -size*0.5, size*1.5, 0.5, 1000);
  let view = m4.lookAt(sunPosition, [0,0,0], [0,1,0]); 
  let viewProjection = m4.multiply(projection, view);
  scene(viewProjection);
}

function glSettings(gl){
  const multiplier = 2;
  twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.384314, 0.454902, 0.494118, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function render(time) {

  if(updateFractalB){
    newFractal(); 
    updateFractalB = false;
  }
  if(updateIterationB){
    newIteration(); 
    updateIterationB = false;
  }

  let timeMS = time;
  time *= 0.001;
  //FPS(timeMS);         

  shadowMap.draw(gl, scene);

  glSettings(gl);

  const viewProjection = getViewProjection(time);
  
  scene(viewProjection);
  //shadowScene();
  
  requestAnimationFrame(render);
}

function scene(viewProjection, drawShadowMap=false){

  const lightMatrix = shadowMap.getViewProjection();
  floor.draw(gl, viewProjection, drawShadowMap, lightMatrix);
  if(fractalBuilt)
    fractal.draw(gl, viewProjection, drawShadowMap, lightMatrix);
}

requestAnimationFrame(render);

