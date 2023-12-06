"use strict";
import {State} from './State.mjs';


const m4 = twgl.m4;
const v3 = twgl.v3;

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
    let scale = m4.scaling([state.width, val, state.width]);  //todo scale instead of scale and multiply
    m4.multiply(m, scale, scale);
    state.save(...scale); 
    m4.translate(m, [0, state.step * val, 0], m); //state.dir * state.step * val
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
    m4.translate(m, [0, state.step * val, 0], m); //state.dir * state.step * val
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
  
  function vert(state){
  
    let m = state.getMat();
    let H = m4.getAxis(m,1);
    v3.normalize(H,H);
    let V = [0,1,0];
    let L = v3.cross(H, V);
    v3.normalize(L, L);
    let U = v3.cross(H, L);
  
    m4.setAxis(m, L, 0, m);
    m4.setAxis(m, U, 2, m);
    state.update(...m);  
  
  }
  
  //! 
  function width(state, width){
    state.width = width;
  }
  
  function tf(T, e, f, state, val){
    
    tropismVal(T, e, f, state, val);
  
  }
  
  //f foward function
  function tropismVal(T, e, f, state, val){
  
    f(state, val);
   
    let m = state.getMat();
    let H = m4.getAxis(m,1);
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
    
  }
  
  
  //~
  //function shape(state, shape){
  //  state.shape = shape;
  //}
export {push, pop, forward, forwardVal, forwardColor, forwardColorVal, translate, translateVal, yaw, pitch, roll, turnAround, turnRight, turnLeft, color, vert, width, tf};