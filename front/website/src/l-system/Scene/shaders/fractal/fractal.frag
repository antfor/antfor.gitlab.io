#version 300 es
precision highp float;

uniform sampler2D shadowMapTex;
uniform vec3 u_lightDir;

in vec3 v_normal;
in vec3 v_color;
in vec3 shadowMapCoord;

out vec4 outColor;

void main() {
  vec3 a_normal = normalize(v_normal);
  float light = dot(u_lightDir, a_normal) * .5 + .5;
  vec3 defuse = v_color.rgb * light;

  vec4 depth = texture(shadowMapTex, shadowMapCoord.xy);
  float shadowCoeff = 1. - smoothstep(0.003, 0.004, shadowMapCoord.z - depth.r);
  shadowCoeff = depth.r <= 0.0 ? 1.0 : shadowCoeff;
  //if(depth.r +0.003 < shadowMapCoord.z){
  //outColor = vec4(0.0,1.0,0.0, 1.0);
  //return;
  //}

  outColor = vec4(v_color.rgb * 0.7 + 0.3 * defuse * shadowCoeff, 1.0);
}