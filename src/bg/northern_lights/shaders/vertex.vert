attribute vec2 a_pos;
attribute vec3 a_color;
attribute vec2 a_uv;

uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_color;

void main() {
    vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;

    gl_PointSize = 50.0;
    gl_Position = vec4(clip, 0.0, 1.0);
    v_uv = a_uv;
    v_color = a_color;
}
