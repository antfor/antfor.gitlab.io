import { floorDependencies,create } from 'mathjs/number';

const {floor} = create( {
  floorDependencies
});


function round(n:number, d=0){
    const pow = 10**d;
    return Math.round(n * pow) / pow;
}

function simplifyValue(value:number, decimals:number) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(round(value, decimals)+0); // +0 to remove -0
}


function addBackZeros(value:string, decimals:number){

    const decimalsValue = value.toString().split(".")[1].length;
    const minDecimals = Math.min(decimals, decimalsValue);
    const zeros = ".".repeat(Math.min(1,minDecimals))+"0".repeat(minDecimals);
    return(zeros);
}


function toNumber(value:string){//todo handle negative numbers

    value = value.replace(',', '.');
    value = value.replace(/[^0-9.]/g, '');
    const firstDot = value.indexOf('.');
    value = value.replace(/[.]/g, (_, index) => index === firstDot ? '.' : '');
    
    return(value);
}


function isNaNoE(value:string){
    
    return(isNaN(Number(toNumber(value))) || value === "");
}


function parseFloatSafe(v:string, vDefault=0){
    const n = parseFloat(v);
    if(isNaN(n)){
        return vDefault;
    }
    return n;
}


function formatValue(value:string, decimals:number) {
    
    if(isNaNoE(value)){

        value = toNumber(value);
        if(isNaNoE(value))
            return(value);
    }

    let rounded = floor(parseFloat(value), decimals).toString();

    if(value.slice(-1)==='.'){
        rounded = rounded + ".";
    }else if(Number.isInteger(rounded) && decimals > 0 && value.includes('.')){
        rounded += addBackZeros(value, decimals);
    }

    return(rounded);
}


export { toNumber, formatValue, isNaNoE, simplifyValue, parseFloatSafe};