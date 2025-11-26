import {m4, v3} from 'twgl.js';
import {State, Vec3} from './State.mts';


function push(state:State){

    const m = state.getMat();
    state.push(...m);
  
}
  
  function pop(state:State){
  
    state.pop();
  }
  
  function forwardVal(state:State, val:number){
    
    const m = state.getMat();
    const scale = m4.scaling([state.width, val, state.width]);  //todo scale instead of scale and multiply
    m4.multiply(m, scale, scale);
    state.save(...scale); 
    m4.translate(m,v3.mulScalar(state.dir, val * state.step),m);
    state.update(...m);
  }
  
  // F
  function forward(state:State){
    forwardVal(state, 1);
  }
  
  
  function forwardColorVal(state:State, val:number){
    forwardVal(state, val);
    state.pushColor(...state.color);
 }
  
  function forwardColor(state:State){
    forwardColorVal(state, 1);
  }
  
  // f Forward without drawing
  function translateVal(state:State, val:number){
    const m = state.getMat();
    m4.translate(m,v3.mulScalar(state.dir, val * state.step),m);
    state.update(...m);
  }
  
  // f
  function translate(state:State){
    translateVal(state, 1);
  }

  function translateVec(state:State, Vec:Vec3){
    const m = state.getMat();
    v3.mulScalar(Vec, state.step, Vec);
    m4.translate(m, Vec, m);
    state.update(...m);
  }
  
  
  // +-
  function yaw(state:State, angle: number){
    const m = state.getMat();
    m4.rotateZ(m, angle * Math.PI/180.0, m);
    state.update(...m);
  }
  
  // ^& 
  function pitch(state:State, angle: number){
    const m = state.getMat();
    m4.rotateX(m, angle * Math.PI/180.0, m);
    state.update(...m);
  }
  
  // \/
  function roll(state:State, angle:number){
    const m = state.getMat();
    m4.rotateY(m, angle * Math.PI/180.0, m);
    state.update(...m);
  }
  
  //|
  function turnAround(state:State){
    yaw(state, 180);
  }
  
  //+
  function turnRight(state:State){
    yaw(state, state.angle);
  }
  
  //-
  function turnLeft(state:State){
    yaw(state, -state.angle);
  }
  
  //Cn
  function color(state:State, RGB:Vec3){
    state.color.set(RGB);
  }
  
  function vert(state:State){
  
    const m = state.getMat();
    
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const H:Vec3 = m4.getAxis(m, 1) as unknown as Vec3; //todo
    v3.normalize(H,H);
    const V = [0,1,0];
    const L = v3.cross(H, V);
    v3.normalize(L, L);
    const U = v3.cross(H, L);
  
    m4.setAxis(m, L, 0, m);
    m4.setAxis(m, U, 2, m);
    state.update(...m);  
  
  }
  
  //! 
  function width(state:State, width:number){
    state.width = width;
  }
  
  function tf(T:Vec3, e:number, f:(state:State, val:number)=>void, state:State, val:number){
    
    tropismVal(T, e, f, state, val);
  
  }
  
  //f foward function
  function tropismVal(T:Vec3, e:number, f:(state:State, val:number)=>void, state:State, val:number){
  
    e = 1;
    f(state, val*e);
    v3.cross(T, T);
    /*
    import * as twgl from 'twgl.js';

// Correct orientation vector H based on tropism vector T
function applyTropismCorrection(H, T, e) {
  // Normalize input vectors
  const hNorm = twgl.v3.normalize(H);
  const tNorm = twgl.v3.normalize(T);

  // Compute cross product and its magnitude
  const cross = twgl.v3.cross(hNorm, tNorm);
  const alpha = e * twgl.v3.length(cross);

  // Compute corrected vector H'
  const correction = twgl.v3.scale(tNorm, alpha);
  const H_prime = twgl.v3.add(hNorm, correction);
  return twgl.v3.normalize(H_prime);
    */

    /*
    let m = state.getMat();
    let H = m4.getAxis(m,1); //todo returns vioid
    let axis = v3.cross(H, T);
    let angle = v3.length(axis)*e;
  
    if(Math.abs(angle) > 0.0001 ){ 
      angle *= 1.0;
     
      //???? 
      //m4.axisRotate(m, axis, angle * Math.PI/180.0, m); //* Math.PI/180.0
      //let rot  = m4.axisRotation(axis, angle * Math.PI/180.0 );
      //m4.multiply(m, rot, m);
      //v3.normalize(T,T);
      //v3.mulScalar(T, val * Math.sin(angle), T);
      //m4.translate(m, T ,m);
      state.update(...m);
    }
    //f(state, val);
    */
  }
  
  function scaleVal(state:State, scaleVec:Vec3){
    const m = state.getMat();
    m4.scale(m, scaleVec, m);
    state.update(...m);
  }
  
  //~
  //function shape(state, shape){
  //  state.shape = shape;
  //}
export {push, pop, forward, forwardVal, forwardColor, forwardColorVal, translate, translateVal, yaw, pitch, roll, turnAround, turnRight, turnLeft, color, vert, width, tf, scaleVal, translateVec};