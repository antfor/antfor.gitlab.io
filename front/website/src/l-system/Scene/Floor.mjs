import * as twgl from 'twgl.js';


const m4 = twgl.m4;


const vs = `
#version 300 es

uniform mat4 u_MVP;
uniform mat4 u_NormalMatrix;
uniform mat4 u_LightMatrix;
uniform float posY;
uniform mat4 u_Model;

in vec4 position;
in vec3 normal;

out vec4 v_position;
out vec3 v_normal;
out vec3 shadowMapCoord;

void main() {

  vec4 pos = position;
  pos.y += posY;

  v_normal = (u_NormalMatrix * vec4(normal, 0)).xyz;
  v_position = pos;

  vec4 lightPos = u_LightMatrix * u_Model * pos;
  vec3 lightPosDNC = lightPos.xyz / lightPos.w;
  shadowMapCoord = vec3(0.5) + lightPosDNC * 0.5;

  gl_Position = u_MVP * pos;
}`;

const fs = `
#version 300 es
precision highp float;

uniform sampler2D shadowMapTex;
uniform float scale;
uniform float size;

in vec3 v_normal;
in vec4 v_position;
in vec3 shadowMapCoord;

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

  float col = 0.2f + 0.05f * checker(v_position.xz*scale/size);
  vec4 diffuseColor = vec4(col, col, col, 1.0);

  vec4 depth = texture(shadowMapTex, shadowMapCoord.xy);
  float shadowCoeff = 1. - smoothstep(0.002, 0.003, shadowMapCoord.z - depth.r);\n\
  shadowCoeff = depth.r <= 0.0 ? 1.0 : shadowCoeff;

  //outColor = vec4(depth);
  outColor = vec4(diffuseColor.xyz * 0.7 + 0.3 * diffuseColor.xyz * shadowCoeff,1.0);
}
`;

//ShadowProgram
const shadowVs = `
#version 300 es

uniform mat4 u_MVP;
uniform float posY;

in vec4 position;

void main() {

  vec4 pos = position;
  pos.y += posY;
  pos = u_MVP * pos;

  gl_Position = pos;
}`;

const shadowFs = `
#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(vec3(gl_FragCoord.z), 1.0);
}
`;

class Floor{

    constructor(gl, size = 1, grid = 2, posY = -6.5, shadowMapTex=null){
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
        this.shadowProgramInfo = twgl.createProgramInfo(gl, [shadowVs, shadowFs]);

        this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, size, size);
       
        this.model = m4.scaling([size, 1, size]);
        
        this.uniforms = {
            size: size,
            scale: grid,
            posY: posY,
            shadowMapTex: shadowMapTex,
        };
        
    }
    
    draw(gl, viewProjection, drawShadowMap=false, lightMatrix=undefined){

      if(drawShadowMap){
        this.drawFloor(gl, viewProjection, this.shadowProgramInfo);
      }else{
        this.uniforms.u_LightMatrix = lightMatrix;
        this.drawFloor(gl, viewProjection);
      }

    }

    drawFloor(gl, viewProjection, programInfo=this.programInfo){

      gl.useProgram(programInfo.program);
      this.uniforms.u_NormalMatrix = m4.transpose(m4.inverse(this.model));
      this.uniforms.u_MVP = m4.multiply(viewProjection, this.model);
      this.uniforms.u_Model = this.model;

      twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
      twgl.setUniforms(programInfo, this.uniforms);
      twgl.drawBufferInfo(gl, this.bufferInfo);
    }
}

export {Floor};