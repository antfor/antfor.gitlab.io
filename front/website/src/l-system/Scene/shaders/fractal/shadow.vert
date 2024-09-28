#version 300 es

uniform mat4 u_viewProjection;
uniform mat4 transform;
uniform float step;

in mat4 instanceWorld;
in vec4 position;

void main() {
  vec4 pos = position;
  pos.y += step/2.0;
  gl_Position = u_viewProjection * transform * instanceWorld * pos;
}