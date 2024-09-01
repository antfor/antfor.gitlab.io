
"use strict";

class Rule {

    constructor(pred, succ, func, val = false) {
      this.pred = pred;
      this.succ = succ;
      this.func = func;
      this.valuFunction = val;
    }
  
}

export {Rule};