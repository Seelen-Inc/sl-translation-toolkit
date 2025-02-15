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
  static isSupported(code: string): code is SupportedTargetLangCodesByGoogle {
    return GoogleTranslatorApi.isSupported(code);
  }

  name(_target?: SupportedTargetLangCodesByGoogle): string {
    return "Google";
  }

  async translate_to(
    target: SupportedSourceLangCodesByGoogle,
    input: string,
  ): Promise<string> {
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
