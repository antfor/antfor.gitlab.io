#version 300 es

uniform mat4 u_viewProjection;
uniform mat4 u_LightMatrix;
uniform mat4 transform;
uniform float step;

in vec3 instanceColor;
in mat4 instanceWorld;
in vec4 position;
in vec3 normal;


out vec3 v_normal;
out vec3 v_color;
out vec3 shadowMapCoord;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  v_color = instanceColor; //vec3(1.0);
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;

  vec4 lightPos = u_LightMatrix * instanceWorld * pos;
  vec3 lightPosDNC = lightPos.xyz / lightPos.w;
  shadowMapCoord = vec3(0.5) + lightPosDNC * 0.5;

  gl_Position = u_viewProjection * transform * instanceWorld * pos;
  
}