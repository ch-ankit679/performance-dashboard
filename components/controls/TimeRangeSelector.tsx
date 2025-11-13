"use client";
import React from "react";

const PRESETS = [
  { label: "1m", ms: 60_000 },
  { label: "5m", ms: 300_000 },
  { label: "1h", ms: 3_600_000 },
];

export default function TimeRangeSelector({ valueMs, onChange }: { valueMs: number; onChange: (n: number) => void; }) {
  return (
    <div className="card">
      <div style={{ fontWeight: 700 }}>Time Range</div>
      <div className="controls-row" style={{ marginTop: 8 }}>
        {PRESETS.map((p) => (
          <button key={p.label} className="button" onClick={() => onChange(p.ms)}>
            {p.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }} className="small">
          Current: {Math.round(valueMs / 1000)}s
        </div>
      </div>
    </div>
  );
}
