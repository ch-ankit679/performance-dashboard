"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import ScatterPlot from "../charts/ScatterPlot";
import Heatmap from "../charts/Heatmap";
import DataTable from "./DataTable";
import PerformanceMonitor from "./PerformanceMonitor";
import { useDataStream } from "@/hooks/useDataStream";
import TimeRangeSelector from "../controls/TimeRangeSelector";
import ZoomPanControls from "../controls/ZoomPanControls";

type ChartType = "line" | "bar" | "scatter" | "heatmap";

export default function DashboardShell() {
  const { data, count, batchSize, setBatchSize, reset } = useDataStream();
  const [timeRangeMs, setTimeRangeMs] = useState<number>(60_000);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [filters, setFilters] = useState<{ field?: string; min?: number; max?: number }>({});
  const [pendingFilters, setPendingFilters] = useState<{ field?: string; min?: number; max?: number }>({});
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);
  const scrollSpeed = 0.5;

  // 🌀 Auto-scroll for DataTable
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    let frameId: number;
    const scrollStep = () => {
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTop += scrollSpeed;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1)
          container.scrollTop = 0;
      }
      frameId = requestAnimationFrame(scrollStep);
    };
    frameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 🧠 Define visible time window
  const latestTimestamp = data.length ? data[data.length - 1].t : Date.now();
  const earliestTimestamp = data.length ? data[0].t : latestTimestamp;

  let timeEnd = latestTimestamp;
  let timeStart = latestTimestamp - timeRangeMs * (1 / zoom) + pan;

  // ✅ Adjust window dynamically when data range < selected time range
  const dataDuration = latestTimestamp - earliestTimestamp;
  if (dataDuration < timeRangeMs) {
    timeStart = earliestTimestamp;
    timeEnd = latestTimestamp;
  }

  if (timeStart < earliestTimestamp) {
    timeStart = earliestTimestamp;
    timeEnd = timeStart + timeRangeMs * (1 / zoom);
  }
  if (timeEnd <= timeStart) timeEnd = timeStart + 1000;

  // 🔹 Filtering logic
  const filteredData = useMemo(() => {
    if (!filters.field) return data;
    return data.filter((d: any) => {
      const val = d[filters.field!];
      if (typeof val !== "number") return false;
      if (filters.min !== undefined && val < filters.min) return false;
      if (filters.max !== undefined && val > filters.max) return false;
      return true;
    });
  }, [data, filters]);

  const handleApplyFilters = () => setFilters(pendingFilters);
  const handleClearFilters = () => {
    setFilters({});
    setPendingFilters({});
  };

  // 🖱️ Rubber-band zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chartContainerRef.current) return;
    setIsDragging(true);
    const rect = chartContainerRef.current.getBoundingClientRect();
    setDragStartX(e.clientX - rect.left);
    setDragEndX(null);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartContainerRef.current || dragStartX === null) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    setDragEndX(e.clientX - rect.left);
  };
  const handleMouseUp = () => {
    if (!isDragging || dragStartX === null || dragEndX === null) {
      setIsDragging(false);
      return;
    }
    const rect = chartContainerRef.current!.getBoundingClientRect();
    const width = rect.width;
    const startNorm = Math.min(dragStartX, dragEndX) / width;
    const endNorm = Math.max(dragStartX, dragEndX) / width;
    const newZoom = zoom * (1 / (endNorm - startNorm));
    const newPanShift = (startNorm - 0.5) * timeRangeMs * (1 / zoom);
    setZoom(newZoom);
    setPan((p) => p + newPanShift);
    setIsDragging(false);
    setDragStartX(null);
    setDragEndX(null);
  };
  const handleDoubleClick = () => {
    setZoom(1);
    setPan(0);
  };

  // ✅ Reset data
  const handleReset = () => {
    reset();
    setFadeKey((k) => k + 1);
  };

  const chartProps = { data: filteredData, timeStart, timeEnd };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return <LineChart {...chartProps} />;
      case "bar":
        return <BarChart {...chartProps} />;
      case "scatter":
        return <ScatterPlot {...chartProps} />;
      case "heatmap":
        return <Heatmap {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar card">
        <div className="header">
          <div>
            <div style={{ fontWeight: 700 }}>Realtime Dashboard</div>
            <div className="small">Streaming • {count} points</div>
          </div>
          <PerformanceMonitor />
        </div>

        {/* 🔹 Data Filtering */}
        <div className="card" style={{ marginTop: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Data Filtering</div>
          <div style={{ display: "grid", gap: 8 }}>
            <label className="small">Field</label>
            <select
              value={pendingFilters.field || ""}
              onChange={(e) => setPendingFilters((f) => ({ ...f, field: e.target.value }))}
              className="input"
            >
              <option value="">-- Select Field --</option>
              {data.length > 0 &&
                Object.keys(data[0])
                  .filter((k) => typeof (data[0] as any)[k] === "number")
                  .map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
            </select>

            <label className="small">Min</label>
            <input
              type="number"
              className="input"
              value={pendingFilters.min ?? ""}
              onChange={(e) =>
                setPendingFilters((f) => ({
                  ...f,
                  min: e.target.value ? +e.target.value : undefined,
                }))
              }
            />
            <label className="small">Max</label>
            <input
              type="number"
              className="input"
              value={pendingFilters.max ?? ""}
              onChange={(e) =>
                setPendingFilters((f) => ({
                  ...f,
                  max: e.target.value ? +e.target.value : undefined,
                }))
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="button" onClick={handleClearFilters}>
              Clear
            </button>
            <button className="button active" onClick={handleApplyFilters}>
              Apply
            </button>
          </div>
        </div>

        <TimeRangeSelector valueMs={timeRangeMs} onChange={setTimeRangeMs} />
        <ZoomPanControls zoom={zoom} onZoomChange={setZoom} pan={pan} onPanChange={setPan} />
      </aside>

      {/* ===== MAIN SECTION ===== */}
      <section className="content">
        <div className="card header">
          <div style={{ fontSize: 20, fontWeight: 700 }}>Manage Load</div>
          <div className="controls-row" style={{ gap: 8 }}>
            <button
              className={`button ${batchSize === 1 ? "active" : ""}`}
              onClick={() => setBatchSize(1)}
            >
              Low
            </button>
            <button
              className={`button ${batchSize === 10 ? "active" : ""}`}
              onClick={() => setBatchSize(10)}
            >
              Medium
            </button>
            <button
              className={`button ${batchSize === 50 ? "active" : ""}`}
              onClick={() => setBatchSize(50)}
            >
              High
            </button>
            <button
              className="button danger"
              style={{
                background: "#ef4444",
                color: "#fff",
                marginLeft: 8,
                fontWeight: 600,
              }}
              onClick={handleReset}
            >
              Reset Data
            </button>
          </div>
        </div>

        <div className="card controls-row" style={{ marginBottom: 12 }}>
          {["line", "bar", "scatter", "heatmap"].map((type) => (
            <button
              key={type}
              className={`button ${chartType === type ? "active" : ""}`}
              onClick={() => setChartType(type as ChartType)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ===== CHART AREA ===== */}
        <div className="card canvas-wrapper" style={{ display: "flex", gap: 12 }}>
          <div
            ref={chartContainerRef}
            style={{ flex: 1, position: "relative" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${chartType}-${fadeKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", width: "100%" }}
              >
                {renderChart()}
              </motion.div>
            </AnimatePresence>

            {isDragging && dragStartX !== null && dragEndX !== null && (
              <div
                style={{
                  position: "absolute",
                  left: Math.min(dragStartX, dragEndX),
                  width: Math.abs(dragEndX - dragStartX),
                  height: "100%",
                  background: "rgba(100,150,255,0.25)",
                  border: "1px solid rgba(100,150,255,0.8)",
                }}
              />
            )}
          </div>

          {/* ===== DATA TABLE ===== */}
          <div style={{ width: 360 }}>
            <div className="card">
              <div style={{ fontWeight: 700 }}>Data Table</div>
              <div ref={tableContainerRef} style={{ maxHeight: 420, overflowY: "auto" }}>
                <DataTable data={filteredData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
