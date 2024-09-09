import { FractalFactory } from './LsystemModule/FractalFactory.mjs';
import { createTetrahedron } from './PrimitivesModule/Primitives.mjs';
import { Floor } from './LsystemModule/Scene/Floor.mjs';
import { ShadowProgram } from './LsystemModule/Scene/ShadowProgram.mjs';
import { DrawFractal } from './LsystemModule/Scene/DrawFractal.mjs';
import * as twgl from 'twgl.js';

"use strict";

  const m4 = twgl.m4;
  const v3 = twgl.v3;

  let iterations =  1;

  let s = 1.0;
  let step = 60.0;
  let thickness = step/8.0;
  //thickness = 5.0;


  let factory = new FractalFactory();

  

  //
  
  iterations =  9;
  step = 4.0;
  thickness = step/8.0;

  //let fractalObject = factory.parametricTree([s, s, s], step);
  //let fractalObject = factory.sympodialTreeA([s, s, s], step); // step 15   it 14 thickness 0
  //let fractalObject = factory.bushCCol([s, s, s], step); // step 4   it 4 thickness 0
  //let fractalObject = factory.dragon([s, s, s], step); // step 4   it 12  
  //const primitives = twgl.primitives.createCylinderVertices(thickness,step,9,1);
  //const primitiveOffset = step;
  

  iterations = 1;
  step = 50;
  let fractalObject = factory.sierpinskitetrahedron([s, s, s], step);
  const primitives = createTetrahedron(step); 
  const primitiveOffset = 0;
  thickness = step * Math.sqrt(2.0/3.0)*(0.5**iterations);

//settings
// min max iterations, step 
// give to this
// thickness,primitiveOffset,primitives, fractalObject,iterations

const offset = -40;
const height = 60;
const gl = document.getElementById("l").getContext("webgl2");
const sunPosition = [0, 40, -200];
let shadowMap = new ShadowProgram(gl, sunPosition, 1024, 1024);
const floor = new Floor(gl, 100, 50, offset, shadowMap.shadowMap_texture);
const fractal = new DrawFractal(gl, fractalObject, primitiveOffset, height, offset, thickness, primitives, sunPosition, shadowMap.shadowMap_texture);
fractal.build(gl, iterations);
  


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
  let timeMS = time;
  time *= 0.001;
  FPS(timeMS);         

  shadowMap.draw(scene, gl);

  glSettings(gl);

  const viewProjection = getViewProjection(time);
  
  scene(viewProjection);
  //const size = 50;
  //let rojection = m4.ortho(-size, size, -size, size, 0.5, 10000);  //todo scale to fit scene
  //let iew = m4.lookAt(sunPosition, [0,0,0], [0,1,0]); //todo add light direction
  //let iewRojection = m4.multiply(rojection, iew);
  //scene(iewRojection);
  
  requestAnimationFrame(render);
}

function scene(viewProjection, drawShadowMap=false){

  const lightMatrix = shadowMap.getViewProjection();
  floor.draw(gl, viewProjection, drawShadowMap, lightMatrix);
  fractal.draw(gl, viewProjection, drawShadowMap, lightMatrix);
}


requestAnimationFrame(render);


