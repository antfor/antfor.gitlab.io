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

function push(state){

  let m = state.getMat();
  state.push(...m);

}

function pop(state){

  state.pop();
}

function forwardVal(state, val){
  
  state.numInstances += 1;
  let m = state.getMat();
  let scale = m4.scaling([1, val, 1]);
  m4.multiply(m, scale, scale);
  state.save(...scale); 
  m4.translate(m, [0, state.step * val, 0], m);
  state.update(...m);

}

// F
function forward(state){
  forwardVal(state, 1);
}


function forwardColorVal(state, val){
  forwardVal(state, val);
  state.pushColor(...state.color);
}

function forwardColor(state){
  forwardColorVal(state, 1);
}

// f Forward without drawing
function translateVal(state, val){
  let m = state.getMat();
  m4.translate(m, [0, state.step * val, 0], m);
  state.update(...m);
}

// f
function translate(state){
  translateVal(state, 1);
}


// +-
function yaw(state, angle){
  let m = state.getMat();
  m4.rotateZ(m, angle * Math.PI/180.0, m);
  state.update(...m);
}

// ^& 
function pitch(state, angle){
  let m = state.getMat();
  m4.rotateX(m, angle * Math.PI/180.0, m);
  state.update(...m);
}

// \/
function roll(state, angle){
  let m = state.getMat();
  m4.rotateY(m, angle * Math.PI/180.0, m);
  state.update(...m);
}

//|
function turnAround(state){
  yaw(state, 180);
}

//+
function turnRight(state){
  yaw(state, state.angle);
}

//-
function turnLeft(state){
  yaw(state, -state.angle);
}

//Cn
function color(state, RGB){
  state.color.set(RGB);
}

//! 
function width(state, width){
  let m = state.getMat();
  let scale = m4.scaling([width, 1, width]);
  m4.multiply(scale, m, m); //m * scale ???
  state.update(...m);
}

//f foward function
function tropismVal(T, e, f, state, val){

  f(state, val);  

  let m = state.getMat();
  let H = getAxis(m);
  let axis = v3.cross(H, T, H);
  m4.rotate(m, axis, v3.length(axis)*e, m);
  state.update(...m);
}


//~
//function shape(state, shape){
//  state.shape = shape;
//}

class Rule {

  constructor(pred, succ, func, val = false) {
    this.pred = pred;
    this.succ = succ;
    this.func = func;
    this.valuFunction = val;
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
    //this.stack = this.stack.slice(0, this.stack.length - n);
    this.stack.splice(this.stack.length - n, n);
  }

  push(...mat){
    this.stack.push(...mat);
    //this.stack = [...this.stack, ...mat];
  }

  pushColor(...col){
    this.colors.push(...col);
  }

  getMat(n=16){
    return this.stack.slice(this.stack.length - n, this.stack.length);
    //return this.stack.subarray(this.stack.length - n, this.stack.length);
  }

  save(...mat){
    this.saveStates.push(...mat);
    //this.saveStates = [...this.saveStates, ...mat];
  }

