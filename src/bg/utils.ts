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
    stride?: number,
    offset?: number,
    normalize?: boolean
) {
    const loc = gl.getAttribLocation(program, location);
    gl.vertexAttribPointer(loc, size, type, normalize ?? false, stride ?? 0, offset ?? 0);
    gl.enableVertexAttribArray(loc);
}

export function Texture(gl: WebGL2RenderingContext, src: string) {
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

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    load();

    return tex;
}

export function BindDynamic(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    data: Float32Array<ArrayBuffer>,
    program: WebGLProgram,
    name: string,
    size = 0,
    normalized = false
) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    const loc = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, gl.FLOAT, normalized, 0, 0)
}

export type VertexPositionColorTexture = {
    pos: Vec2,
    color: Vec3,
    texCoord: Vec2,
}

export type VertexPositionColor = {
    pos: Vec2,
    color: Vec3,
}
