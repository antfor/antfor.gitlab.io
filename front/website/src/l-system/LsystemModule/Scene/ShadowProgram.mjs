import * as twgl from 'twgl.js';



const borderVs = `
#version 300 es

in vec4 position;
in vec2 texcoord;

out vec2 uv;

void main() {

  gl_Position = position;
  uv = texcoord;
  
}
`;
const borderFs = `
#version 300 es
precision highp float;

in vec2 uv;

out vec4 outColor;

void main() {

  vec2 insideBottomLeft = step(vec2(0.01), uv);
  vec2 insideTopRight   = step(uv, vec2(0.99));
  vec2 insideBottomLeftTopRight = insideBottomLeft * insideTopRight;
  float inside = insideBottomLeftTopRight.x * insideBottomLeftTopRight.y;

  
  outColor = mix(vec4(vec3(-1),1.0), vec4(vec3(0),0), inside);
  //outColor = mix(vec4(1.0, 0.0, 0.0, 1.0),vec4(0.0, 1.0, 0.0, 0.0), inside);
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

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, this.shadowMap_texture, 0);

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      this.createFullFaceQuad(gl);
      
    }

    resize(gl, width, height){

    }

    createShadowProgram(gl, vs, fs = shadowFs){
      return twgl.createProgramInfo(gl, [vs, fs]);

    }
    
    getViewProjection(lightPos = this.lightPos){
      const size = 50;
      const projection = m4.ortho(-size, size, -size, size, 0.5, 1000);  //todo scale to fit scene
      const view = m4.lookAt(lightPos, [0,0,0], [0,1,0]); //todo add light direction

      return m4.multiply(projection, view);
    }


    draw(drawScene, gl){

      let viewProjection = this.getViewProjection();

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
      gl.viewport(0, 0, this.width, this.height);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawScene(viewProjection, true);
      this.drawBorder(gl); //Because Clamp to border does not exist in webgl2
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    createFullFaceQuad(gl){
      this.programInfo = twgl.createProgramInfo(gl, [borderVs, borderFs]);
 
      const arrays = {
        position: { numComponents: 3, data: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]},
        texcoord: { numComponents: 2, data: [ 0, 0,     1, 0,      0, 1,     0, 1,    1, 0,     1, 1]},
      };
      this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    }

    drawBorder(gl){
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(this.programInfo.program);
      twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
      twgl.drawBufferInfo(gl, this.bufferInfo);
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }
}

export {ShadowProgram};