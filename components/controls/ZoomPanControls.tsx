"use client";

import React, { useCallback, useEffect, useState } from "react";

type Props = {
  zoom: number;
  onZoomChange: (z: number) => void;
  pan: number;
  onPanChange: (p: number) => void;
  panStepMs?: number;
  minZoom?: number;
  maxZoom?: number;
};

export default function ZoomPanControls({
  zoom,
  onZoomChange,
  pan,
  onPanChange,
  panStepMs = 5_000,
  minZoom = 1,
  maxZoom = 50,
}: Props) {
  const clamp = useCallback(
    (v: number, a = minZoom, b = maxZoom) => Math.max(a, Math.min(b, v)),
    [minZoom, maxZoom]
  );

  const [sliderValue, setSliderValue] = useState(() => {
    const logMin = Math.log(minZoom);
    const logMax = Math.log(maxZoom);
    return ((Math.log(zoom) - logMin) / (logMax - logMin)) * 100;
  });

  useEffect(() => {
    const logMin = Math.log(minZoom);
    const logMax = Math.log(maxZoom);
    const percent = ((Math.log(zoom) - logMin) / (logMax - logMin)) * 100;
    setSliderValue(percent);
  }, [zoom, minZoom, maxZoom]);

  const zoomIn = () => onZoomChange(clamp(zoom * 0.8));
  const zoomOut = () => onZoomChange(clamp(zoom * 1.25));

  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    const v = value / 100;
    const logMin = Math.log(minZoom);
    const logMax = Math.log(maxZoom);
    const mapped = Math.exp(logMin + (logMax - logMin) * v);
    onZoomChange(clamp(mapped));
  };

  const panLeft = () => onPanChange(pan - panStepMs);
  const panRight = () => onPanChange(pan + panStepMs);
  const panHalfLeft = () => onPanChange(pan - Math.round(panStepMs / 2));
  const panHalfRight = () => onPanChange(pan + Math.round(panStepMs / 2));

  const reset = () => {
    onZoomChange(1);
    onPanChange(0);
  };

  return (
    <div
      className="card"
      style={{
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: 4,
        }}
      >
        <div style={{ fontWeight: 700 }}>View</div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            whiteSpace: "nowrap",
          }}
        >
          {`Zoom: ${zoom.toFixed(2)}x`}
        </div>
      </div>

      {/* Zoom Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
        }}
      >
        <button
          className="button"
          onClick={zoomIn}
          title="Zoom in (smaller time window)"
          style={{
            flex: "0 0 28px",
            padding: "2px 0",
            fontSize: 16,
          }}
        >
          ➖
        </button>

        <input
          aria-label="Zoom"
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={handleZoomSlider}
          style={{
            flex: 1,
            height: 6,
            cursor: "pointer",
          }}
        />

        <button
          className="button"
          onClick={zoomOut}
          title="Zoom out (larger time window)"
          style={{
            flex: "0 0 28px",
            padding: "2px 0",
            fontSize: 16,
          }}
        >
          ➕
        </button>
      </div>

      {/* Pan Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 4,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <button className="button" onClick={panLeft} title={`Pan left ${panStepMs}ms`}>
            ⟸
          </button>
          <button className="button" onClick={panHalfLeft} title={`Pan left ${Math.round(panStepMs / 2)}ms`}>
            ←
          </button>
          <button className="button" onClick={panHalfRight} title={`Pan right ${Math.round(panStepMs / 2)}ms`}>
            →
          </button>
          <button className="button" onClick={panRight} title={`Pan right ${panStepMs}ms`}>
            ⟹
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <button
            className="button"
            onClick={() => onPanChange(0)}
            title="Center (no pan)"
            style={{ flex: 1, minWidth: "45%" }}
          >
            ⊖ Center
          </button>
          <button
            className="button"
            onClick={reset}
            title="Reset zoom & pan"
            style={{ flex: 1, minWidth: "45%" }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
