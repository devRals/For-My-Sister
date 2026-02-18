precision mediump float;

attribute vec2 a_pos;
attribute float a_kind;
attribute float a_speed;

uniform float u_time;

varying float v_anim;
varying float v_starKind;
varying float v_speed;

void main() {
    // float y = tan(a_pos.y - u_time * a_speed / 20.0);
    // float x = a_pos.x;
    //
    // if (y > 1.0) {
    //     y = 1.1;
    // }

    gl_PointSize = 50.0;
    gl_Position = vec4(a_pos, 0.0, 1.0);

    v_anim = u_time;
    v_starKind = a_kind;
    v_speed = a_speed;
}
