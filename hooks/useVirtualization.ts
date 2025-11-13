"use client";
import { useMemo } from "react";

/**
 * Simple virtualization helper for data table: compute visible slice indices
 * based on itemHeight and scrollTop client values.
 */

export function useVirtualization({
  itemCount,
  itemHeight,
  viewportHeight,
  scrollTop,
  overscan = 5,
}: {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(itemCount, startIndex + visibleCount);
  const offset = startIndex * itemHeight;
  return useMemo(() => ({ startIndex, endIndex, offset }), [startIndex, endIndex, offset]);
}
