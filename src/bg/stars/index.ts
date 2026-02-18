import vertSrc from "./shaders/vertex.vert?raw";
import fragSrc from "./shaders/fragment.frag?raw";
import { Shader, Texture, VAO, VBO, VertexAttrib } from "../utils";
import { BackDrop } from "..";
import textures from "./textures";
import { clamp, randRange } from "../../math";

type StarsTexture = [
    [WebGLTexture, WebGLTexture, WebGLTexture, WebGLTexture],
    [WebGLTexture, WebGLTexture, WebGLTexture, WebGLTexture],
    [WebGLTexture, WebGLTexture, WebGLTexture, WebGLTexture],
]
const STAR_COUNT = 25;

const starsData = () => {
    const data = []
    for (let i = 0; i < STAR_COUNT; i++) {
        data.push((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4) // Pos (x, y)
        data.push(Math.round(Math.random() * 2)) // Star kind 0=a, 1=b, 2=c
        data.push(Math.round(randRange(1, 2))) // Star speed
    }

    return new Float32Array(data);
};

export default {
    textures: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    program: 0,
    count: 0,
    vao: 0,
    async init(gl) {
        const program = Shader(gl, vertSrc, fragSrc);
        gl.useProgram(program);
        const vao = VAO(gl);

        const data = starsData();
        VBO(gl, data);

        const stride = 4 * 4
        VertexAttrib(gl, program, gl.FLOAT, "a_pos", 2, stride, 0);
        VertexAttrib(gl, program, gl.FLOAT, "a_kind", 1, stride, 2 * 4)
        VertexAttrib(gl, program, gl.FLOAT, "a_speed", 1, stride, 3 * 4)

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        for (let i = 0; i < textures.length; i++) {
            const tex_group = textures[i]
            for (let j = 0; j < tex_group.length; j++) {
                const texSrc = tex_group[j]
                const tex = await Texture(gl, texSrc)
                this.textures[i][j] = tex
            }
        }

        this.program = program;
        this.vao = vao;
        this.count = data.length / 4;
    },

    draw(gl, dt) {
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        const u_time = gl.getUniformLocation(this.program, "u_time");
        gl.uniform1f(u_time, dt)

        const index = clamp(Math.floor(Math.sin(dt) * 4), 0, 3)

        this.textures.forEach((texGroup, i) => {
            const kind = i == 0 ? "a"
                : i == 1 ? "b"
                    : "c"

            const tex = texGroup[index]
            gl.activeTexture(gl.TEXTURE0 + i)
            gl.bindTexture(gl.TEXTURE_2D, tex)
            const loc = gl.getUniformLocation(this.program, `u_starTexs.kind_${kind}`)
            gl.uniform1i(loc, i)
        })

        gl.drawArrays(gl.POINTS, 0, this.count);
        gl.disable(gl.BLEND)
        gl.bindVertexArray(null)
    },
} as BackDrop & {
    program: WebGLProgram,
    vao: WebGLVertexArrayObject,
    count: number,
    textures: StarsTexture
};
