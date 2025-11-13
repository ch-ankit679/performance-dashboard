// public/workers/dataWorker.ts
export {};

interface DataPoint {
  t: number;
  value: number;
}

let intervalId: ReturnType<typeof setInterval> | null = null;
let batchSize = 10;

function startStream() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const now = Date.now();
    const points: DataPoint[] = [];
    for (let i = 0; i < batchSize; i++) {
      points.push({
        t: now + i,
        value: Math.sin(now / 1000 + i) * 50 + Math.random() * 20,
      });
    }
    postMessage({ type: "data", payload: points });
  }, 1000);
}

function stopStream() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

self.onmessage = (e: MessageEvent) => {
  const { type, value } = e.data;
  switch (type) {
    case "start":
      startStream();
      break;
    case "pause":
      stopStream();
      break;
    case "batchSize":
      batchSize = value;
      break;
    case "reset":
      stopStream();
      postMessage({ type: "reset" });
      break;
  }
};
