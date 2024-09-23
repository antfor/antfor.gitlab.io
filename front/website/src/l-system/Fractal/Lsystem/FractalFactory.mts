import {Rule, succ, func} from './Rule.mts';
import {State, Vec3} from './State.mts';
import { Fractal } from './Fractal.mts';
import { push, pop, forwardColor, forwardColorVal, translate, yaw, pitch, roll, turnRight, turnLeft, color, vert, width, tf, scaleVal, translateVec} from './Turtle.mts';
//,forward, forwardVal, translateVal,turnAround

class FractalFactory {

  
    dragon(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const axiom = "Rf";
      const rf = new Rule("f", "f+y+", forwardColor);
      const ry = new Rule("y", "-f-y", forwardColor);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const cr = new Rule("R", undefined, (s:State) => {color(s,[1,0,0])});
      return new Fractal(axiom, 90, scale, step, dir, rf, ry, rp, rm, cr);
  
    }

    kochSnowflake(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const axiom = "*F--F--F";
      const rf = new Rule("F", "F+F--F+F", forwardColor);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const rt = new Rule("*", undefined, (s:State) => {yaw(s, 30)});
      return new Fractal(axiom, 60, scale, step, dir, rf, rp, rm, rt);
    }
  
    bushC(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const axiom = "F";
      const rf = new Rule("F", "FF-[-F+F+F]+[+F-F-F]", forwardColor);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rs, rl);
    }
  
    bushCParCOl(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const axiom = "F";
      const rf = new Rule("F", ['C',[140/255, 80/255, 60/255],..."FFC",[24/255, 180/255, 24/255],..."-[-F+F+F]C",[48/255, 220/255, 48/255],..."+[+F-F-F]"], forwardColor);
      const rc = new Rule("C", undefined, color as func, true);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rc, rs, rl);
    }
  
    bushCCol(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const axiom = "F";
      const rf = new Rule("F", "BFF-G[-F+F+F]+L[+F-F-F]", forwardColor);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const rB = new Rule("B", undefined, (s:State) => {color(s,[140/255, 80/255, 60/255])});
      const rG = new Rule("G", undefined, (s:State) => {color(s,[24/255, 180/255, 24/255])});
      const rL = new Rule("L", undefined, (s:State) => {color(s,[48/255, 220/255, 48/255])});
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
  
      return new Fractal(axiom, 22.5, scale, step, dir, rf, rp, rm, rs, rl, rB, rG, rL);
    }
  
    parametricTree(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
    
      const axiom = "BA";
      const R = 1.456;
    
      const rA = new Rule("A", "F1G[+A][-A]", forwardColor);
      const rF = new Rule("F", ((n:number) => ['B','F', n*R]) as succ, forwardColorVal as func, true);
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
      const rp = new Rule("+", undefined, turnRight);
      const rm = new Rule("-", undefined, turnLeft);
      const rB = new Rule("B", undefined, (s:State) => {color(s,[140/255, 80/255, 60/255])});
      const rG = new Rule("G", undefined, (s:State) => {color(s,[24/255, 180/255, 24/255])});
      const rL = new Rule("L", undefined, (s:State) => {color(s,[48/255, 220/255, 48/255])});
      
  
      return new Fractal(axiom, 85, scale, step, dir, rA, rF, rs, rl,rp,rm,rB,rG, rL);
    }
  
    treeTernary(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0], lr:number, vr:number, d1:number, d2:number, a:number, T:Vec3, e:number){
  
      const axiom = ['B','!',1,'F',200,'/', 45,'A'];
      const rA = new Rule("A",['!',vr,'F',50,'[','&',a,'F',50,'A',']','/',d1,'[','&',a,'F',50,'A',']','/',d2,'[','&',a,'F',50,'A',']'],() => {});
      const rF = new Rule("F", ((l:number) => ['F', l * lr]) as succ, ((s:State,val:number) =>{tf(T, e, forwardColorVal,s, val)}) as func, true);
      const rw = new Rule("!", ((w:number) => ['!', w * vr]) as succ, ()=>{} , true); //width
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
      const rp = new Rule("/", undefined, ((s:State,a:number) => {roll(s,-a)}) as func, true);
      const rm = new Rule("&", undefined, pitch as func, true);
      const rB = new Rule("B", undefined, (s:State) => {color(s,[140/255, 80/255, 60/255])});
      const rG = new Rule("G", undefined, (s:State) => {color(s,[24/255, 180/255, 24/255])});
  
      return new Fractal(axiom, 0, scale, step, dir, rA, rF, rw, rs, rl, rp, rm, rB, rG);
    }
  
    ternaryTreeA(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const d1 =94.74;
      const d2 =132.63;
      const a = 18.95;
      const lr = 1.109;
      const vr = 1.732;
      const T:Vec3 = [0,-1,0];
      const e =0.22;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    ternaryTreeD(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const d1 =180.0;
      const d2 =252.0;
      const a = 36.0;
      const lr = 1.07;
      const vr = 1.732;
      const T:Vec3  = [-0.51,0.77,-0.19];
      const e =0.4;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    ternaryTreeT(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
      const d1 =120.0;
      const d2 =120.0;
      const a = 90.0;
      const lr = 1.07;
      const vr = 1.732;
      const T:Vec3  = [0,-1,0];
      const e =1.0;
      return this.treeTernary(scale, step, dir, lr, vr, d1, d2, a, T, e);
    }
  
    sympodialTree(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0], r1:number,r2:number,a1:number,a2:number,wr=0.707){
  
      const axiom = ['A', [1,1]];
      //A,B,F,!,-,+,/,&,[,],$
      const rA = new Rule("A", ((lw:number[]) =>['!', lw[1], 'F', lw[0], '[','&',a1,'B',[lw[0]*r1,lw[1]*wr],']',
                                  '/',180,'[','&',a2, 'B',[lw[0]*r2,lw[1]*wr],']']) as succ  ,() => {},true); //(s, lw) =>forwardColor(s,lw[0])
      const rB = new Rule("B", ((lw:number[]) =>['!', lw[1], 'F', lw[0], '[','+',a1,'$','B',[lw[0]*r1,lw[1]*wr], ']',
                                    '[','-',a2,'$','B',[lw[0]*r2,lw[1]*wr],']'] ) as succ, () => {},true);
      const rF = new Rule("F", undefined, ((s:State,val:number) => {forwardColorVal(s,val)}) as func, true);
      const rw = new Rule("!",undefined, width as func, true); //width
      const rs = new Rule("[", undefined, push);
      const rl = new Rule("]", undefined, pop);
      const rr = new Rule("/", undefined, ((s:State,a:number) => {roll(s,a)}) as func, true); //roll
      const rp = new Rule("&", undefined, pitch as func, true);
      const rm = new Rule("-", undefined, ((s:State,a:number)=> {yaw(s,-a)}) as func, true);
      const radd = new Rule("+", undefined, yaw as func, true);
      const rV = new Rule("$", undefined, vert); 
  
      return new Fractal(axiom, 0, scale, step, dir, rA, rB, rF, rw, rs, rl, rr, rp, rm, radd, rV);
  
    }
  
    sympodialTreeA(scale:Vec3 = [1,1,1], step = 1.0, dir:Vec3 = [0,1,0]){
  
      const r1 = 0.9;
      const r2 = 0.7;
      const a1 = 5;
      const a2 = 65;
      const wr = 0.707;
      return this.sympodialTree(scale, step, dir, r1, r2, a1, a2, wr);
    }

    sierpinskitetrahedron(scale:Vec3 = [1,1,1], L = 1.0, dir:Vec3 = [0,-1,0]){

      const a = Math.sqrt(3)/6 /Math.sqrt(2/3);
      const b = 0.5/Math.sqrt(2/3);
      const c = 1/Math.sqrt(3)/Math.sqrt(2/3);
      const axiom = "YS1F";
      const rF = new Rule("F", "F[AF][BF][CF]f", forwardColor);
      const rS = new Rule("S", ((v:number) => ['S', v/2]) as succ, ((s:State,v:number) => {scaleVal(s,[v,v,v])}) as func, true);
      const rf = new Rule("f", "ff", translate);
      const rA = new Rule("A", "AA", (s:State) => {translateVec(s, [b,0,-a])});
      const rB = new Rule("B", "BB", (s:State) => {translateVec(s, [-b,0,-a])});
      const rC = new Rule("C", "CC", (s:State) => {translateVec(s, [0,0, c])});
      const rp = new Rule("[", undefined, push);
      const re = new Rule("]", undefined, pop);
      const cy = new Rule("Y", undefined, (s:State) => {color(s,[246/255,	178/255,	107/255])});
      const step = L * Math.sqrt(2/3);
   
      return new Fractal(axiom, 0, scale, step, dir, rF, rA, rB, rC, rp, re, rf, rS, cy);
    }
  
  }

export {FractalFactory, Fractal};