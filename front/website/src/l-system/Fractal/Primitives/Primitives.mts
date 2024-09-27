
import * as twgl from 'twgl.js';

const v3 = twgl.v3;

type Vec3 = [number,number,number];

function calcNormal(ver1:Vec3, ver2:Vec3, ver3:Vec3):Vec3{
    const N:Vec3 = [0,0,0];
    const A = v3.subtract(ver2,ver1);
    const B = v3.subtract(ver3,ver1);
    v3.cross(A,B, N);
    v3.normalize(N,N);

    return N;
}

function createTetrahedron(L:number):twgl.Arrays{

    const h = L * Math.sqrt(2/3);
    const p1 = L*Math.sqrt(3)/6;
    const p2 = L*0.5;
    const p3 = L*1/Math.sqrt(3);

    const ver1:Vec3 = [0,-h,p3];
    const ver2:Vec3 = [-p2,-h,-p1];
    const ver3:Vec3 = [p2,-h,-p1];
    const ver4:Vec3 = [0,0,0];

    const nor1 = calcNormal(ver1,ver4,ver2);
    const nor2 = calcNormal(ver2,ver4,ver3);
    const nor3 = calcNormal(ver3,ver4,ver1);
    const nor4 = calcNormal(ver1,ver2,ver3);


    const arrays: twgl.Arrays = {
        position: [ver1,ver4,ver2,ver2,ver4,ver3,ver3,ver4,ver1,ver1,ver2,ver3].flat(),
        normal:   [nor1,nor1,nor1,nor2,nor2,nor2,nor3,nor3,nor3,nor4,nor4,nor4].flat(),
        indices:  [0,1,2,3,4,5,6,7,8,9,10,11],
    };

    return arrays;
}


export { createTetrahedron };