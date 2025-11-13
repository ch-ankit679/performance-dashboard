"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useDataStream } from "@/hooks/useDataStream";

export default function PerformanceMonitor() {
  const { fps, mem } = usePerformanceMonitor();
  const { batchSize } = useDataStream();
  const [loadLabel, setLoadLabel] = useState("Low");
  const [loadColor, setLoadColor] = useState("#22c55e");

  // Update label/color based on batch size
  useEffect(() => {
    if (batchSize < 10) {
      setLoadLabel("Low");
      setLoadColor("#22c55e");
    } else if (batchSize < 50) {
      setLoadLabel("Medium");
      setLoadColor("#eab308");
    } else {
      setLoadLabel("High");
      setLoadColor("#ef4444");
    }
  }, [batchSize]);

  return (
    <div
      style={{
        textAlign: "right",
        fontSize: 13,
        lineHeight: 1.4,
        background: "rgba(255,255,255,0.03)",
        padding: "8px 10px",
        borderRadius: 8,
        width: 130,
      }}
    >
      <div>FPS: {fps.toFixed(0)}</div>
      <div>{mem != null ? `${mem} MB` : "mem N/A"}</div>
      <div>
        Load: <span style={{ color: loadColor, fontWeight: 600 }}>{loadLabel}</span>
      </div>
    </div>
  );
}
