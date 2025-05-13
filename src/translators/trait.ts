import { invokeWithGaps } from "../utils/mod.ts";

export abstract class Translator<Source extends string, Target extends string> {
  // target is used to print the used API on translators that uses multiple translations APIs
  abstract name(target?: Target): string;
  source: Source;
  firstTranslation: boolean = true;

  constructor({ source }: { source: Source }) {
    this.source = source;
  }

  abstract translate_to(to: Target, input: string): Promise<string>;

  async translate_to_multiple(
    to: Target[],
    input: string,
  ): Promise<Record<Target, string>> {
    const translated = {} as Record<Target, string>;

    const tasks = to.map((target) => async () => {
      translated[target] = await this.translate_to(target, input);
    });

    console.info(
      `  - translating 1 text to ${tasks.length} targets with a gap of 200ms`,
    );
    const result = await invokeWithGaps(tasks, 200);
    await Promise.all(result);

    return translated;
  }
}

export type UnspecifiedTranslator = Translator<string, string>;
