"use client";
import React, { useEffect, useRef } from "react";
import { DataPoint } from "@/lib/types";

export default function Heatmap({ data, timeStart, timeEnd }: {
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
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      const cols = 200;
      const rows = 60;
      const grid = new Array(cols * rows).fill(0);

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
        const cx = Math.floor(((p.t - timeStart) / (timeEnd - timeStart)) * cols);
        const cy = Math.floor(((p.value - min) / range) * rows);
        if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) grid[cy * cols + cx]++;
      }

      let gmax = Math.max(...grid);
      const cellW = w / cols;
      const cellH = h / rows;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = grid[y * cols + x];
          if (v === 0) continue;
          const norm = v / gmax;
          const hue = 120 - norm * 120; // green→yellow→red
          ctx.fillStyle = `hsla(${hue}, 80%, ${40 + norm * 20}%, ${0.7 * norm})`;
          ctx.fillRect(x * cellW, h - (y + 1) * cellH, cellW, cellH);
        }
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
      <div style={{ fontWeight: 700 }}>Heatmap</div>
      <div style={{ height: 240 }}>
        <canvas
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            borderRadius: 12,
            background: "linear-gradient(180deg,#0f1724,#0b1220)",
          }}
        />
      </div>
    </div>
  );
}
