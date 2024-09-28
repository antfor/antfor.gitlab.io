#version 300 es
precision highp float;

uniform sampler2D shadowMapTex;
uniform float scale;
uniform float size;

in vec3 v_normal;
in vec4 v_position;
in vec3 shadowMapCoord;

out vec4 outColor;


float filterwidth(vec2 v)
{
  vec2 fw = max(abs(dFdx(v)), abs(dFdy(v)));
  return max(fw.x, fw.y);
}

vec2 BUMPINT(vec2 x){

    return (floor((x)/2.0) + 2.0 * max(((x)/2.0) - floor((x)/2.0) - .5, 0.0));
}

float checker(vec2 uv)
{
  float width = filterwidth(uv);
  vec2 p0 = uv - .5 * width, p1 = uv + .5 * width;
  
  vec2 i = (BUMPINT(p1) - BUMPINT(p0)) / width;
  return i.x * i.y + (1.0 - i.x) * (1.0 - i.y);
}


void main() {

  float col = 0.2f + 0.05f * checker(v_position.xz*scale/size);
  vec4 diffuseColor = vec4(col, col, col, 1.0);

  vec4 depth = texture(shadowMapTex, shadowMapCoord.xy);
  float shadowCoeff = 1. - smoothstep(0.002, 0.003, shadowMapCoord.z - depth.r);
  shadowCoeff = depth.r <= 0.0 ? 1.0 : shadowCoeff;

  //outColor = vec4(depth);
  outColor = vec4(diffuseColor.xyz * 0.7 + 0.3 * diffuseColor.xyz * shadowCoeff,1.0);
}