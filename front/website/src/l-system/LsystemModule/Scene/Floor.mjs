import * as twgl from 'twgl.js';


const m4 = twgl.m4;


const vs = `
#version 300 es
uniform mat4 u_MVP;
uniform mat4 u_NormalMatrix;
uniform mat4 u_modelView;
uniform mat4 u_lightMatrix;
uniform float posY;

in vec4 position;
in vec3 normal;
in vec2 texcoord;

out vec2 v_position;
out vec3 v_normal;
out vec2 v_texCoord;
out vec3 viewSpacePosition;
out vec4 shadowMapCoord;

void main() {

  vec4 pos = position;
  pos.y += posY;

  v_normal = (u_NormalMatrix * vec4(normal, 0)).xyz;
  v_texCoord = texcoord;
  v_position = pos.xz;
  viewSpacePosition = (u_modelView * pos).xyz;
  shadowMapCoord = u_lightMatrix * vec4(viewSpacePosition.xyz, 1.0);

  gl_Position = u_MVP * pos;
}`;

const fs = `
#version 300 es
precision highp float;

uniform mat4 u_lightMatrix;
uniform sampler2D shadowMapTex;
uniform float scale;
uniform float size;

in vec3 v_normal;
in vec2 v_position;
in vec3 viewSpacePosition;
in vec4 shadowMapCoord;


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

  float col = 0.5f + 0.05f * checker(v_position.xy*scale/size);
  vec4 smc = u_lightMatrix * vec4(viewSpacePosition, 1.f);

	float depth = texture(shadowMapTex, v_position.xy).r;
 
	//float visibility = (depth >= (smc.z / smc.w)) ? 1.0 : 0.0;
  

 // float visibility = textureProj(shadowMapTex, shadowMapCoord).r;

  vec4 diffuseColor = vec4(col, col, col, 1.0);


  outColor = diffuseColor;
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
  outColor = vec4(gl_FragCoord.z);
}
`;

class Floor{

    constructor(gl, size = 1, grid = 2, shadowMapTex=null){
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
        this.shadowProgramInfo = twgl.createProgramInfo(gl, [shadowVs, shadowFs]);



        this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, size, size);
       
        this.model = m4.scaling([size, 1, size]);

        const tex = twgl.createTexture(gl, {
          min: gl.NEAREST,
          mag: gl.NEAREST,
          src: [
            255, 255, 255, 255,
            192, 192, 192, 255,
            192, 192, 192, 255,
            255, 255, 255, 255,
          ],
        });
        
        this.uniforms = {
            size: size,
            scale: grid,
            posY: -6.5,
            shadowMapTex: shadowMapTex,
        };
        
    }
    
    draw(gl, view, viewProjection, drawShadowMap=false, lightMatrix=undefined, ){

      if(drawShadowMap){
        this.drawFloor(gl, view, viewProjection, this.shadowProgramInfo);
      }else{
        this.uniforms.u_lightMatrix = lightMatrix;
        this.drawFloor(gl, view, viewProjection);
      }

    }

    drawFloor(gl, view, viewProjection, programInfo=this.programInfo){

      gl.useProgram(programInfo.program);
      this.uniforms.u_NormalMatrix = m4.transpose(m4.inverse(this.model));
      this.uniforms.u_MVP = m4.multiply(viewProjection, this.model);
      this.uniforms.u_modelView = m4.multiply(view ,this.model);

      twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
      twgl.setUniforms(programInfo, this.uniforms);
      twgl.drawBufferInfo(gl, this.bufferInfo);
    }
}

export {Floor};