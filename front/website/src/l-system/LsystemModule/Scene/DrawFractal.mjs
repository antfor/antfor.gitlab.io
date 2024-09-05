import * as twgl from 'twgl.js';

const vs = `
uniform mat4 u_viewProjection;
uniform float step;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;
attribute mat4 u_LightMatrix;

varying vec3 v_normal;
varying vec4 v_color;
varying vec3 shadowMapCoord;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  v_color = instanceColor;
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;

  vec4 lightPos = u_LightMatrix * instanceWorld * pos;
  vec3 lightPosDNC = lightPos.xyz / lightPos.w;
  shadowMapCoord = vec3(0.5) + lightPosDNC * 0.5;

  gl_Position = u_viewProjection * instanceWorld * pos;
  
}
`;
const fs = `
precision highp float;

uniform sampler2D shadowMapTex;

varying vec3 v_normal;
varying vec4 v_color;
varying vec3 shadowMapCoord;

uniform vec3 u_lightDir;

void main() {
  vec3 a_normal = normalize(v_normal);
  float light = dot(u_lightDir, a_normal) * .5 + .5;
  vec3 defuse = v_color.rgb * light;

  vec4 depth = texture2D(shadowMapTex, shadowMapCoord.xy);
  float shadowCoeff = 1. - smoothstep(0.002, 0.003, shadowMapCoord.z - depth.r);\n\

  if (depth.r <= shadowMapCoord.z){
    //gl_FragColor = vec4(0.,1.,0.,1.); // GREEN
    //return;
  }
  if(a_normal.y < 0.0){
    gl_FragColor = vec4(1.0,0.0,0.0, v_color.a);
    return;
  }
  //gl_FragColor = vec4(defuse, v_color.a);
  gl_FragColor = vec4(a_normal * shadowCoeff, v_color.a);
  //gl_FragColor = vec4(depth.xyz, v_color.a);
}
`;

const shadowVs = `
uniform mat4 u_viewProjection;
uniform float step;

attribute mat4 instanceWorld;
attribute vec4 position;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  gl_Position = u_viewProjection * instanceWorld * pos;
}
`;
const shadowFs = `
precision highp float;

//out vec4 outColor;

void main() {
  gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
  //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`;

const m4 = twgl.m4;
const v3 = twgl.v3;

class DrawFractal {
  constructor(gl, fractal, step, primitives, sunPosition, shadowMapTex=null) {
      
    this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    this.shadowProgramInfo = twgl.createProgramInfo(gl, [shadowVs, shadowFs]);

    this.setFractal(fractal);

    this.uniforms = {
        u_lightDir: v3.normalize(sunPosition),
        step: step,
        shadowMap: shadowMapTex,
    };

    this.arrays = primitives;

  }

  setFractal(fractal) {
    this.fractal = fractal;
  }

  build(gl, iterations){

    this.instanceWorlds = this.fractal.buildParametic(iterations);
    this.numInstances = this.instanceWorlds.length / 16;
    this.instanceColors = this.fractal.state.colors; //get colors from fractal

    Object.assign(this.arrays, {
      instanceWorld: {
        numComponents: 16,
        data: this.instanceWorlds,
        divisor: 1,
      },
      instanceColor: {
        numComponents: 3,
        data: this.instanceColors,
        divisor: 1,
      },
    });

    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays);

  }

  draw(gl, viewProjection, drawShadowMap=false, lightMatrix=undefined) {

    if(drawShadowMap){
        this.drawFractal(gl, viewProjection, this.shadowProgramInfo);
    }else{
        this.uniforms.u_LightMatrix = lightMatrix;
        this.drawFractal(gl, viewProjection);
    }
    
  }

  drawFractal(gl, viewProjection, programInfo=this.programInfo) {

    gl.useProgram(programInfo.program);

    this.uniforms.u_viewProjection = viewProjection;

    const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, this.bufferInfo);
    twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    twgl.setUniforms(programInfo, this.uniforms);
    gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, this.numInstances);
  }

}

export {DrawFractal};