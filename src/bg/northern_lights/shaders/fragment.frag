precision mediump float;

varying vec2 v_uv;
varying vec3 v_color;
varying float v_strandAlpha;

uniform sampler2D u_tex;

uniform bool u_drawParticle;

void main() {
    vec4 tex = texture2D(u_tex, v_uv);
    vec3 col = tex.rgb * v_color;
    float alpha = tex.a * v_strandAlpha;

    col *= 1.4;
    col += col * alpha * 0.5;

    gl_FragColor = u_drawParticle ? vec4(v_color, 1.0) : vec4(col, alpha);
}
