precision mediump float;

varying vec2 v_uv;
varying vec3 v_color;

uniform sampler2D u_tex;

void main() {
    gl_FragColor = texture2D(u_tex, v_uv) * vec4(v_color, 1.0);
}
