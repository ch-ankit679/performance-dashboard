"use client";
import React, { useEffect, useRef } from "react";
import { DataPoint } from "@/lib/types";

export default function BarChart({
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

      // Filter data within visible time window
      const visible = data.filter((d) => d.t >= timeStart && d.t <= timeEnd);
      if (visible.length < 2) {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Compute bar count (1 bar per ~8 pixels)
      const barCount = Math.floor(w / 8);
      const binSize = (timeEnd - timeStart) / barCount;

      // Group values into bins
      const bins = Array(barCount)
        .fill(0)
        .map(() => ({ sum: 0, count: 0 }));

      for (const d of visible) {
        const idx = Math.floor(((d.t - timeStart) / (timeEnd - timeStart)) * barCount);
        if (idx >= 0 && idx < barCount) {
          bins[idx].sum += d.value;
          bins[idx].count += 1;
        }
      }

      // Compute average per bin
      const values = bins.map((b) => (b.count ? b.sum / b.count : 0));
      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);
      const range = maxVal - minVal || 1;

      // Set gradient fill for bars
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "rgba(34,197,94,0.9)");
      gradient.addColorStop(1, "rgba(34,197,94,0.1)");
      ctx.fillStyle = gradient;

      const barWidth = w / barCount;
      const baseline = h; // Bars start from bottom

      // Draw bars
      values.forEach((v, i) => {
        const barHeight = ((v - minVal) / range) * (h * 0.9); // 90% height max
        const x = i * barWidth;
        const y = baseline - barHeight;
        ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight); // add spacing between bars
      });

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
      <div style={{ fontWeight: 700, marginBottom: 8  }}>Bar Chart</div>
      <div style={{ height: 240 }}>
        <canvas
          ref={canvasRef}
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
