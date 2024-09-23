import * as twgl from 'twgl.js';
import { Fractal } from '../Fractal/Fractal.types.mts';

const vs = `
#version 300 es

uniform mat4 u_viewProjection;
uniform mat4 u_LightMatrix;
uniform mat4 transform;
uniform float step;

in vec3 instanceColor;
in mat4 instanceWorld;
in vec4 position;
in vec3 normal;


out vec3 v_normal;
out vec3 v_color;
out vec3 shadowMapCoord;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  v_color = instanceColor; //vec3(1.0);
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;

  vec4 lightPos = u_LightMatrix * instanceWorld * pos;
  vec3 lightPosDNC = lightPos.xyz / lightPos.w;
  shadowMapCoord = vec3(0.5) + lightPosDNC * 0.5;

  gl_Position = u_viewProjection * transform * instanceWorld * pos;
  
}
`;
const fs = `
#version 300 es
precision highp float;

uniform sampler2D shadowMapTex;
uniform vec3 u_lightDir;

in vec3 v_normal;
in vec3 v_color;
in vec3 shadowMapCoord;

out vec4 outColor;

void main() {
  vec3 a_normal = normalize(v_normal);
  float light = dot(u_lightDir, a_normal) * .5 + .5;
  vec3 defuse = v_color.rgb * light;

  vec4 depth = texture(shadowMapTex, shadowMapCoord.xy);
  float shadowCoeff = 1. - smoothstep(0.003, 0.004, shadowMapCoord.z - depth.r);\n\
  shadowCoeff = depth.r <= 0.0 ? 1.0 : shadowCoeff;
  //if(depth.r +0.003 < shadowMapCoord.z){
  //outColor = vec4(0.0,1.0,0.0, 1.0);
  //return;
  //}

  outColor = vec4(v_color.rgb * 0.7 + 0.3 * defuse * shadowCoeff, 1.0);
}
`;

const shadowVs = `
#version 300 es

uniform mat4 u_viewProjection;
uniform mat4 transform;
uniform float step;

in mat4 instanceWorld;
in vec4 position;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  gl_Position = u_viewProjection * transform * instanceWorld * pos;
}
`;
const shadowFs = `
#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(vec3(gl_FragCoord.z), 1.0);
}
`;

const m4 = twgl.m4;
const v3 = twgl.v3;
type Vec3 = twgl.v3.Vec3;
type Mat4 = twgl.m4.Mat4;
type Arrays = twgl.Arrays;
type GL = WebGL2RenderingContext;
type thiccFunc = (i:number) => number;


export class DrawFractal {

  private fractal?: Fractal;
  private height: number;
  private floor: number;
  private thicknessFunc: thiccFunc;
  private arrays: Arrays;
  private uniforms: {
    u_lightDir: Vec3;
    step: number;
    shadowMapTex: WebGLTexture;
    u_viewProjection?: Mat4;
    u_LightMatrix?: Mat4;
    transform?: Mat4;
  };
  private programInfo: twgl.ProgramInfo;
  private shadowProgramInfo: twgl.ProgramInfo;
  private bufferInfo?: twgl.BufferInfo;
  private instanceWorlds?: number[];
  private numInstances: number;
  private instanceColors?: number[];
  private thickness: number;

  constructor(gl:GL, fractal:Fractal, step:number, height:number, floor:number, thicknessFunc:thiccFunc, primitives:Arrays, sunPosition:Vec3, shadowMapTex:WebGLTexture) {
      
    this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    this.shadowProgramInfo = twgl.createProgramInfo(gl, [shadowVs, shadowFs]);

    this.setFractal(fractal);

    this.uniforms = {
        u_lightDir: v3.normalize(sunPosition),
        step: step,
        shadowMapTex: shadowMapTex,
    };

    this.thicknessFunc = thicknessFunc;
    this.floor = floor;
    this.height = height;
    this.arrays = primitives;
    this.numInstances = 0;
    this.thickness = 0;

  }

  setFractal(fractal: Fractal){
    this.fractal = fractal;
  }

  build(gl:GL, iterations:number) {

    if(!this.fractal)
      return

    this.instanceWorlds = this.fractal.build(iterations);
    this.numInstances = this.instanceWorlds.length / 16;
    this.instanceColors = this.fractal.state.colors;
    this.thickness = this.thicknessFunc(iterations);

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

  clear(gl:GL) {
    if(this.bufferInfo){

      if(this.bufferInfo.attribs){
        for (const attrib of Object.values(this.bufferInfo.attribs)) {
          gl.deleteBuffer(attrib.buffer);
        }
      }

      if(this.bufferInfo.indices){
        gl.deleteBuffer(this.bufferInfo.indices);
      }
      
      if (this.bufferInfo.indices) {
        gl.deleteBuffer(this.bufferInfo.indices);
      }

      this.bufferInfo = undefined;
    }

    if(this.fractal){
      this.fractal.clear();
    }
  }

  draw(gl:GL, viewProjection:Mat4, drawShadowMap=false, lightMatrix?:Mat4) {

    if(drawShadowMap){
        this.#drawFractal(gl, viewProjection, this.shadowProgramInfo);
    }else{
        this.uniforms.u_LightMatrix = lightMatrix;
        this.#drawFractal(gl, viewProjection);
    }
  }

  #scaleFractal(){
    if(!this.fractal)
      return;
    const [minY, ,diff] = this.fractal.getY();
    const height = this.height;
    const scale = diff > height ? height*1.0/diff : 1.0;
    const transform = m4.scaling([scale,scale,scale]);
    m4.translate(transform,[0,-minY,0],transform);
    const floor = (this.floor + this.thickness)*1.0/scale;
    m4.translate(transform, [0, floor,0], transform);
    this.uniforms.transform = transform;
  }

  #drawFractal(gl:GL, viewProjection:Mat4, programInfo=this.programInfo) {

    if(!this.bufferInfo || !this.fractal)
      return;

    gl.useProgram(programInfo.program);

    this.uniforms.u_viewProjection = viewProjection;
    this.#scaleFractal();

    const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, this.bufferInfo);
    twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
    twgl.setUniforms(programInfo, this.uniforms);
    gl.drawElementsInstanced(gl.TRIANGLES, vertexArrayInfo.numElements, gl.UNSIGNED_SHORT, 0, this.numInstances);
  }
}
