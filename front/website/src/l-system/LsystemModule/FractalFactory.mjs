import {Rule} from './Rule.mjs';
import { Fractal } from './Fractal.mjs';
import { push, pop, forward, forwardVal, forwardColor, forwardColorVal, translate, translateVal, yaw, pitch, roll, turnAround, turnRight, turnLeft, color, vert, width, tf, scaleVal, translateVec} from './Turtle.mjs';

"use strict";

class FractalFactory {

    constructor() {
     
    }
  
    dragon(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let axiom = "Rf";
      let rf = new Rule("f", "f+y+", forwardColor);
      let ry = new Rule("y", "-f-y", forwardColor);
      let rp = new Rule("+", undefined, turnRight);
      let rm = new Rule("-", undefined, turnLeft);
      let cr = new Rule("R", undefined, s => color(s,[1,0,0]));
      return new Fractal(axiom, 90, scale, step, dir, rf, ry, rp, rm, cr);
  
    }

    kochSnowflake(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let axiom = "*F--F--F";
      let rf = new Rule("F", "F+F--F+F", forwardColor);
      let rp = new Rule("+", undefined, turnRight);
      let rm = new Rule("-", undefined, turnLeft);
      let rt = new Rule("*", undefined,s => yaw(s, 30));
      return new Fractal(axiom, 60, scale, step, dir, rf, rp, rm, rt);
    }
  
