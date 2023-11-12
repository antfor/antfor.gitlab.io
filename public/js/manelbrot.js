
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

float animation_time = 30.0;

float zoom(){

    float ftime = 0.0;

    if(time < animation_time) 
        ftime = 1.0 - pow(cos(time * 3.14159265 / animation_time),8.0);
    
    float zoom_min = 1.3;
    float zoom_max = 1.0/10000.0;

    float zoom = zoom_max * ftime + zoom_min * (1.0 - ftime);

    return zoom;
}

vec2 translate(){

    vec2 pos =  vec2(-1.49,0.0);
    return pos;
}

float smooth(in float l, in vec2 z){

    if( l < 0.0 ) return 0.0;
    
    float sl = 1.0 + l - log(log(length(z))/log(2.0))/log(2.0);

    return sl;
}

float mandelbrot( in vec2 fragCoord )
{
 
    vec2 p = (fragCoord.xy*2.0 - resolution.xy) * 2.0/ resolution.x;
    vec2 c = zoom() * p + translate();

   {
    float c2 = dot(c, c);
    float s1 = 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0;
    
    // early skip computation inside M1
    if( s1 < 0.0 ) return 0.0;
    
    float s2 = 16.0*(c2+2.0*c.x+1.0) - 1.0;
    // early skip computation inside M2
    if( s2 < 0.0 ) return 0.0;
   }

    float l = -1.0;
    vec2 z  = vec2(0.0);

    for( int i=0; i< 256; i++ )
    {
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
        if( dot(z,z)>= 100.0) {
            l = float(i);  
            break;
        } 
    }
    
    return smooth(l,z);

}

float mandelbrot_prep( in vec2 fragCoord )
{
    vec2 p = (fragCoord.xy*2.0 - resolution.xy) * 2.0/ resolution.x;

    vec2 c = translate();
    vec2 dc = p * zoom();

    {
        vec2 cdc = c + dc;
        float c2 = dot(cdc, cdc);
        float s1 = 256.0*c2*c2 - 96.0*c2 + 32.0*cdc.x - 3.0;
        
        // early skip computation inside M1
        if( s1 < 0.0 ) return 0.0;
        
        float s2 = 16.0*(c2+2.0*cdc.x+1.0) - 1.0;
        // early skip computation inside M2
        if( s2 < 0.0 ) return 0.0;
    }

    vec2 z = vec2(0.0);
    vec2 dz = vec2(0.0);

    float l = -1.0;

    for(int i=0; i< 256; i++){

        vec2 a = 2.0*z+dz;
        dz = vec2(a.x*dz.x-a.y*dz.y, a.x*dz.y+a.y*dz.x) + dc;
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

        if( dot(dz,dz)>= 100.0) {
            l = float(i);  
            break;
        }

    }

    return smooth(l,z + dz); // dz?
}

void main()
{
    vec3 col = vec3(0.0,0.5,0.5);//vec3(0.0);

    //float l0 = mandelbrot(gl_FragCoord.xy + vec2(0.125,0.375));
    //float l1 = mandelbrot(gl_FragCoord.xy + vec2(0.375,-0.125));
    //float l2 = mandelbrot(gl_FragCoord.xy + vec2(-0.375,0.375));
    //float l3 = mandelbrot(gl_FragCoord.xy + vec2(-0.125,-0.125));
    //float l = (l0+l1+l2+l3)*0.25;

    //float l = mandelbrot(gl_FragCoord.xy);
    float l = mandelbrot_prep(gl_FragCoord.xy);
    
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

let start = 0.0;
let start_animate = false;
let animate = false;
let animation_time = 30.0;

function render(time){

    if(start_animate){
        start_animate = false;
        start = time;
        animate = true;
    }

    let glTime = (time - start) * 0.001;

    if(glTime > animation_time){
        
        animate = false;
        toggleZoomButton(false);
        
    }  
    
    if(!animate){
        glTime = 0;
    }

    const multiplier = 2;
    twgl.resizeCanvasToDisplaySize(gl.canvas, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: glTime,
        resolution: [gl.canvas.width, gl.canvas.height],
      };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

	requestAnimationFrame(render)
}

requestAnimationFrame(render)

//jQuery
function toggleZoomButton(b){

    $('#zoom_button').prop("disabled", b);
}



$(function(){

    $('#zoom_button').on('click', function (e) {
    
        if(!animate){
            start_animate = true;
            toggleZoomButton(true);
        }
    
    });
        
    
});