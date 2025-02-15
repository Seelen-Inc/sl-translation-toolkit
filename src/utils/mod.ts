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
