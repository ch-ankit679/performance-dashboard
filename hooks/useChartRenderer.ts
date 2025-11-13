"use client";
import { useEffect, useRef } from "react";
import { decimateToPixels } from "@/lib/canvasUtils";
import { DataPoint } from "@/lib/types";

export function useChartRenderer(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  data: DataPoint[],
  opts: {
    timeStart: number;
    timeEnd: number;
    lineWidth?: number;
    strokeStyle?: string;
  }
) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;

    const render = () => {
      if (!alive) return;

      const w = Math.floor(canvas.clientWidth * devicePixelRatio);
      const h = Math.floor(canvas.clientHeight * devicePixelRatio);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${canvas.clientWidth}px`;
        canvas.style.height = `${canvas.clientHeight}px`;
      }

      ctx.clearRect(0, 0, w, h);

      const { timeStart: start, timeEnd: end } = opts;

      if (data.length > 0) {
        const pts = decimateToPixels(data, w, h, start, end);

        if (pts.length === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.05)";
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "rgba(200,200,200,0.6)";
          ctx.font = `${14 * devicePixelRatio}px sans-serif`;
          ctx.fillText("Waiting for data...", 10 * devicePixelRatio, 20 * devicePixelRatio);
        } else {
          ctx.lineWidth = (opts.lineWidth ?? 1) * devicePixelRatio;
          ctx.strokeStyle = opts.strokeStyle ?? "#22c55e";
          ctx.beginPath();
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            ctx.moveTo(p.x + 0.5, p.yMin);
            ctx.lineTo(p.x + 0.5, p.yMax);
          }
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      alive = false;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, data, opts.timeStart, opts.timeEnd]);
}
