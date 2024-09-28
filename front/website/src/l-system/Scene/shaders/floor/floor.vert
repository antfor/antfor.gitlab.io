#version 300 es

uniform mat4 u_MVP;
uniform mat4 u_NormalMatrix;
uniform mat4 u_LightMatrix;
uniform float posY;
uniform mat4 u_Model;

in vec4 position;
in vec3 normal;

out vec4 v_position;
out vec3 v_normal;
out vec3 shadowMapCoord;

void main() {

  vec4 pos = position;
  pos.y += posY;

  v_normal = (u_NormalMatrix * vec4(normal, 0)).xyz;
  v_position = pos;

  vec4 lightPos = u_LightMatrix * u_Model * pos;
  vec3 lightPosDNC = lightPos.xyz / lightPos.w;
  shadowMapCoord = vec3(0.5) + lightPosDNC * 0.5;

  gl_Position = u_MVP * pos;
}