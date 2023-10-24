
const vs = `
    attribute vec4 position;

    void main() {
    gl_Position = position;
    }  
`;

const fs = `
precision highp float;

uniform vec2 resolution;
uniform float time;

float mandelbrot( in vec2 fragCoord )
{
 
    vec2 p = (fragCoord.xy*2.0 - resolution.xy) * 2.0/ resolution.x;
  
    vec2 c = p*1.3 + vec2(-1.5,0.0);

   {
    float c2 = dot(c, c);
    float s1 = 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0;
    
    // early skip computation inside M1
    if( s1 < 0.0 ) return 0.0;
    
    float s2 = 16.0*(c2+2.0*c.x+1.0) - 1.0;
    // early skip computation inside M2
    if( s2 < 0.0 ) return 0.0;
   }

    float l = 0.0;
    vec2 z  = vec2(0.0);

    for( int i=0; i< 256; i++ )
    {
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
        if( dot(z,z)>= 100.0) break;
        l += 1.0;   
    }
    
    if( l>=256.0 ) return 0.0;
    
    float sl = 1.0 + l - log(log(length(z))/log(2.0))/log(2.0);

    return sl;
}

void main()
{
    vec3 col = vec3(0.0,0.5,0.5);//vec3(0.0);

    //float l0 = mandelbrot(gl_FragCoord.xy + vec2(0.125,0.375));
    //float l1 = mandelbrot(gl_FragCoord.xy + vec2(0.375,-0.125));
    //float l2 = mandelbrot(gl_FragCoord.xy + vec2(-0.375,0.375));
    //float l3 = mandelbrot(gl_FragCoord.xy + vec2(-0.125,-0.125));
    //float l = (l0+l1+l2+l3)*0.25;

    float l = mandelbrot(gl_FragCoord.xy);
    
    col = 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
    //col =  vec3(l/64.0);
    gl_FragColor = vec4( col, 1.0 );
}

`;
const gl = document.getElementById("c").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
 
const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);


function render(time){
	
    const multiplier = 2;
    twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: time * 0.001,
        resolution: [gl.canvas.width, gl.canvas.height],
      };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

	requestAnimationFrame(render)
}

requestAnimationFrame(render)