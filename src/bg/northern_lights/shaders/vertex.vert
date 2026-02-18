attribute vec2 a_pos;
attribute vec3 a_color;
attribute vec2 a_uv;
attribute float a_alpha;

uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_color;
varying float v_strandAlpha;

void main() {
    vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;
    clip.y *= -1.0;

    gl_PointSize = 4.0;
    gl_Position = vec4(clip, 0.0, 1.0);

    v_uv = a_uv;
    v_color = a_color;
    v_strandAlpha = a_alpha;
}
