import * as twgl from 'twgl.js';


const m4 = twgl.m4;
const v3 = twgl.v3;

const vs = `
uniform mat4 u_viewProjection;
attribute mat4 instanceWorld;
attribute vec4 position;
uniform float step;

varying float v_depth;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  pos = u_viewProjection * instanceWorld * pos;

  gl_Position = pos;

  v_depth = (pos.z / pos.w) * .5 + .5;
}
`;
const fs = `
precision mediump float;

varying float v_depth;

void main() {
  gl_FragColor = vec4(v_depth,0,0,1);
}
`;

function createShadowProgram(gl){

}

class ShadowProgram{


    constructor(gl, lightPos, width=512, height=512){

      this.width = width;
      this.height = height;
      this.lightPos = lightPos;
      this.fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

      var rb = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 , width, height);

      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                                gl.RENDERBUFFER, rb);

      this.shadowMap_texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.shadowMap_texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, this.shadowMap_texture, 0);

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    }

    resize(gl, width, height){
    }
    
    getViewProjection(lightPos = this.lightPos){
      let projection = m4.ortho(-10, 10, -10, 10, 0.5, 100);  //todo scale to fit scene
      let view = m4.lookAt(lightPos, [0,0,0], [0,1,0]); //todo add light direction

      return m4.multiply(projection, view);
    }


    draw(drawScene, gl){

      let viewProjection = this.getViewProjection();

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
      gl.useProgram(this.programInfo.program);

      gl.viewport(0, 0, this.width, this.height);
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawScene(this.programInfo, viewProjection, true);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

export {ShadowProgram};