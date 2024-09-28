#version 300 es

uniform mat4 u_MVP;
uniform float posY;

in vec4 position;

void main() {

  vec4 pos = position;
  pos.y += posY;
  pos = u_MVP * pos;

  gl_Position = pos;
}