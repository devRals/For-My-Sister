import { BackDrop } from ".";
import Stars from "./stars";
import NortherLights from "./northern_lights";

let gl: WebGL2RenderingContext | null;
let canvas: OffscreenCanvas | null;
let animId: number | null


const init = async () => {
    if (!canvas) return;
    gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("webgl2 desteklenmiyor");
    gl.viewport(0, 0, canvas.width, canvas.height)

    Stars.init(gl);
    NortherLights.init(gl);

    render([Stars, NortherLights])
};

let dt: number = 0

const render = (backdrops: BackDrop[]) => {
    if (!gl || !canvas) return;
    dt = (performance.now() - dt) / 400; // scale down for slower animation
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const b of backdrops) {
        b.draw(gl, dt, canvas);
    }

    animId = requestAnimationFrame(() => render(backdrops))

};

export enum MessageType {
    Init,
    Resize,
    Scroll,
}

export type WorkerData = {
    type: MessageType;
    offscreen: OffscreenCanvas;
    state: "loading" | "ready" | "error";
    width: number,
    height: number
    scroll: number
};

self.onmessage = async (e: MessageEvent<WorkerData>) => {

    switch (e.data.type) {
        case MessageType.Init:
            canvas = e.data.offscreen
            try {
                await init();
                self.postMessage({ state: "ready" });
                console.log("initilized");
            } catch (error) {
                self.postMessage({ state: "error" })
                console.error(error);
                throw error
            }
            break;
        case MessageType.Resize:
            // if (!canvas) return;
            // animId && cancelAnimationFrame(animId)
            // canvas.width = e.data.width
            // canvas.height = e.data.height
            // await init()
            // gl?.viewport(0, 0, width, height)
            break;

        case MessageType.Scroll:
            if (!gl) return;
    }
};
