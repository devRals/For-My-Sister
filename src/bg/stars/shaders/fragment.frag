precision mediump float;

varying float v_anim;
varying float v_starKind;

uniform struct {
    sampler2D kind_a;
    sampler2D kind_b;
    sampler2D kind_c;
} u_starTexs;

void main() {
    vec2 uv = gl_PointCoord;
    int starKind = int(floor(v_starKind + 0.5));

    vec4 tex = 
        starKind == 0 ? texture2D(u_starTexs.kind_a, uv)
            : starKind == 1 ? texture2D(u_starTexs.kind_b , uv)
            : texture2D(u_starTexs.kind_c, uv);

    vec4 col = vec4(0.0);

    col += tex;

    float stepY = 0.12; // Trail length
    float fade = 0.5;

    for (int i = 1; i <= 3; i++) {
        vec2 tUV = uv;
        tUV.y += float(i) * stepY;

        vec4 trail_tex = 
            starKind == 0 ? texture2D(u_starTexs.kind_a, tUV)
                : starKind == 1 ? texture2D(u_starTexs.kind_b , tUV)
                : texture2D(u_starTexs.kind_c, tUV);

        if (tUV.y <= 1.0) {
            col += trail_tex * pow(fade, float(i));
        }
    }

    gl_FragColor = col;
}
