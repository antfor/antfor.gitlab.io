import * as twgl from 'twgl.js';


const m4 = twgl.m4;
const v3 = twgl.v3;

const vs = `
uniform mat4 u_viewProjection;
uniform float step;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  gl_Position = u_viewProjection * instanceWorld * pos;
  v_color = instanceColor;
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;
}
`;
const fs = `
precision mediump float;

varying vec3 v_normal;
varying vec4 v_color;

uniform vec3 u_lightDir;

void main() {
  vec3 a_normal = normalize(v_normal);
  float light = dot(u_lightDir, a_normal) * .5 + .5;
  gl_FragColor = vec4(v_color.rgb * light, v_color.a);
  //gl_FragColor = vec4(a_normal, v_color.a);
}
`;

function createShadowProgram(gl){

}

class ShadowProgram{


    constructor(gl){
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    }
    
    draw(gl, arrays, uniforms){
        twgl.setBuffersAndAttributes(gl, this.programInfo, arrays);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(gl, arrays);
    }
}