    bushC(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let axiom = "F";
      let rf = new Rule("F", "FF-[-F+F+F]+[+F-F-F]", forwardColor);
      let rp = new Rule("+", undefined, turnRight);
      let rm = new Rule("-", undefined, turnLeft);
      let rs = new Rule("[", undefined, push);
      let rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rs, rl);
    }
  
    bushCParCOl(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let axiom = "F";
      let rf = new Rule("F", ['C',[140/255, 80/255, 60/255],..."FFC",[24/255, 180/255, 24/255],..."-[-F+F+F]C",[48/255, 220/255, 48/255],..."+[+F-F-F]"], forwardColor);
      let rc = new Rule("C", undefined, color, true);
      let rp = new Rule("+", undefined, turnRight);
      let rm = new Rule("-", undefined, turnLeft);
      let rs = new Rule("[", undefined, push);
      let rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rc, rs, rl);
    }
  
    bushCCol(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let axiom = "F";
      let rf = new Rule("F", "BFF-G[-F+F+F]+L[+F-F-F]", forwardColor);
      let rp = new Rule("+", undefined, turnRight);
      let rm = new Rule("-", undefined, turnLeft);
      let rB = new Rule("B", undefined, s => color(s,[140/255, 80/255, 60/255]));
      let rG = new Rule("G", undefined, s => color(s,[24/255, 180/255, 24/255]));
      let rL = new Rule("L", undefined, s => color(s,[48/255, 220/255, 48/255]));
      let rs = new Rule("[", undefined, push);
      let rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rs, rl, rB, rG, rL);
    }
  
    parametricTree(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
    
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
      
  
      return new Fractal(axiom, 85, scale, step, dir, rA, rF, rs, rl,rp,rm,rB,rG, rL);
    }
  
    treeTernary(scale = [1,1,1], step = 1.0, dir = [0,1,0], lr, vr, d1, d2, a, T, e){
  
      let axiom = ['B','!',1,'F',200,'/', 45,'A'];
      let rA = new Rule("A",['!',vr,'F',50,'[','&',a,'F',50,'A',']','/',d1,'[','&',a,'F',50,'A',']','/',d2,'[','&',a,'F',50,'A',']'],(s) => {});
      let rF = new Rule("F", l => ['F', l * lr], (s,val) => tf(T, e, forwardColorVal,s, val) , true);
      let rw = new Rule("!",w => ['!', w * vr], (s,val)=>{} , true); //width
      let rs = new Rule("[", undefined, push);
      let rl = new Rule("]", undefined, pop);
      let rp = new Rule("/", undefined, (s,a) => roll(s,-a), true);
      let rm = new Rule("&", undefined, pitch, true);
      let rB = new Rule("B", undefined, s => color(s,[140/255, 80/255, 60/255]));
      let rG = new Rule("G", undefined, s => color(s,[24/255, 180/255, 24/255]));
  
      return new Fractal(axiom, 0, scale, step, dir, rA, rF, rw, rs, rl, rp, rm, rB, rG);
    }
  
    ternaryTreeA(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let d1 =94.74;
      let d2 =132.63;
      let a = 18.95;
      let lr = 1.109;
      let vr = 1.732;
      let T = [0,-1,0];
      let e =0.22;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    ternaryTreeD(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let d1 =180.0;
      let d2 =252.0;
      let a = 36.0;
      let lr = 1.07;
      let vr = 1.732;
      let T = [-0.51,0.77,-0.19];
      let e =0.4;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    ternaryTreeT(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
      let d1 =120.0;
      let d2 =120.0;
      let a = 90.0;
      let lr = 1.07;
      let vr = 1.732;
      let T = [0,-1,0];
      let e =1.0;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    sympodialTree(scale = [1,1,1], step = 1.0, dir = [0,1,0], r1,r2,a1,a2,wr=0.707){
  
      let axiom = ['A', [1,1]];
      //A,B,F,!,-,+,/,&,[,],$
      let rA = new Rule("A", lw =>['!', lw[1], 'F', lw[0], '[','&',a1,'B',[lw[0]*r1,lw[1]*wr],']',
                                  '/',180,'[','&',a2, 'B',[lw[0]*r2,lw[1]*wr],']'] ,(s,val) => {},true); //(s, lw) =>forwardColor(s,lw[0])
      let rB = new Rule("B", lw =>['!', lw[1], 'F', lw[0], '[','+',a1,'$','B',[lw[0]*r1,lw[1]*wr], ']',
                                    '[','-',a2,'$','B',[lw[0]*r2,lw[1]*wr],']'], (s,val) => {},true);
      let rF = new Rule("F", undefined, (s,val) => forwardColorVal(s,val), true);
      let rw = new Rule("!",undefined, width, true); //width
      let rs = new Rule("[", undefined, push);
      let rl = new Rule("]", undefined, pop);
      let rr = new Rule("/", undefined, (s,a) => roll(s,a), true); //roll
      let rp = new Rule("&", undefined, pitch, true);
      let rm = new Rule("-", undefined, (s,a)=>yaw(s,-a), true);
      let radd = new Rule("+", undefined, yaw, true);
      let rV = new Rule("$", undefined, vert); 
  
  
      return new Fractal(axiom, 0, scale, step, dir, rA, rB, rF, rw, rs, rl, rr, rp, rm, radd, rV);
  
    }
  
    sympodialTreeA(scale = [1,1,1], step = 1.0, dir = [0,1,0]){
  
      let r1 = 0.9;
      let r2 = 0.7;
      let a1 = 5;
      let a2 = 65;
      let wr = 0.707;
      return this.sympodialTree(scale, step, dir, r1, r2, a1, a2, wr);
    }

    sierpinskitetrahedron(scale = [1,1,1], L = 1.0, dir = [0,-1,0]){

      let a = Math.sqrt(3)/6 /Math.sqrt(2/3);
      let b = 0.5/Math.sqrt(2/3);
      let c = 1/Math.sqrt(3)/Math.sqrt(2/3);
      let axiom = "YS1F";
      let rF = new Rule("F", "F[AF][BF][CF]f", forwardColor);
      let rS = new Rule("S", (v) => ['S', v/2], (s,v) => scaleVal(s,[v,v,v]), true);
      let rf = new Rule("f", "ff", translate);
      let rA = new Rule("A", "AA", s => translateVec(s, [b,0,-a]));
      let rB = new Rule("B", "BB", s => translateVec(s, [-b,0,-a]));
      let rC = new Rule("C", "CC", s => translateVec(s, [0,0, c]));
      let rp = new Rule("[", undefined, push);
      let re = new Rule("]", undefined, pop);
      let cy = new Rule("Y", undefined, s => color(s,[246/255,	178/255,	107/255]));
      let step = L * Math.sqrt(2/3);
   
      return new Fractal(axiom, 0, scale, step, dir, rF, rA, rB, rC, rp, re, rf, rS, cy);
    }
  
  }

  "F[AF][BF][CF]fF[AF][BF][CF]"
export {FractalFactory};