export function now() {
  return performance.now();
}

export function measure(fn: () => void) {
  const s = performance.now();
  fn();
  return performance.now() - s;
}
