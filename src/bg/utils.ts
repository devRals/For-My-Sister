import { Vec2, Vec3 } from "../vec2";

export function Shader(
    gl: WebGL2RenderingContext,
    vertSrc: string,
    fragSrc: string,
) {
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, vertSrc);
    gl.compileShader(vertShader);

    const vertinfo = gl.getShaderInfoLog(vertShader);
    if (vertinfo) {
        throw new Error(vertinfo);
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragSrc);
    gl.compileShader(fragShader);
    const fraginfo = gl.getShaderInfoLog(fragShader);
    if (fraginfo) {
        throw new Error(fraginfo);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    const infolog = gl.getProgramInfoLog(program);
    if (infolog) {
        throw new Error(infolog);
    }

    return program;
}

export function VBO(gl: WebGL2RenderingContext, data: Float32Array) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}

export function VAO(gl: WebGL2RenderingContext) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    return vao;
}

export function VertexAttrib(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    type: GLenum,
    location: string,
    size: number,
    stride: number = 0,
    offset: number = 0,
    normalize: boolean = false,
) {
    const loc = gl.getAttribLocation(program, location);
    gl.vertexAttribPointer(loc, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(loc);
}

export function Texture(gl: WebGL2RenderingContext, src: string, texParams: {
    wrap?: "clamp" | "repeat",
    filter?: "nearest" | "linear"
} = {
        wrap: "clamp",
        filter: "nearest"
    }) {
    const tex = gl.createTexture();

    const load = async () => {
        const res = await fetch(src);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);

        const [width, height] = [bitmap.width, bitmap.height];

        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            bitmap,
        );

        const wrap = texParams && texParams.wrap === "repeat" ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        const filter = texParams && texParams.filter === "linear" ? gl.LINEAR : gl.NEAREST;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    load();

    return tex;
}

export function BindDynamic(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    program: WebGLProgram,
    data: Float32Array<ArrayBuffer>,
    name: string,
    size = 0,
) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    VertexAttrib(gl, program, gl.FLOAT, name, size,)
}

export type VertexPositionColorTexture = {
    pos: Vec2,
    color: Vec3,
    uv: Vec2,
    alpha: number
}

export type VertexPositionColor = {
    pos: Vec2,
    color: Vec3,
}
