import * as twgl from 'twgl.js';
import borderVs from './shaders/border/border.vert?raw';
import borderFs from './shaders/border/border.frag?raw';


const m4 = twgl.m4;
type GL = WebGL2RenderingContext;
type Vec3 = twgl.v3.Vec3;
type Mat4 = twgl.m4.Mat4;


class ShadowProgram{


    private width:number;
    private height:number;
    private lightPos:Vec3;
    private fb:WebGLFramebuffer | null;
    private rb:WebGLRenderbuffer | null;
    readonly shadowMap_texture:WebGLTexture;
    private programInfo!:twgl.ProgramInfo;
    private bufferInfo!:twgl.BufferInfo;
    private uniforms!:{
      resolution:[number, number]
    };


    constructor(gl:GL, lightPos:Vec3, width=512, height=512){

      this.width = width;
      this.height = height;
      this.lightPos = lightPos;

      this.fb = gl.createFramebuffer();
      this.rb = gl.createRenderbuffer();
      this.shadowMap_texture = gl.createTexture() as WebGLTexture;
   
      this.resize(gl, this.width, this.height);

      this.#createFullFaceQuad(gl);
      
    }

    resize(gl:GL, width:number, height:number){
      this.width = width;
      this.height = height;
      this.uniforms = {
        resolution: [this.width, this.height]
      };

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

      gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 , width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                                gl.RENDERBUFFER, this.rb);


      gl.bindTexture(gl.TEXTURE_2D, this.shadowMap_texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, this.shadowMap_texture, 0);

      gl.bindRenderbuffer(gl.RENDERBUFFER, null);                     
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    getViewProjection(lightPos = this.lightPos){
      const size = 50;
      const projection = m4.ortho(-size, size, -size*0.5, size*1.5, 0.5, 1000);
      const view = m4.lookAt(lightPos, [0,0,0], [0,1,0]);

      return m4.multiply(projection, view);
    }

    #createFullFaceQuad(gl:GL){
      this.programInfo = twgl.createProgramInfo(gl, [borderVs, borderFs]);
 
      const arrays = {
        position: { numComponents: 3, data: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]},
      };
      
      this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    }

    #drawBorder(gl:GL){
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(this.programInfo.program);

      twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
      twgl.setUniforms(this.programInfo, this.uniforms);
      
      twgl.drawBufferInfo(gl, this.bufferInfo);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }

    draw(gl:GL, drawScene:((v:Mat4, b:boolean)=>void)){

      const viewProjection = this.getViewProjection();

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
      gl.viewport(0, 0, this.width, this.height);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawScene(viewProjection, true);
      this.#drawBorder(gl); //Because Clamp to border does not exist in webgl2
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

}

export {ShadowProgram};