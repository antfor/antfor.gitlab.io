import * as twgl from 'twgl.js';


const m4 = twgl.m4;


const vs = `
#version 300 es
uniform mat4 u_MVP;
uniform mat4 u_NormalMatrix;

in vec4 position;
in vec3 normal;
in vec2 texcoord;

out vec4 v_position;
out vec3 v_normal;
out vec2 v_texCoord;

void main() {

  vec4 pos = position;
  pos.y -= 6.5;

  v_normal = (u_NormalMatrix * vec4(normal, 0)).xyz;
  v_texCoord = texcoord;
  v_position = pos;
  gl_Position = u_MVP * pos;
}`;

const fs = `
#version 300 es
precision highp float;

uniform sampler2D u_diffuse;
uniform float scale;
uniform float size;

in vec2 v_texCoord;
in vec3 v_normal;
in vec4 v_position;

out vec4 outColor;


float filterwidth(vec2 v)
{
  vec2 fw = max(abs(dFdx(v)), abs(dFdy(v)));
  return max(fw.x, fw.y);
}

vec2 BUMPINT(vec2 x){

    return (floor((x)/2.0) + 2.0 * max(((x)/2.0) - floor((x)/2.0) - .5, 0.0));
}

float checker(vec2 uv)
{
  float width = filterwidth(uv);
  vec2 p0 = uv - .5 * width, p1 = uv + .5 * width;
  
  vec2 i = (BUMPINT(p1) - BUMPINT(p0)) / width;
  return i.x * i.y + (1.0 - i.x) * (1.0 - i.y);
}


void main() {

  float col = 0.1f + 0.05f * checker(v_position.xz*scale/size);
  vec4 diffuseColor = vec4(col, col, col, 1.0);

  //vec3 a_normal = normalize(v_normal);

  outColor = diffuseColor;
}
`;

class Floor{

    constructor(gl, size = 1, grid = 2){
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);


        this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, size, size);
       
        this.model = m4.scaling([size, 1, size]);

        this.uniforms = {
            size: size,
            scale: grid,
        };
        
    }
    
    draw(gl, viewProjection){

        this.uniforms.u_NormalMatrix = m4.transpose(m4.inverse(this.model));
        this.uniforms.u_MVP = m4.multiply(viewProjection, this.model);

        gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, this.uniforms);
        twgl.drawBufferInfo(gl, this.bufferInfo);
    }
}

export {Floor};