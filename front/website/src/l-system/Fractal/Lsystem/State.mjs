
import * as twgl from 'twgl.js';
"use strict";

const m4 = twgl.m4;

class State{

    constructor(angle, scale, step, dir = [0,1,0]) {
      this.reset(angle, scale, step, dir);
    }
  
    update(...mat){
      this.stack.splice(-mat.length,mat.length,...mat);
    }
  
    pop(n=16){
      this.stack.splice(-n);
    }
  
    push(...mat){
      this.stack.push(...mat);
    }
  
    pushColor(...col){
      this.colors.push(...col);
    }
  
    getMat(n=16){
      return this.stack.slice(-n);
    }
  
    save(...mat){
      this.saveStates.push(...mat);
      this.minY = Math.min(this.minY, mat[13]);
      this.maxY = Math.max(this.maxY, mat[13]);
    }
  
    reset(angle=90, scale = [1,1,1], step=1.0, dir = [0,1,0]){
      this.dir = new Float32Array(dir);
      this.angle = angle;
      this.step = step;
      this.width = 1.0;
      this.stack = [...m4.scaling(scale)];
      this.saveStates = [];
      this.numInstances = 0;
      this.color = new Float32Array([0,0.5,0.5]);
      this.colors = [];
      this.minY = Number.POSITIVE_INFINITY;
      this.maxY = Number.NEGATIVE_INFINITY;
    }
  }



  export {State};