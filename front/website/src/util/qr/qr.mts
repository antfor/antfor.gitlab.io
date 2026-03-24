import {BitStream} from './BitStream.mjs'

const URL = "www.wikipedia.org" //"https://anton-forsberg.com"

enum ECC {
    H = 4
}

function genQR(url=URL){

    const encoder = new TextEncoder();
    const bytes = encoder.encode(url);

    console.log("URl:",url)
    console.log("bytes:",bytes)

    const v = getVersion(bytes.length);

    console.log("version:",v);

    const stream = bitStream(bytes, v);

    console.log("byteStream:", stream);

    return v;
}


function codewordCount(v:number){

    //only H for now ...
    const tot_num_codewords = [26,44,70,100,134,172,196,242,
                     292,346,404,466,532,581,
                     655,733,815,901,991,1085,
                     1156,1258,1364,1474,1588,1706,
                     1828,1921,2051,2185,2323,2465,
                     2611,2761,2876,3034,3196,3362,
                     3532,3707]

    const H_codewords = [17,28,44,64,88,112,130,156,
                        192,224,264,308,352,384,
                        432,480,532,588,650,700,
                        750,816,900,960,1050,1110,
                        1200,1260,1350,1440,1530,1620,
                        1710,1800,1890,1980,2100,2220,
                        2310,2420]

    return tot_num_codewords[v-1] - H_codewords[v-1];
}

function getVersion(n:number){

    const byteCount = (v: number) => v < 10 ? 8 : 16;

    const Breq = (v: number) => Math.ceil(((4 + byteCount(v) + 8*n)/8));

    for(let v = 1; v <= 40; v++){

        const capacity = codewordCount(v);

        const required_bytes = Breq(v);

        if(required_bytes <= capacity){
            return v;
        }
    }

    return -1;
}


function bitStream(bytes:Uint8Array, v:number){
    const bitStream = new BitStream();
    const byteCount = (v: number) => v < 10 ? 8 : 16;

    bitStream.write(0b0100, 4);
    bitStream.write(bytes.length, byteCount(v));

    let R = 8 * codewordCount(v) - (4+byteCount(v)+bytes.length * 8);

    bitStream.writeArr(bytes, 8);

    bitStream.write(0,Math.min(4,R));
    R -= Math.min(4,R);
    R -= bitStream.padBoundary();

    const padding = [0xEC,0x11];
    bitStream.writeFun((i)=>padding[i%2],R, 8);

    return bitStream.getBuffer()
}

function errorCorrecton(codeWord:Uint8Array, v:number){

}

genQR()