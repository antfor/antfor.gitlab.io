
import {State} from './State.mjs';

"use strict";

class Fractal {

    constructor(axiom, angle, scale, step, dir, ...rules) {
      this.axiom = axiom;
      this.rules = new Map();
      this.state = new State(angle, scale ,step, dir);
      this.stateSettings = [angle, scale, step, dir];
      let parametic = false;
      for (let rule of rules) {
        this.rules.set(rule.pred, rule);
        parametic ||= rule.valuFunction;
      }

      
     if(parametic){
        this.build = (i,a= this.axiom) => this.buildParametic(i,a);
      }else{
        this.build = (i,a= this.axiom) =>  this.buildNonParametic(i,a); 
      }
  
    }

    clear(){
      this.state.reset(...this.stateSettings);
    }

    getY(){
      return [this.state.minY, this.state.maxY, this.state.maxY - this.state.minY];
    }
  
    buildNonParametic(iteration, soucre = this.axiom){
  
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
            this.buildNonParametic(iteration-1, r.succ);
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