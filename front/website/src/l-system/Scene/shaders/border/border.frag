#version 300 es
precision highp float;

uniform vec2 resolution;

out vec4 outColor;

void main() {

  vec2 uv = gl_FragCoord.xy;
  vec2 insideBottomLeft = step(vec2(1.0), uv);
  vec2 insideTopRight   = step(uv, resolution-1.0);
  vec2 insideBottomLeftTopRight = insideBottomLeft * insideTopRight;
  float inside = insideBottomLeftTopRight.x * insideBottomLeftTopRight.y;

  
  outColor = mix(vec4(vec3(0.0),1.0), vec4(vec3(0),0), inside);
  //outColor = mix(vec4(1.0, 0.0, 0.0, 1.0),vec4(0.0, 1.0, 0.0, 1.0), inside);
}