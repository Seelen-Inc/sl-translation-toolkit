export abstract class Translator<Source extends string, Target extends string> {
  // target is used to print the used API on translators that uses multiple translations APIs
  abstract name(target?: Target): string;
  source: Source;
  firstTranslation: boolean = true;

  constructor({ source }: { source: Source }) {
    this.source = source;
  }

  abstract translate_to(to: Target, input: string): Promise<string>;
}

export type UnspecifiedTranslator = Translator<string, string>;
