const vs = `
uniform mat4 u_viewProjection;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
  gl_Position = u_viewProjection * instanceWorld * position;
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
}
`;


"use strict";

function forward(state){
  
  state.numInstances += 1;
}

class Rule {

  constructor(pred, succ, func) {
    this.pred = pred;
    this.succ = succ;
    this.func = func
  }


}

class State{

  constructor(step=0.005, dir = [0,1,0]) {
    this.dir = dir;
    this.step = step;
    numInstances = 0;
    this.stack = [];
  }

  pop(n=16){
    this.stack = this.stack.slice(0, this.stack.length - n);
  }

  push(mat){
    this.stack.push(mat);
  }

  getMat(n=16){
    return new Float32Array(this.stack, i * n * 4, n);
  }
}

class Fractal {

  constructor(axiom, ...rules) {
    this.rules = new Map();
    this.state = new State();
    
    for (let rule of rules) {
      this.rules.set(rule.pred, rule);
    }

    this.axiom = axiom;
  }


  build(iteration, soucre = this.axiom){

    if(iteration == 0){
      soucre.forEach((c) => {c.func(state);});
      
      return mat;
    }
    for(let c in soucre){

      succ = this.rules.get(c).succ;
      if(succ === undefined){
        succ.func(state);
      }else{
        this.build(iteration-1, succ);
      }
    }
  }

}
  const m4 = twgl.m4;
  const v3 = twgl.v3;
  const gl = document.getElementById("l").getContext("webgl2");

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  }

  const numInstances = 10000;
  const instanceWorlds = []; //new Float32Array(numInstances * 16);
  const instanceColors = [];
  const r = 100;

  const mat = m4.create();

  for (let i = 0; i < numInstances; ++i) {

  
    m4.translation([rand(-r, r), rand(-r, r), rand(-r, r)], mat);
  
    instanceWorlds.push(...mat);
    instanceColors.push(rand(1), rand(1), rand(1));
  }

  const arrays = twgl.primitives.createCylinderVertices(1,1,10,10);
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

  const uniforms = {
    u_lightDir: v3.normalize([1, 8, -30]),
  };

function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 500;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const radius = 25;
    const speed = time * .1;
    const eye = [
      Math.sin(speed) * radius, 
      Math.sin(speed * .7) * 10, 
      Math.cos(speed) * radius,
    ];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);
    const world = m4.rotationY(time);

    uniforms.u_viewProjection = viewProjection;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances);

    requestAnimationFrame(render);
}


requestAnimationFrame(render);


