import { DataPoint } from "./types";

/**
 * Simple realistic time-series generator:
 * - Sine + noise + linear drift
 * - Produces `n` points spaced by `intervalMs`
 */

export const DATA_POINTS_INITIAL = 10000;

export function generateInitialDataset(n = DATA_POINTS_INITIAL, intervalMs = 100) {
  const now = Date.now();
  const out: DataPoint[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const ts = now - (n - i) * intervalMs;
    out[i] = {
      t: ts,
      value: generateValue(ts, i),
      series: "default",
    };
  }
  return out;
}

function generateValue(t: number, i: number) {
  const period = 10000 + (i % 500);
  const sine = Math.sin((t % period) / period * Math.PI * 2) * 50;
  const noise = (Math.random() - 0.5) * 8;
  const drift = (i / 10000) * 10;
  return 100 + sine + noise + drift;
}

/**
 * Streaming generator used by worker or main thread to create batches
 */
export function generateBatch(lastTimestamp: number, batchSize = 1, intervalMs = 100) {
  const out: DataPoint[] = [];
  for (let i = 0; i < batchSize; i++) {
    const ts = lastTimestamp + intervalMs * (i + 1);
    out.push({
      t: ts,
      value: generateValue(ts, ts % 100000),
      series: "default",
    });
  }
  return out;
}
