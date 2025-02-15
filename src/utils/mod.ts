export function totalTexts(v: unknown): number {
  if (!v || typeof v !== "object") {
    return 0;
  }
  let count = 0;
  for (const value of Object.values(v)) {
    switch (typeof value) {
      case "string":
        count++;
        break;
      case "object":
        count += totalTexts(value);
        break;
    }
  }
  return count;
}

export function asyncSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function invokeWithGaps<R>(
  tasks: Array<() => R>,
  gap: number,
): Promise<Array<R>> {
  const results: Array<R> = [];
  for (const task of tasks) {
    results.push(task());
    await asyncSleep(gap);
  }
  return results;
}
