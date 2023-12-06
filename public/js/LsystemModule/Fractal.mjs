
import {State} from './State.mjs';

"use strict";

class Fractal {

    constructor(axiom, angle, scale, step, ...rules) {
      this.axiom = axiom;
      this.rules = new Map();
      this.state = new State(angle, scale ,step);
      
      for (let rule of rules) {
        this.rules.set(rule.pred, rule);
      }

      /*
     if(parametic){
        this.build = (i,a= this.axiom) => this.buildParametic(i,a);
        this.buildParametic = undefined;
      }else{
        this.build = (i,a= this.axiom) =>  this.build(i,a);
        this.buildParametic = undefined;
      }
      */
  
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
          if(r.succ === undefined && !r.valuFunction){
            r.func(this.state);
          }else if(r.succ === undefined && r.valuFunction){
            r.func(this.state, soucre[++i]);
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

  export {Fractal};