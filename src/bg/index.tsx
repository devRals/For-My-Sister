import { useEffect, useRef } from "react";
import { MessageType } from "./worker";
import mist from "./mist.png"

export interface BackDrop {
    init: (gl: WebGL2RenderingContext) => Promise<void>;
    draw: (gl: WebGL2RenderingContext, time: number, dt: number, canvas: OffscreenCanvas) => void;
}

export default function Background() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctrl = new AbortController()
        const { signal } = ctrl;
        if (!ref.current) return;
        const canvas: HTMLCanvasElement = ref.current!;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
        const offscreen = canvas.transferControlToOffscreen();

        window.addEventListener("resize", () => {
            worker.postMessage({ type: MessageType.Resize, width: window.innerWidth, height: window.innerHeight })
        }, { signal })

        window.addEventListener("scroll", () => {
            worker.postMessage({ type: MessageType.Scroll, scroll: window.scrollY })
        }, { signal })

        worker.postMessage({ offscreen, type: MessageType.Init, width: window.innerWidth, height: window.innerHeight }, [offscreen]);

        return () => { worker.terminate(); ctrl.abort() };
    }, []);

    return (
        <div className="bg">
            <img src={mist} style={{
                position: "fixed",
                width: window.innerWidth,
                height: window.innerHeight,
                zIndex: 0,
                imageRendering: "pixelated",
                userSelect: "none",
                backgroundRepeat: "repeat",
            }} />
            <canvas
                ref={ref}
                style={{
                    position: "fixed",
                    zIndex: -1,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    imageRendering: "pixelated"
                }}
            />
        </div>
    );
}
