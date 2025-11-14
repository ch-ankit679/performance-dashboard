"use client";
import React, { useRef, useEffect } from "react";
import { DataPoint } from "@/lib/types";
import { decimateToPixels } from "@/lib/canvasUtils";

export default function LineChart({
  data,
  timeStart,
  timeEnd,
}: {
  data: DataPoint[];
  timeStart: number;
  timeEnd: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      }

      ctx.clearRect(0, 0, w, h);

      if (data.length === 0) {
        requestAnimationFrame(render);
        return;
      }

      // Decimate points for performance
      const pts = decimateToPixels(data, w, h, timeStart, timeEnd);

      if (!pts || pts.length === 0) {
        requestAnimationFrame(render);
        return;
      }

      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();

      // Use the Y midpoint for continuous line path
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p.x;
        const y = (p.yMin + p.yMax) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => {
      alive = false;
    };
  }, [data, timeStart, timeEnd]);

  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Line Chart</div>
      <div style={{ height: 240 }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "linear-gradient(180deg,#0f1724,#0b1220)",
            borderRadius: 12,
          }}
        />
      </div>
    </div>
  );
}
