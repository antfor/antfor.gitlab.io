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
}
`;


"use strict";

function forward(state){
  
  state.numInstances += 1;
  let m = state.getMat();
  state.save(...m); 
  m4.translate(m, [0, state.step, 0], m);
  state.update(...m);

}

function turnRight(state){
  let m = state.getMat();
  m4.rotateZ(m, state.angle * Math.PI/180.0, m);
  state.update(...m);
}

function turnLeft(state){
  let m = state.getMat();
  m4.rotateZ(m, -state.angle * Math.PI/180.0, m);
  this.stack = m4.translation([0,step,0]);
  state.update(...m);
}
class Rule {

  constructor(pred, succ, func) {
    this.pred = pred;
    this.succ = succ;
    this.func = func
  }


}

class State{

  constructor(angle, scale, step, dir = [0,1,0]) {
    this.reset(angle,step, dir, scale);
  }

  update(...mat){
    this.pop();
    this.push(...mat);
  }


  pop(n=16){
    this.stack = this.stack.slice(0, this.stack.length - n);
  }

  push(...mat){
    //this.stack.push(...mat);
    this.stack = [...this.stack, ...mat];
  }

  getMat(n=16){
    return this.stack.slice(this.stack.length - n, this.stack.length);
  }

  save(...mat){
    //this.saveStates.push(...mat);
    this.saveStates = [...this.saveStates, ...mat];
  }

  reset(angle=90,step=1.0, dir = [0,1,0], scale = [1,1,1]){
    this.dir = dir;
    this.angle = angle;
    this.step = step;
    this.stack = m4.scaling(scale);
    this.saveStates = [];
    this.numInstances = 0;
  }
}

class FractalFactory {

  constructor() {
   
  }

  dragon(scale = [1,1,1], step = 1.0){
    let axiom = "f";
    let rf = new Rule("f", "f+y+", forward);
    let ry = new Rule("y", "-f-y", forward);
    let rp = new Rule("+", undefined, turnRight);
    let rm = new Rule("-", undefined, turnLeft);

    return new Fractal(axiom, 90, scale, step, rf, ry, rp, rm);

  }

}

class Fractal {

  constructor(axiom, angle, scale, step, ...rules) {
    this.axiom = axiom;
    this.rules = new Map();
    this.state = new State(angle, scale ,step);
    
    for (let rule of rules) {
      this.rules.set(rule.pred, rule);
    }

  }


  build(iteration, soucre = this.axiom){

    if(iteration <= 0){

      for(let c of soucre){
        this.rules.get(c).func(this.state);
      }
      
    }else{
      for(let c of soucre){

        let r = this.rules.get(c);
        if(r.succ === undefined){
          r.func(this.state);
        }else{
          this.build(iteration-1, r.succ);
        }
      }
    }
   
    return this.state.saveStates;
  }

}
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
  const instanceColors = [];
  const r = 1;

  let mat = m4.create();
  m4.translation([0, 0, 0], mat);
  let s = 1;
  let step = 0.3;
  uniforms.step = step;
  let thickness = 0.05;
  
 
  m4.scale(mat, [s, s, s], mat);


  let factory = new FractalFactory();

  let fractal = factory.dragon([s, s, s], step);
  let soy = fractal.build(8);

  instanceWorlds = soy;

  numInstances = soy.length / 16;

  console.log("instances: " + numInstances);

  for (let i = 0; i < numInstances; ++i) {

  
    //m4.translate(mat,[0, step, 0], mat); 
    //instanceWorlds.push(...mat);

   // instanceColors.push(rand(1), rand(1), rand(1));
    instanceColors.push(0.0, 0.5, 0.5);
  }

  

  const arrays = twgl.primitives.createCylinderVertices(thickness,step,10,10);
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


function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.384314, 0.454902, 0.494118, 1);
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 500;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const radius = 25;
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
    const world = m4.rotationY(time);

    uniforms.u_viewProjection = viewProjection;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances);

    requestAnimationFrame(render);
}


requestAnimationFrame(render);


