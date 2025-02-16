import { BackwardMapping, isSupported } from "./DeeplUtils.ts";
import { Translator } from "./trait.ts";
import * as DeeplTranslatorApi from "npm:deepl-node@1.16.0";

export type SupportedSourceLangCodesByDeepl =
  DeeplTranslatorApi.SourceLanguageCode;
export type SupportedTargetLangCodesByDeepl =
  DeeplTranslatorApi.TargetLanguageCode;

export class DeeplTranslator extends Translator<
  SupportedSourceLangCodesByDeepl,
  SupportedTargetLangCodesByDeepl
> {
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

  name(_target?: SupportedTargetLangCodesByDeepl): string {
    return "DeepL";
  }

  async translate_to(
    target: DeeplTranslatorApi.TargetLanguageCode,
    input: string,
  ): Promise<string> {
    if (BackwardMapping[target]) {
      console.info(
        `    Deprecated target '${target}' was mapped to '${
          BackwardMapping[target]
        }'`,
      );
    }
    const res = await this.__inner.translateText(
      input,
      this.source,
      BackwardMapping[target] || target,
    );
    return res.text;
  }
}
