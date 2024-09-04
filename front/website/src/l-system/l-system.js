import { FractalFactory } from './LsystemModule/FractalFactory.mjs';
import { createTetrahedron } from './PrimitivesModule/Primitives.mjs';
import { Floor } from './LsystemModule/Scene/Floor.mjs';
import { ShadowProgram } from './LsystemModule/Scene/ShadowProgram.mjs';
import * as twgl from 'twgl.js';

const vs = `
uniform mat4 u_viewProjection;
uniform float step;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  gl_Position = u_viewProjection * instanceWorld * pos;
  v_color = instanceColor;
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;
}
`;
const fs = `
precision mediump float;

varying vec3 v_normal;
varying vec4 v_color;

uniform vec3 u_lightDir;

void main() {
  vec3 a_normal = normalize(v_normal);
  float light = dot(u_lightDir, a_normal) * .5 + .5;
  gl_FragColor = vec4(v_color.rgb * light, v_color.a);
  //gl_FragColor = vec4(a_normal, v_color.a);
}
`;


"use strict";

  const m4 = twgl.m4;
  const v3 = twgl.v3;
  const gl = document.getElementById("l").getContext("webgl2");
  const sunPosition = [0, 10, -50];
  //const sunPosition = [1, 8, -30];

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const uniforms = {
    u_lightDir: v3.normalize(sunPosition),
  };

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  }

  let numInstances = 1000;
  let instanceWorlds = []; //new Float32Array(numInstances * 16);
  let instanceColors = [];

  let s = 1.0;
  let step = 1.0;
  uniforms.step = step;
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
  let soy = fractal.buildParametic(iterations);
  
  instanceWorlds = soy;

  numInstances = soy.length / 16;

  console.log("instances: " + numInstances);

  instanceColors = fractal.state.colors;

  //const arrays = twgl.primitives.createCylinderVertices(thickness,step,9,1);
  //uniforms.step=0;
  //uniforms.step = -L*Math.sqrt(2/3);
  //const arrays = twgl.primitives.createTruncatedConeVertices(L/Math.sqrt(3), 0, L*Math.sqrt(2/3), 3, 1)
  const arrays = createTetrahedron(L); 

  Object.assign(arrays, {
    instanceWorld: {
      numComponents: 16,
      data: instanceWorlds,
      divisor: 1,
    },
    instanceColor: {
      numComponents: 3,
      data: instanceColors,
      divisor: 1,
    },
  });
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  //const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

 

  
const fpsElem = document.querySelector("#fps");
let fps_time = 0;
let fps_frames = 0;
let time_prev = 0;

let shadowMap = new ShadowProgram(gl, sunPosition, 1024, 1024);
uniforms.shadowMap = shadowMap.shadowMap_texture;
const floor = new Floor(gl, 10, 4, shadowMap.shadowMap_texture);


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
    //gl.enable(gl.CULL_FACE);
    gl.clearColor(0.384314, 0.454902, 0.494118, 1);
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    let radius =  30;//5000;
    const speed = time * .1;
    const eye = [
      Math.sin(Math.PI + speed) * radius, 
      0,// Math.sin(speed * .7) * 10, 
      -radius,//Math.cos(Math.PI + speed) * radius,
    ];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);

  
    shadowMap.draw(draw, gl, viewProjection);

    gl.useProgram(programInfo.program);
    draw(programInfo, viewProjection);
    //const size = 20;
    //let rojection = m4.ortho(-size, size, -size, size, 0.5, 1000);  //todo scale to fit scene
    //let iew = m4.lookAt(sunPosition, [0,0,0], [0,1,0]); //todo add light direction
    //let iewRojection = m4.multiply(rojection, iew);
    //draw(programInfo, iewRojection);
   
    requestAnimationFrame(render);
}

function draw(programInfo, viewProjection, drawShadowMap=false){

  uniforms.u_viewProjection = viewProjection;

  const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);
  twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances);

  floor.draw(gl, viewProjection, drawShadowMap, shadowMap.getViewProjection());
}


requestAnimationFrame(render);


