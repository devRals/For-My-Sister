import { Shader, VAO, VBO, VertexAttrib } from "../utils"

import vert from "./vertex.vert?raw"
import frag from "./fragment.frag?raw"

export type FrameBufferRenderContext = {
    object: WebGLFramebuffer,
    tex: WebGLTexture,
    vao: WebGLVertexArrayObject,
    program: WebGLProgram
}

export function FBO(gl: WebGL2RenderingContext, res: [number, number]): [WebGLFramebuffer, WebGLTexture] {
    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

    const targetTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, targetTex)

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        res[0],
        res[1],
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    )

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        targetTex,
        0
    )

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return [fbo, targetTex]
}

export function prepareFBOShader(gl: WebGL2RenderingContext): [WebGLProgram, WebGLVertexArrayObject] {
    const program = Shader(gl, vert, frag)
    gl.useProgram(program)
    const vao = VAO(gl)

    const data = new Float32Array([
        // pos, uv
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,

        -1, 1, 0, 1,
        1, -1, 1, 0,
        1, 1, 1, 1
    ])
    VBO(gl, data)

    const stride = 2 * 4
    VertexAttrib(gl, program, gl.FLOAT, "a_pos", 2, stride, 0)
    VertexAttrib(gl, program, gl.FLOAT, "a_uv", 2, stride, 4)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)

    return [program, vao]
}

export function renderToFrameBuffer(
    gl: WebGL2RenderingContext,
    fb: FrameBufferRenderContext,
    res: [number, number],
    dt: number,
    canvas: OffscreenCanvas,
    drawCb: (gl: WebGL2RenderingContext, dt: number, canvas: OffscreenCanvas) => void
) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.object)
    gl.viewport(0, 0, res[0], res[1])

    gl.disable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    drawCb(gl, dt, canvas)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.useProgram(fb.program)
    gl.bindVertexArray(fb.vao)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, fb.tex)
    gl.uniform1i(gl.getUniformLocation(fb.program, "u_tex"), 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
}
