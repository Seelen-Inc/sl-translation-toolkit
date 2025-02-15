import { Translator } from "./trait.ts";
import * as GoogleTranslatorApi from "npm:google-translate-api-x@10.7.2";

export type SupportedSourceLangCodesByGoogle =
  keyof typeof GoogleTranslatorApi.languages;
export type SupportedTargetLangCodesByGoogle = Exclude<
  SupportedSourceLangCodesByGoogle,
  "auto"
>;

export class GoogleTranslator extends Translator<
  SupportedSourceLangCodesByGoogle,
  SupportedTargetLangCodesByGoogle
> {
  name = "Google";

  static isSupported(code: string): code is SupportedTargetLangCodesByGoogle {
    return GoogleTranslatorApi.isSupported(code);
  }

  async translate_to(
    target: SupportedSourceLangCodesByGoogle,
    input: string,
  ): Promise<string> {
    console.info(`  translating to ${target} using ${this.name}`);
    const res = await GoogleTranslatorApi.translate(input, {
      from: this.source,
      to: target,
      forceTo: true,
      forceBatch: false,
      autoCorrect: false,
    });
    return res.text;
  }
}
