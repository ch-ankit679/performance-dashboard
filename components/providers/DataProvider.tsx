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

  // ✅ Ensure initial dataset timestamps are in milliseconds
  const initial = useMemo(() => {
    return generateInitialDataset().map(p => ({
      ...p,
      t: p.t < 1e12 ? p.t * 1000 : p.t     // convert seconds → ms
    }));
  }, []);

  const [data, setData] = useState<DataPoint[]>(initial);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const batchRef = useRef(1);

  const lastTsRef = useRef<number>(
    initial.length ? initial[initial.length - 1].t : Date.now()
  );

  // Streaming loop (every 100ms)
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

        // ✅ Ensure generated data uses milliseconds
        const pts = generateBatch(lastTsRef.current, batch, 100).map(p => ({
          ...p,
          t: p.t < 1e12 ? p.t * 1000 : p.t
        }));

        lastTsRef.current = pts[pts.length - 1].t;

        setData(prev => {
          const next = prev.concat(pts);
          const maxSize = 300000;
          return next.length > maxSize ? next.slice(-maxSize) : next;
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
    const safe = pts.map(p => ({
      ...p,
      t: p.t < 1e12 ? p.t * 1000 : p.t
    }));
    setData(prev => prev.concat(safe));
    if (safe.length) lastTsRef.current = safe[safe.length - 1].t;
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
    const init = generateInitialDataset().map(p => ({
      ...p,
      t: p.t < 1e12 ? p.t * 1000 : p.t
    }));
    lastTsRef.current = init[init.length - 1].t;
    setData(init);
  };

  const value = useMemo(
    () => ({
      data,
      append,
      pause,
      resume,
      isPaused,
      setBatchSize,
      batchSize: batchRef.current,
      reset
    }),
    [data, isPaused]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
