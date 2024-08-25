import { floor,round,min } from 'mathjs';

function simplifyValue(value, decimals) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(round(value, decimals));
  }

function addBackZeros(value, decimals){

    const decimalsValue = value.toString().split(".")[1].length;
    const minDecimals = min(decimals, decimalsValue);
    const zeros = ".".repeat(min(1,minDecimals))+"0".repeat(minDecimals);
    return(zeros);
}

function formatValue(value, decimals) {
    
    if(isNaNoE(value)){

        value = toNumber(value);
        if(isNaNoE(value))
            return(value);
    }

    let rounded = floor(parseFloat(value), decimals);

    if(value.slice(-1)==='.'){
        rounded = rounded + ".";
    }else if(Number.isInteger(rounded) && decimals > 0 && value.includes('.')){
        rounded += addBackZeros(value, decimals);
    }

    return(rounded);
}

function toNumber(value){

    value = value.replace(',', '.');
    value = value.replace(/[^0-9.]/g, '');
    const firstDot = value.indexOf('.');
    value = value.replace(/[.]/g, (_, index) => index === firstDot ? '.' : '');
    
    return(value);
}

function isNaNoE(value){
    
    return(isNaN(value) || value === "");
}

function parseFloatSafe(v){
    v = parseFloat(v);
    if(isNaN(v)){
        return 0;
    }
    return v;
}



export { toNumber, formatValue, isNaNoE, simplifyValue, parseFloatSafe};