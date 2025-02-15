import { isSupported } from "./DeeplUtils.ts";
import { Translator } from "./trait.ts";
import * as DeeplTranslatorApi from "npm:deepl-node";

export type SupportedSourceLangCodesByDeepl =
  DeeplTranslatorApi.SourceLanguageCode;
export type SupportedTargetLangCodesByDeepl =
  DeeplTranslatorApi.TargetLanguageCode;

export class DeeplTranslator extends Translator<
  SupportedSourceLangCodesByDeepl,
  SupportedTargetLangCodesByDeepl
> {
  name = "DeepL";
  private __inner: DeeplTranslatorApi.Translator;

  static isSupported(code: string): code is SupportedTargetLangCodesByDeepl {
    return isSupported(code);
  }

  constructor({
    source,
    apiKey,
    options,
  }: {
    source: SupportedSourceLangCodesByDeepl;
    apiKey: string;
    options?: DeeplTranslatorApi.TranslatorOptions;
  }) {
    super({ source });
    this.__inner = new DeeplTranslatorApi.Translator(apiKey, options);
  }

  async translate_to(
    target: DeeplTranslatorApi.TargetLanguageCode,
    input: string,
  ): Promise<string> {
    console.info(`  translating to ${target} using ${this.name}`);
    const res = await this.__inner.translateText(input, this.source, target);
    return res.text;
  }
}
