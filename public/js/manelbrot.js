const vs = `
    attribute vec4 v_position;

    void main() {
      gl_Position = v_position;
    }     
`;

const fs = `
    precision mediump float;

    void main() {
       gl_FragColor = vec4(fract(gl_FragCoord.xy / vec2(16., 32.)),0,1); 
    }
`;

var gl = document.querySelector("canvas").getContext("webgl");
var shader_program = twgl.createProgram(gl, [vs, fs]);
gl.useProgram(shader_program);
var vertexPositionAttribute = gl.getAttribLocation(shader_program, "v_position");
var quad_vertex_buffer = gl.createBuffer();
var quad_vertex_buffer_data = new Float32Array([ 
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0, -1.0, 0.0,
     1.0,  1.0, 0.0]);
gl.bindBuffer(gl.ARRAY_BUFFER, quad_vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, quad_vertex_buffer_data, gl.STATIC_DRAW);
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.drawArrays(gl.TRIANGLES, 0, 6);