import { Translator } from "./trait.ts";
import * as GoogleTranslatorApi from "npm:google-translate-api-x";

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
    to: SupportedSourceLangCodesByGoogle,
    input: string,
  ): Promise<string> {
    const res = await GoogleTranslatorApi.translate(input, {
      from: this.source,
      to: to,
      forceTo: true,
      forceBatch: false,
      autoCorrect: false,
    });
    return res.text;
  }
}
