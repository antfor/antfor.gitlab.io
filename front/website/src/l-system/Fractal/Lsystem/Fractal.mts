
import {State, Vec3} from './State.mjs';
import {Rule, pred, value, valuFunction} from './Rule.mjs';


class Fractal {
  private axiom: pred;
  private rules: Map<pred, Rule>;
  private stateSettings: [number, Vec3, number, Vec3];
  public state: State;
  public build: (i: number, a?: pred) => number[];

  constructor(axiom:pred, angle:number, scale:Vec3, step:number, dir:Vec3, ...rules:Rule[]) {
    this.axiom = axiom;
    this.rules = new Map<pred, Rule>();
    this.state = new State(angle, scale ,step, dir);
    this.stateSettings = [angle, scale, step, dir];
    let parametic = false;
    for (const rule of rules) {
      this.rules.set(rule.pred, rule);
      parametic ||= rule.valuFunction;
    }

    
    if(parametic){
      this.build = (i,a= this.axiom) => this.#buildParametic(i,a);
    }else{
      this.build = (i,a= this.axiom) =>  this.#buildNonParametic(i,a); 
    }

  }

  clear(){
    this.state.reset(...this.stateSettings);
  }

  getY(){
    return [this.state.minY, this.state.maxY, this.state.maxY - this.state.minY];
  }

  private getRule(pred:pred):Rule{
    return this.rules.get(pred) as Rule;
  }

  #buildNonParametic(iteration: number, soucre:pred = this.axiom){

    if(iteration <= 0){

      for(const c of soucre as string){
        this.getRule(c).func(this.state);
      }
      
    }else{
      for(const c of soucre as string){

        const r = this.getRule(c);
        if(r.succ === undefined){
          r.func(this.state);
        }else{
          this.#buildNonParametic(iteration-1, r.succ as pred);
        }
      }
    }
    
    return this.state.saveStates;
  }

  #buildParametic(iteration: number, soucre:pred = this.axiom){

    if(iteration <= 0){

      for(let i = 0; i < soucre.length; i++){
        const r = this.getRule(soucre[i] as pred);

        if(r.valuFunction){
          r.func(this.state, (soucre[++i] as value));
        }else{
          r.func(this.state);
        }
      }
      
    }else{
      for(let i = 0; i < soucre.length; i++){
        
        const r = this.getRule(soucre[i] as pred);
        if(r.succ === undefined && !r.valuFunction){
          r.func(this.state);
        }else if(r.succ === undefined && r.valuFunction){
          r.func(this.state, soucre[++i] as value);
        }else if(r.valuFunction){
          const vf = r.succ as valuFunction;
          this.#buildParametic(iteration-1, vf(soucre[++i] as value));
        }else{
          this.#buildParametic(iteration-1, r.succ as pred);
        }
      }
    }
    
    return this.state.saveStates;
  }
  
}

export {Fractal};