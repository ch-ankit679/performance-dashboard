"use client";
import React, { useState } from "react";

export default function FilterPanel({
  onPause,
  isPaused,
  onReset,
  onSetBatch,
}: {
  onPause: () => void;
  isPaused: boolean;
  onReset: () => void;
  onSetBatch: (n: number) => void;
}) {
  const [batch, setBatch] = useState(1);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="button" onClick={onPause}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button className="button" onClick={onReset}>
          Reset
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label className="small">Batch</label>
          <input
            type="range"
            min={1}
            max={100}
            value={batch}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBatch(v);
              onSetBatch(v);
            }}
          />
          <span className="small">{batch}</span>
        </div>
      </div>
    </div>
  );
}
