import * as twgl from 'twgl.js';
import shadowFs from './shaders/shadow.frag?raw';
import shadowVs from './shaders/floor/shadow.vert?raw';
import fs from './shaders/floor/floor.frag?raw';
import vs from './shaders/floor/floor.vert?raw';

const m4 = twgl.m4;

type GL = WebGL2RenderingContext;
type Vec3 = twgl.v3.Vec3;
type Mat4 = twgl.m4.Mat4;

export class Floor{

    private programInfo:twgl.ProgramInfo;
    private shadowProgramInfo:twgl.ProgramInfo;
    private bufferInfo:twgl.BufferInfo;
    private model:Vec3;
    private uniforms:{
        size:number,
        scale:number,
        posY:number,
        shadowMapTex?:WebGLTexture,
        u_MVP?:Mat4,
        u_NormalMatrix?:Mat4,
        u_Model?:Mat4,
        u_LightMatrix?:Mat4,
    };

    constructor(gl:GL, size = 1, grid = 2, posY = -6.5, shadowMapTex?:WebGLTexture){
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
    
    draw(gl:GL, viewProjection:Mat4, drawShadowMap=false, lightMatrix?:Mat4){

      if(drawShadowMap){
        this.#drawFloor(gl, viewProjection, this.shadowProgramInfo);
      }else{
        this.uniforms.u_LightMatrix = lightMatrix;
        this.#drawFloor(gl, viewProjection);
      }
    }

    #drawFloor(gl:GL, viewProjection:Mat4, programInfo=this.programInfo){

      gl.useProgram(programInfo.program);
      this.uniforms.u_NormalMatrix = m4.transpose(m4.inverse(this.model));
      this.uniforms.u_MVP = m4.multiply(viewProjection, this.model);
      this.uniforms.u_Model = this.model;

      twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
      twgl.setUniforms(programInfo, this.uniforms);
      twgl.drawBufferInfo(gl, this.bufferInfo);
    }
}