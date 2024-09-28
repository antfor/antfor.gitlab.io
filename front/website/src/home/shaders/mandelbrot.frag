#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float animation_time;
uniform int animation;

out vec4 outColor;

float getTime(){

    float ftime = 0.0;

    if(time < animation_time) 
        ftime = 1.0 - pow(cos(time * 3.14159265 / animation_time),8.0);
    
    return ftime;
}

float getMaxZoom(){
    return animation == 0 ? 1.0/10000.0 : 1.0/30000.0;
}

float zoom(){

    float ftime = getTime();

    float zoom_min = 1.3;
    float zoom_max = getMaxZoom();

    float zoom = zoom_max * ftime + zoom_min * (1.0 - ftime);

    return zoom;
}

vec2 getEndPos(){

    return animation == 0 ? vec2(-1.49,0.0) : vec2(-0.743643900055, 0.131825890901);
}

vec2 translate(){

    float ftime = getTime();

    vec2 start = vec2(-1.49,0.0);
    vec2 end = getEndPos();

    vec2 pos = start * (1.0 - ftime) + end * ftime;

    return pos;
}

float smoothIteration(float l, vec2 z){

    if( l < 0.0 ) return 0.0;
    
    float sl = 1.0 + l - log(log(length(z))/log(2.0))/log(2.0);

    return sl;
}

float mandelbrot(vec2 fragCoord)
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

    for( int i=0; i< 512; i++ )
    {
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
        if( dot(z,z)>= 100.0) {
            l = float(i);  
            break;
        } 
    }
    
    return smoothIteration(l,z);

}


void main()
{
    vec3 col = vec3(0.0,0.5,0.5);//vec3(0.0);

    float l = mandelbrot(gl_FragCoord.xy);
    

    float col_scale = animation == 0 ? 1.0 : pow( zoom(),0.2);

    col = 0.5 + 0.5*cos( col_scale*l*0.15 + vec3(3.0,3.6,4.0));

    outColor = vec4( col, 1.0 );
}