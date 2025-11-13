"use client";
import React, { useRef, useState } from "react";
import { DataPoint } from "@/lib/types";
import { useVirtualization } from "@/hooks/useVirtualization";

export default function DataTable({ data }: { data: DataPoint[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 36;
  const viewportHeight = 420;
  const itemCount = data.length;
  const { startIndex, endIndex, offset } = useVirtualization({
    itemCount,
    itemHeight,
    viewportHeight,
    scrollTop,
    overscan: 5,
  });
  const visible = data.slice(startIndex, endIndex).reverse(); // show newest first

  return (
    <div
      ref={viewportRef}
      style={{ height: viewportHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      <div style={{ height: itemCount * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offset}px)`, position: "absolute", left: 0, right: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={row.t + "-" + i}>
                  <td>{new Date(row.t).toLocaleTimeString()}</td>
                  <td>{row.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
