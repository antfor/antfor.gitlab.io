import * as twgl from 'twgl.js';
import { Fractal } from '../Fractal/FractalOptions.mts';
import shadowFs from './shaders/shadow.frag?raw';
import shadowVs from './shaders/fractal/shadow.vert?raw';
import fs from './shaders/fractal/fractal.frag?raw';
import vs from './shaders/fractal/fractal.vert?raw';


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
