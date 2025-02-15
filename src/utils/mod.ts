export function totalTexts(v: unknown): number {
  if (!v || typeof v !== "object") {
    return 0;
  }

  let count = 0;
  deepIterateTexts(v, (_key, value) => {
    count += value.length;
  });
  return count;
}

export function deepIterateTexts(
  obj: unknown,
  callback: (key: PropertyKey, value: string, parent: any) => void,
): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    switch (typeof value) {
      case "string":
        callback(key, value, obj);
        break;
      case "object":
        deepIterateTexts(value, callback);
        break;
    }
  }
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
    task();
    await asyncSleep(gap);
  }
  return results;
}
