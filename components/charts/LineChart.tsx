"use client";
import React, { useMemo, useRef } from "react";
import { DataPoint } from "@/lib/types";
import { useChartRenderer } from "@/hooks/useChartRenderer";

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
  // useChartRenderer will handle efficient drawing + decimation
  useChartRenderer(canvasRef, data, {
    timeStart,
    timeEnd,
    strokeStyle: "#22c55e",
    lineWidth: 1,
  });

  return (
    <div style={{ height: 420 }} className="card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Line Chart</div>
      <div style={{ width: "100%", height: "360px" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", background: "linear-gradient(180deg,#0f1724,#0b1220)", borderRadius:12 }} />
      </div>
    </div>
  );
}
