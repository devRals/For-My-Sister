import { canvas_res } from ".";

let gl: WebGL2RenderingContext;

const init = (canvas: OffscreenCanvas) => {
  gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("webgl2 desteklenmiyor");

  gl.viewport(0, 0, canvas_res[0], canvas_res[1]);
};

export enum MessageType {
  Init,
  Resize,
  Scroll,
}

export type StarsWorkerData = {
  type: MessageType;
  offscreen: OffscreenCanvas;
  state: "loading" | "ready";
};

self.onmessage = (e: MessageEvent<StarsWorkerData>) => {
  switch (e.data.type) {
    case MessageType.Init:
      try {
        init(e.data.offscreen);
      } catch (error) {
        console.error(error);
        return;
      }
      self.postMessage({ state: "ready" });
      console.log("initilized");
      break;
    case MessageType.Resize:
      if (!gl) return;
      break;

    case MessageType.Scroll:
      if (!gl) return;
  }
};
