import { DataPoint } from "./types";

/**
 * Convert data points to pixel positions for canvas rendering.
 * Includes a simple pixel-bucketing decimation: for each pixel column, we compute min/max
 * and draw as vertical line or polyline from one representative to next. This reduces
 * CPU/GPU burden for large datasets.
 */

export function decimateToPixels(
  points: DataPoint[],
  width: number,
  height: number,
  timeStart: number,
  timeEnd: number
) {
  if (width <= 0 || timeEnd <= timeStart || points.length === 0) return [];
  const cols = Math.min(width | 0, points.length);
  const bucketSize = (timeEnd - timeStart) / cols;
  const buckets: { min?: number; max?: number; t?: number }[] = new Array(cols).fill(null).map(() => ({}));

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.t < timeStart || p.t > timeEnd) continue;
    const col = Math.floor((p.t - timeStart) / bucketSize);
    if (col < 0 || col >= cols) continue;
    const bucket = buckets[col];
    if (bucket.min === undefined || p.value < bucket.min) bucket.min = p.value;
    if (bucket.max === undefined || p.value > bucket.max) bucket.max = p.value;
    bucket.t = p.t;
  }

  // map buckets to pixel coords
  let globalMin = Number.POSITIVE_INFINITY;
  let globalMax = Number.NEGATIVE_INFINITY;
  for (const b of buckets) {
    if (b.min !== undefined) {
      globalMin = Math.min(globalMin, b.min);
      globalMax = Math.max(globalMax, b.max as number);
    }
  }
  if (!isFinite(globalMin)) {
    globalMin = 0;
    globalMax = 1;
  }
  const range = globalMax - globalMin || 1;

  const pts: { x: number; yMin: number; yMax: number; t?: number }[] = [];
  for (let x = 0; x < buckets.length; x++) {
    const b = buckets[x];
    if (b.min === undefined) continue;
    const yMin = height - ((b.min - globalMin) / range) * height;
    const yMax = height - ((b.max as number - globalMin) / range) * height;
    pts.push({ x, yMin, yMax, t: b.t });
  }
  return pts;
}