  reset(angle=90,step=1.0, dir = [0,1,0], scale = [1,1,1]){
    this.dir = dir;
    this.angle = angle;
    this.step = step;
    this.stack = [...m4.scaling(scale)];
    this.saveStates = [];
    this.numInstances = 0;
    this.color = new Float32Array(3);
    this.colors = [];
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

  bushC(scale = [1,1,1], step = 1.0){
    let axiom = "F";
    let rf = new Rule("F", "FF-[-F+F+F]+[+F-F-F]", forward);
    let rp = new Rule("+", undefined, turnRight);
    let rm = new Rule("-", undefined, turnLeft);
    let rs = new Rule("[", undefined, push);
    let rl = new Rule("]", undefined, pop);

    return new Fractal(axiom, 22.5, scale, step, rf, rp, rm, rs, rl);
  }

  bushCParCOl(scale = [1,1,1], step = 1.0){
    let axiom = "F";
    let rf = new Rule("F", ['C',[140/255, 80/255, 60/255],..."FFC",[24/255, 180/255, 24/255],..."-[-F+F+F]C",[48/255, 220/255, 48/255],..."+[+F-F-F]"], forwardColor);
    let rc = new Rule("C", undefined, color, true);
    let rp = new Rule("+", undefined, turnRight);
    let rm = new Rule("-", undefined, turnLeft);
    let rs = new Rule("[", undefined, push);
    let rl = new Rule("]", undefined, pop);

    return new Fractal(axiom, 22.5, scale, step, rf, rp, rm, rc, rs, rl);
  }

  bushCCol(scale = [1,1,1], step = 1.0){
    let axiom = "F";
    let rf = new Rule("F", "BFF-G[-F+F+F]+L[+F-F-F]", forwardColor);
    let rp = new Rule("+", undefined, turnRight);
    let rm = new Rule("-", undefined, turnLeft);
    let rB = new Rule("B", undefined, s => color(s,[140/255, 80/255, 60/255]));
    let rG = new Rule("G", undefined, s => color(s,[24/255, 180/255, 24/255]));
    let rL = new Rule("L", undefined, s => color(s,[48/255, 220/255, 48/255]));
    let rs = new Rule("[", undefined, push);
    let rl = new Rule("]", undefined, pop);

    return new Fractal(axiom, 22.5, scale, step, rf, rp, rm, rs, rl, rB, rG, rL);
  }

  parametricTree(scale = [1,1,1], step = 1.0){
  
    let axiom = "BA";
    let R = 1.456;
    // let rA = new Rule("A", ['F',1,'[','+','A',']','[','-','A',']' ], forward);
    // let rA = new Rule("A", ['F', 1,..."[+A][-A]"], forward);
    let rA = new Rule("A", "F1G[+A][-A]", forwardColor);
    let rF = new Rule("F", (s) => ['B','F', s*R], forwardColorVal, true);
    let rC = new Rule("C", undefined, s => color(s, [0,0.5,0.5]));
    let rs = new Rule("[", undefined, push);
    let rl = new Rule("]", undefined, pop);
    let rp = new Rule("+", undefined, turnRight);
    let rm = new Rule("-", undefined, turnLeft);
    let rB = new Rule("B", undefined, s => color(s,[140/255, 80/255, 60/255]));
    let rG = new Rule("G", undefined, s => color(s,[24/255, 180/255, 24/255]));
    let rL = new Rule("L", undefined, s => color(s,[48/255, 220/255, 48/255]));
    

    return new Fractal(axiom, 85, scale, step, rA, rF, rs, rl,rp,rm,rB,rG, rL);
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

  buildParametic(iteration, soucre = this.axiom){

    if(iteration <= 0){

      for(let i = 0; i < soucre.length; i++){
        let r = this.rules.get(soucre[i]);

        if(r.valuFunction){
          r.func(this.state, soucre[++i]);
        }else{
          r.func(this.state);
        }
      }
      
    }else{
      for(let i = 0; i < soucre.length; i++){
       
        let r = this.rules.get(soucre[i]);
        if(r.succ === undefined){
          r.func(this.state);
        }else if(r.valuFunction){
          this.buildParametic(iteration-1, r.succ(soucre[++i]));
        }else{
          this.buildParametic(iteration-1, r.succ);
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
  let instanceColors = [];

  let s = 1.1;
  let step = 1;
  uniforms.step = step;
  let thickness = step/8.0;



  let factory = new FractalFactory();

  //let fractal = factory.bushCCol([s, s, s], step);
  //let soy = fractal.build(5);

  let fractal = factory.parametricTree([s, s, s], step);
  let soy = fractal.buildParametic(6);

  //build fractal
  //draw fractal
  
  instanceWorlds = soy;

  numInstances = soy.length / 16;

  console.log("instances: " + numInstances);

  for (let i = 0; i < numInstances; ++i) {

  
    //m4.translate(mat,[0, step, 0], mat); 
    //instanceWorlds.push(...mat);

   // instanceColors.push(rand(1), rand(1), rand(1));
    instanceColors.push(0.0, 0.5, 0.5);
  }

  instanceColors = fractal.state.colors;

  const arrays = twgl.primitives.createCylinderVertices(thickness,step,9,1);
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
    console.log("multiplyer: " + multiplier);
    twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.384314, 0.454902, 0.494118, 1);
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 700;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    let radius =  350;
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


