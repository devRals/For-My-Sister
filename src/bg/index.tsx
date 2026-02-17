import React, { useEffect, useRef, useState } from "react";
import BgWorker from "./worker?worker&inline";
import { MessageType, type WorkerData } from "./worker";

export interface BackDrop {
    init: (gl: WebGL2RenderingContext) => void;
    draw: (gl: WebGL2RenderingContext, dt: number, canvas: OffscreenCanvas) => void;
}

export default function Background() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        const ctrl = new AbortController()
        const { signal } = ctrl;
        if (!ref.current) return;
        const canvas: HTMLCanvasElement = ref.current!;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const worker = new BgWorker();
        const offscreen = canvas.transferControlToOffscreen();

        worker.onmessage = (e: MessageEvent<WorkerData>) => {
            const state = e.data.state
            if (state == "ready") {
                setLoading(state);
            } else if (state == "error") {
                setLoading(state)
            }
        }

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
        <>
            {
                loading == "loading" ? "Yükleniyor..."
                    : loading == "error" ? "Bir hata, konsolu kontrol et"
                        : ""
            }
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
        </>
    );
}
