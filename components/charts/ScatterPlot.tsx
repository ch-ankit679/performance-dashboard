"use client";
import React, { useEffect, useRef } from "react";
import { DataPoint } from "@/lib/types";

export default function ScatterPlot({ data, timeStart, timeEnd }: {
  data: DataPoint[];
  timeStart: number;
  timeEnd: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let alive = true;
    const draw = () => {
      if (!alive) return;
      const w = Math.floor(canvas.clientWidth * devicePixelRatio);
      const h = Math.floor(canvas.clientHeight * devicePixelRatio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        canvas.style.width = `${canvas.clientWidth}px`;
        canvas.style.height = `${canvas.clientHeight}px`;
      }
      ctx.clearRect(0, 0, w, h);
      // compute min/max
      let min = Infinity, max = -Infinity;
      for (const p of data) {
        if (p.t < timeStart || p.t > timeEnd) continue;
        min = Math.min(min, p.value);
        max = Math.max(max, p.value);
      }
      if (!isFinite(min)) return;
      const range = max - min || 1;
      for (const p of data) {
        if (p.t < timeStart || p.t > timeEnd) continue;
        const x = ((p.t - timeStart) / (timeEnd - timeStart)) * w;
        const y = h - ((p.value - min) / range) * h;
        ctx.fillStyle = "rgba(34,197,94,0.9)";
        ctx.fillRect(x, y, 2 * devicePixelRatio, 2 * devicePixelRatio);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [data, timeStart, timeEnd]);
  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 8}}>Scatter Plot</div>
      <div style={{ height: 240 }}>
        <canvas ref={ref} style={{ width: "100%", height: "100%",background: "linear-gradient(180deg,#0f1724,#0b1220)", borderRadius:12}} />
      </div>
    </div>
  );
}
