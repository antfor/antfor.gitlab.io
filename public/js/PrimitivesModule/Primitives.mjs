
"use strict";

const v3 = twgl.v3;

function calcNormal(ver1,ver2,ver3){
    let N = [0,0,0];
    let A = v3.subtract(ver2,ver1);
    let B = v3.subtract(ver3,ver1);
    v3.cross(A,B, N);
    v3.normalize(N,N);

    return N;
}

function createTetrahedron(L){

    let h = L * Math.sqrt(2/3);
    let p1 = L*Math.sqrt(3)/6;
    let p2 = L*0.5;
    let p3 = L*1/Math.sqrt(3);

    let ver1 = [0,-h,p3];
    let ver2 = [-p2,-h,-p1];
    let ver3 = [p2,-h,-p1];
    let ver4 = [0,0,0];

    let nor1 = calcNormal(ver1,ver4,ver2);
    let nor2 = calcNormal(ver2,ver4,ver3);
    let nor3 = calcNormal(ver3,ver4,ver1);
    let nor4 = calcNormal(ver1,ver2,ver3);


    const arrays = {
        position: [ver1,ver4,ver2,ver2,ver4,ver3,ver3,ver4,ver1,ver1,ver2,ver3].flat(),
        normal:   [nor1,nor1,nor1,nor2,nor2,nor2,nor3,nor3,nor3,nor4,nor4,nor4].flat(),
        indices:  [0,1,2,3,4,5,6,7,8,9,10,11],
    };

    return arrays;
}


export { createTetrahedron };