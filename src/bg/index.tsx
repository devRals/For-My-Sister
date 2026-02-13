import React, { useEffect, useRef, useState } from "react";
import StarsWorker from "./worker?worker&inline";
import { MessageType } from "./worker";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 180;

export const canvas_res = [CANVAS_WIDTH, CANVAS_HEIGHT] as const;

export default function () {
  const ref = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;

    if (!ref.current) return;
    const canvas: HTMLCanvasElement = ref.current!;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const worker = new StarsWorker();
    const offscreen = canvas.transferControlToOffscreen();

    worker.onmessage = (e) => {
      console.log(e);
      setLoading(e.data.state);
    };

    worker.postMessage({ offscreen, type: MessageType.Init }, [offscreen]);

    window.addEventListener(
      "resize",
      () => {
        worker.postMessage({ type: MessageType.Resize }, []);
      },
      { signal },
    );

    window.addEventListener(
      "scroll",
      () => {
        worker.postMessage({ type: MessageType.Scroll }, []);
      },
      { signal },
    );

    return () => {
      worker.terminate();
      ctrl.abort();
    };
  }, []);

  return (
    <>
      {loading == "loading" && "loading..."}
      <canvas
        ref={ref}
        style={{
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          position: "fixed",
        }}
      ></canvas>
    </>
  );
}
