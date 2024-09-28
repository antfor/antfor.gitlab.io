import * as twgl from 'twgl.js';
import vs from './shaders/mandelbrot.vert?raw'
import fs from './shaders/mandelbrot.frag?raw'

const myCanvas =  <HTMLCanvasElement>document.getElementById("c");
const maybeContext = myCanvas.getContext("webgl2");
let gl:WebGL2RenderingContext;
if (maybeContext===null) {
    throw new Error("no webgl 2 context");
}else{
    gl = maybeContext;
}

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
 
const arrays: twgl.Arrays= {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

let start = 0.0;
let start_animate = false;
let animate = false;
const  animation_time = 30.0;

const num_animation = 2; 
let animation = 0;

function render(time: number):void {

    if(start_animate){
        start_animate = false;
        start = time;
        animate = true;
    }

    let glTime = (time - start) * 0.001;

    if(animate && glTime > animation_time){
        
        animation = (animation + 1) % num_animation;
        animate = false;
        zoomDone();
        
    }  
    
    if(!animate){
        glTime = 0;
    }

    const multiplier = 2;
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement, multiplier);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: glTime,
        resolution: [gl.canvas.width, gl.canvas.height],
        animation_time: animation_time,
        animation: animation,
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);


    if(animate){
        requestAnimationFrame(render);
    }else{
        reqested = false;
    }
}


let reqested = false;
function requestRender(){
    if(reqested) return false;

    reqested = true;
    requestAnimationFrame(render);

    return true;
}
requestRender();

function refreshRender(){
    
    if(animate || reqested) return;

    render(0);
}

const resizeObserver = new ResizeObserver(refreshRender);
resizeObserver.observe(myCanvas);

export function zoom():boolean{
    
    if(animate) return false;

    
    const granted = requestRender();
    if(granted){
        start_animate = true;
        return true;
    }
        
    return false;
}

let zoomListener : (undefined | (() => void))  = undefined;
export function setZoomListener(listener: () => void){
    zoomListener = listener;
}

function zoomDone(){
    if(zoomListener){
        zoomListener();
    }
}