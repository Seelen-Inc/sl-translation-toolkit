export abstract class Translator<Source extends string, Target extends string> {
  abstract get name(): string;
  source: Source;

  constructor({ source }: { source: Source }) {
    this.source = source;
  }

  abstract translate_to(to: Target, input: string): Promise<string>;
}

export type UnspecifiedTranslator = Translator<string, string>;
