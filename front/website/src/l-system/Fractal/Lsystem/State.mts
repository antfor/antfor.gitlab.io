
import {m4} from 'twgl.js';


export type Vec3 = [number,number,number];
type stack = number[]


export class State{

    public dir!: Float32Array;
    public angle!: number;
    public step!: number;
    public width!: number;
    public stack!: stack;
    public saveStates!: stack;
    public color!: Float32Array;
    public colors!: stack;
    public minY!: number;
    public maxY!: number;

    constructor(angle:number, scale:Vec3, step:number, dir:Vec3 = [0,1,0]) {
      this.reset(angle, scale, step, dir);
    }
  
    update(...mat:stack){
      this.stack.splice(-mat.length,mat.length,...mat);
    }
  
    pop(n=16){
      this.stack.splice(-n);
    }
  
    push(...mat:stack){
      this.stack.push(...mat);
    }
  
    pushColor(...col:stack){
      this.colors.push(...col);
    }
  
    getMat(n=16){
      return this.stack.slice(-n);
    }
  
    save(...mat:stack){
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
      this.color = new Float32Array([0,0.5,0.5]);
      this.colors = [];
      this.minY = Number.POSITIVE_INFINITY;
      this.maxY = Number.NEGATIVE_INFINITY;
    }
}