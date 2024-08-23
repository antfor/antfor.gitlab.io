import { FractalFactory } from './LsystemModule/FractalFactory.mjs';
import { createTetrahedron } from './PrimitivesModule/Primitives.mjs';
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

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const uniforms = {
    u_lightDir: v3.normalize([1, 8, -30]),
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
  const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);



const fpsElem = document.querySelector("#fps");
let then = 0;
function render(time) {
    time *= 0.001;

    const deltaTime = time - then;          // compute time since last frame
    then = time;                            // remember time for next frame
    const fps = 1 / deltaTime;             // compute frames per second
    fpsElem.textContent = fps.toFixed(1);

    const multiplier = 2;
    twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
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

    uniforms.u_viewProjection = viewProjection;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances);

    requestAnimationFrame(render);
}


requestAnimationFrame(render);


