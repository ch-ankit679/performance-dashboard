"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DataPoint } from "@/lib/types";
import { generateInitialDataset, generateBatch } from "@/lib/dataGenerator";

type DataContextType = {
  data: DataPoint[];
  append: (pts: DataPoint[]) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  setBatchSize: (n: number) => void;
  batchSize: number;
  reset: () => void;
};

const DataContext = createContext<DataContextType | null>(null);

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => generateInitialDataset(), []);
  const [data, setData] = useState<DataPoint[]>(initial);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const batchRef = useRef(1);
  const lastTsRef = useRef<number>(initial.length ? initial[initial.length - 1].t : Date.now());

  useEffect(() => {
    let raf = 0;
    let alive = true;
    let acc = 0;
    let last = performance.now();

    const tick = () => {
      const nowTs = performance.now();
      const dt = nowTs - last;
      last = nowTs;
      acc += dt;

      if (!pausedRef.current && acc >= 100) {
        const batch = batchRef.current;
        const pts = generateBatch(lastTsRef.current, batch, 100);
        lastTsRef.current = pts[pts.length - 1].t;

        setData((prev) => {
          const next = prev.concat(pts);
          const maxSize = 300000;
          if (next.length > maxSize) return next.slice(next.length - maxSize);
          return next;
        });
        acc = 0;
      }
      if (alive) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const append = (pts: DataPoint[]) => {
    setData((p) => p.concat(pts));
    if (pts.length) lastTsRef.current = pts[pts.length - 1].t;
  };

  const pause = () => {
    pausedRef.current = true;
    setIsPaused(true);
  };
  const resume = () => {
    pausedRef.current = false;
    setIsPaused(false);
  };
  const setBatchSize = (n: number) => {
    batchRef.current = Math.max(1, Math.floor(n));
  };
  const reset = () => {
    const init = generateInitialDataset();
    lastTsRef.current = init[init.length - 1].t;
    setData(init);
  };

  const value = useMemo(
    () => ({ data, append, pause, resume, isPaused, setBatchSize, batchSize: batchRef.current, reset }),
    [data, isPaused]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
