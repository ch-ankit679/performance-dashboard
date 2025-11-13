"use client";
import { useEffect, useRef, useState } from "react";

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [mem, setMem] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef(performance.now());
  const frames = useRef(0);

  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      frames.current++;
      const now = performance.now();
      const dt = now - lastTs.current;
      if (dt >= 1000) {
        const currentFps = (frames.current * 1000) / dt;
        setFps(Math.round(currentFps));
        frames.current = 0;
        lastTs.current = now;
        // memory: non-standard, best-effort
        // @ts-ignore
        if (performance && (performance as any).memory) {
          // bytes
          // @ts-ignore
          setMem(Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024));
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      alive = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { fps, mem };
}
