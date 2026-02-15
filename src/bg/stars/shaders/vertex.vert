precision mediump float;

attribute vec2 a_pos;
attribute float a_kind;

uniform float u_time;

varying float v_anim;
varying float v_starKind;

float random2d(vec2 coord);

void main() {
    float y = tan(a_pos.y - u_time / 20.0); // falling animation
    float x = a_pos.x;
    if (y < -1.0) {
        y = 1.1;
        x = random2d(a_pos);
    }

    gl_PointSize = 50.0;
    gl_Position = vec4(x, y, 0.0, 1.0);

    v_anim = u_time;
    v_starKind = a_kind;
}

float random2d(vec2 coord){
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
