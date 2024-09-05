import { FractalFactory } from './LsystemModule/FractalFactory.mjs';
import { createTetrahedron } from './PrimitivesModule/Primitives.mjs';
import { Floor } from './LsystemModule/Scene/Floor.mjs';
import { ShadowProgram } from './LsystemModule/Scene/ShadowProgram.mjs';
import { DrawFractal } from './LsystemModule/Scene/DrawFractal.mjs';
import * as twgl from 'twgl.js';

"use strict";

  const m4 = twgl.m4;
  const v3 = twgl.v3;
  const gl = document.getElementById("l").getContext("webgl2");
  const sunPosition = [0, 10, -50];
  //const sunPosition = [1, 8, -30];

 

  let s = 1.0;
  let step = 1.0;
  let thickness = step/8.0;
  //thickness = 5.0;


  let factory = new FractalFactory();

  //let fractal = factory.bushCCol([s, s, s], step);
  //let soy = fractal.build(5);

  //let fractal = factory.parametricTree([s, s, s], step);
  //let fractal = factory.sympodialTreeA([s, s, s], step);
  //let soy = fractal.buildParametic(10);
  
  let iterations =  3;
  let L = 6;
  let fractal = factory.sierpinskitetrahedron([s, s, s], L);
  //let soy = fractal.buildParametic(iterations);
  //instanceWorlds = soy;
  //numInstances = soy.length / 16;
  //console.log("instances: " + numInstances);
  //instanceColors = fractal.state.colors;

  //const arrays = twgl.primitives.createCylinderVertices(thickness,step,9,1);
  //uniforms.step=0;
  //uniforms.step = -L*Math.sqrt(2/3);
  //const arrays = twgl.primitives.createTruncatedConeVertices(L/Math.sqrt(3), 0, L*Math.sqrt(2/3), 3, 1)
  const arrays = createTetrahedron(L); 
  const primitives = arrays;


  
const fpsElem = document.querySelector("#fps");
let fps_time = 0;
let fps_frames = 0;
let time_prev = 0;

let shadowMap = new ShadowProgram(gl, sunPosition, 1024, 1024);
const floor = new Floor(gl, 10, 4, shadowMap.shadowMap_texture);
const hej = new DrawFractal(gl, fractal, step, primitives, sunPosition, shadowMap.shadowMap_texture);
hej.build(gl, iterations);

function render(time) {
    let timeMS = time;
    time *= 0.001;

    const deltaTime = timeMS - time_prev;         
    time_prev = timeMS;                           
    fps_time += deltaTime;                       
    fps_frames += 1;                             
    if (fps_time > 1000.0) { 
      let fps = 1000 * fps_frames / fps_time;
      fpsElem.textContent = fps.toFixed(1);  
      fps_time = fps_frames = 0;               
    }                      

    

    const multiplier = 2;
    twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.384314, 0.454902, 0.494118, 1);
   // gl.clearColor(0.3, 0.3, 0.3, 1);
   // gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    let radius =  30;//5000;
    const speed = time * .1;
    let eye = [
      Math.sin(Math.PI + speed) * radius, 
       0,//-Math.sin(speed * 3) * 30, 
      -radius,//Math.cos(Math.PI + speed) * radius,
    ];
    //eye = [0, 10, -50];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);

  
    shadowMap.draw(scene, gl);

    scene(viewProjection);
    //const size = 20;
    //let rojection = m4.ortho(-size, size, -size, size, 0.5, 1000);  //todo scale to fit scene
    //let iew = m4.lookAt([0, 10, -50], [0,0,0], [0,1,0]); //todo add light direction
    //let iewRojection = m4.multiply(rojection, iew);
    //scene(iewRojection);
   
    requestAnimationFrame(render);
}

function scene(viewProjection, drawShadowMap=false){

  const lightMatrix = shadowMap.getViewProjection();
  hej.draw(gl, viewProjection, drawShadowMap, lightMatrix);
  floor.draw(gl, viewProjection, drawShadowMap, lightMatrix);
}


requestAnimationFrame(render);


