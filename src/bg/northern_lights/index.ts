import vertSrc from "./shaders/vertex.vert?raw";
import fragSrc from "./shaders/fragment.frag?raw";
import northerLightsTexturePath from "./northernlights.png"
import { BindDynamic, Shader, Texture } from "../utils";
import { BackDrop } from "..";
import { NorthernLights } from "./NorthernLights";

export const RESOULUTION: [number, number] = [320, 180]
export const [WIDTH, HEIGHT] = RESOULUTION

export default {
    program: 0,
    count: 0,
    vao: 0,
    northernLightsTex: 0,
    auroa: null,
    buffers: {
        particles: {
            colors: 0,
            pos: 0,
        },
        auroa: {
            colors: 0,
            pos: 0,
            tex: 0
        }
    },
    init(gl) {
        const program = Shader(gl, vertSrc, fragSrc)
        gl.useProgram(program)

        this.buffers = {
            auroa: {
                colors: gl.createBuffer(),
                pos: gl.createBuffer(),
                tex: gl.createBuffer()
            },
            particles: {
                colors: gl.createBuffer(),
                pos: gl.createBuffer()
            }
        }

        this.northernLightsTex = Texture(gl, northerLightsTexturePath)

        this.auroa = new NorthernLights(3)

        this.program = program
    },

    draw(gl, dt, _) {
        if (!this.auroa) throw new Error("NorthernLights arkaplanı henüz hazır değil")

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)


        gl.useProgram(this.program);
        const u_resolution = gl.getUniformLocation(this.program, "u_resolution")
        gl.uniform2f(u_resolution, WIDTH, HEIGHT)


        this.auroa.update(dt)
        this.auroa.beforeRender()

        const colorData = []
        const posData = []
        const uvData = []

        for (const vert of this.auroa.verts) {
            colorData.push(vert.color.x, vert.color.y, vert.color.z)
            posData.push(vert.pos.x, vert.pos.y)
            uvData.push(vert.texCoord.x, vert.texCoord.y)
        }

        BindDynamic(gl, this.buffers.auroa.colors, new Float32Array(colorData), this.program, "a_color", 3)
        BindDynamic(gl, this.buffers.auroa.pos, new Float32Array(posData), this.program, "a_pos", 2)
        BindDynamic(gl, this.buffers.auroa.tex, new Float32Array(uvData), this.program, "a_uv", 2)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.northernLightsTex)
        gl.uniform1i(gl.getUniformLocation(this.program, "u_tex"), 0)

        gl.drawArrays(gl.TRIANGLES, 0, this.auroa.verts.length)

        const pColorsData = []
        const pPosData = []
        for (const particle of this.auroa.particles) {
            pPosData.push(particle.pos.x, particle.pos.y)
            pColorsData.push(particle.color.x, particle.color.y, particle.color.z)
        }

        BindDynamic(gl, this.buffers.auroa.colors, new Float32Array(pColorsData), this.program, "a_color", 3)
        BindDynamic(gl, this.buffers.auroa.pos, new Float32Array(pPosData), this.program, "a_pos", 2)

        gl.drawArrays(gl.POINTS, 0, this.auroa.particles.length)

    },
} as BackDrop & {
    program: WebGLProgram,
    auroa: NorthernLights | null,
    northernLightsTex: WebGLTexture,
    buffers: {
        auroa: {
            colors: WebGLBuffer,
            pos: WebGLBuffer,
            tex: WebGLBuffer
        },
        particles: {
            colors: WebGLBuffer,
            pos: WebGLBuffer
        }
    }
}
