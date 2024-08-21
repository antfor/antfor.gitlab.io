import {
    log, sqrt, erf, exp
  } from 'mathjs'

// cumulative distribution function
function N(x, mu = 0, sigma = 1){

    let z = (x - mu) / (sqrt(2) * sigma);
    return 0.5 * (1 + erf(z));
}

/*
    * St: Stock price at time t
    * K: Strike price
    * r: Risk-free rate
    * T: Time of expiration
    * sigma: Volatility
    * t: current time
*/
function Call(St, K, r, T, sigma, t=0){
    let tau = T-t;
    let dp = 1/(sigma*  sqrt(tau)) * ( log(St/K)+(r + sigma ** 2 / 2)*tau);
    let dm = dp - sigma* sqrt(tau);

    return N(dp) * St - N(dm) * K *  exp(-r * tau);
}

/*
    * St: Stock price at time t
    * K: Strike price
    * r: Risk-free rate
    * T: Time of expiration
    * sigma: Volatility
    * t: current time
*/
function Put(St, K, r, T, sigma, t=0){
    
    let tau = T-t;
    let callPrice = Call(St, K, r, T, sigma, t);

    return K* exp(-r*tau) - St + callPrice;
}

export {Call, Put};