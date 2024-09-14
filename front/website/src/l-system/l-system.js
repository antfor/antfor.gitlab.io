import { Floor } from './LsystemModule/Scene/Floor.mjs';
import { ShadowProgram } from './LsystemModule/Scene/ShadowProgram.mjs';
import { DrawFractal } from './LsystemModule/Scene/DrawFractal.mjs';
import * as twgl from 'twgl.js';
import { getOptions} from './LsystemModule/FractalOptions.mjs';
"use strict";

const m4 = twgl.m4;

let fractal;

const gl = document.getElementById("l").getContext("webgl2");
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
    const dir = fractal.fractal.state.dir; //todo fix
    fractal.clear(gl);
    fractal.fractal.state.dir = dir;
    fractal.build(gl, iteration);
 
}
/*
const fpsElem = document.querySelector("#fps");
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
    fpsElem.textContent = fps.toFixed(1);  
    fps_time = fps_frames = 0;               
  } 
}
*/
function getViewProjection(time){
  
  const fov = 30 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.5;
  const zFar = 10000;
  const projection = m4.perspective(fov, aspect, zNear, zFar);
  
  const radius =  300;//5000;
  const speed = time * .1;
  const eye = [
    Math.sin(Math.PI + speed) * radius, 
     0,//-Math.sin(speed * 3) * 30, 
    -radius,//Math.cos(Math.PI + speed) * radius,
    ];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);

  return m4.multiply(projection, view);
}

function glSettings(gl){
  const multiplier = 2;
  twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.384314, 0.454902, 0.494118, 1);
  // gl.clearColor(0.3, 0.3, 0.3, 1);
  // gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function render(time) {

  if(updateFractalB){
    console.log("new fractal");
    newFractal(); 
    updateFractalB = false;
  }
  if(updateIterationB){
    console.log("new iteration");
    newIteration(); 
    updateIterationB = false;
  }

  let timeMS = time;
  time *= 0.001;
  //FPS(timeMS);         

  shadowMap.draw(scene, gl);

  glSettings(gl);

  const viewProjection = getViewProjection(time);
  
  scene(viewProjection);
  //const size = 50;
  //let rojection = m4.ortho(-size, size, -size-size/2, size+size/2, 0.5, 1000);  //todo scale to fit scene
  //let iew = m4.lookAt(sunPosition, [0,0,0], [0,1,0]); //todo add light direction
  //let iewRojection = m4.multiply(rojection, iew);
  //scene(iewRojection);
  
  requestAnimationFrame(render);
}

function scene(viewProjection, drawShadowMap=false){

  const lightMatrix = shadowMap.getViewProjection();
  floor.draw(gl, viewProjection, drawShadowMap, lightMatrix);
  if(fractalBuilt)
    fractal.draw(gl, viewProjection, drawShadowMap, lightMatrix);
}

//updateFractal(); //todo remove
requestAnimationFrame(render);

