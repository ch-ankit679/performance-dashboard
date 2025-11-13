"use client";
import { useEffect, useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { DataPoint } from "@/lib/types";

/**
 * Exposes streaming meta information and allows subscribing to slices.
 * All streaming logic lives in DataProvider for determinism.
 */
export function useDataStream() {
  const { data, isPaused, batchSize, setBatchSize, pause, resume, reset } = useData();
  const [count, setCount] = useState(data.length);
  const [lastTs, setLastTs] = useState<number>(data.length ? data[data.length - 1].t : Date.now());

  useEffect(() => {
    setCount(data.length);
    if (data.length > 0) setLastTs(data[data.length - 1].t);
  }, [data]);

  return {
    data,
    count,
    lastTs,
    isPaused,
    batchSize,
    setBatchSize,
    pause,
    resume,
    reset,
  };
}
