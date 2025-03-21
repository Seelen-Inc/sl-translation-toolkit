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
    const trimmed = input.trim();
    if (trimmed.length <= 1) {
      // avoid perform an API call for single simbols
      return input;
    }
    const initialSpaces = input.match(/^\s+/)?.[0] || "";
    const finalSpaces = input.match(/\s+$/)?.[0] || "";

    try {
      const res = await GoogleTranslatorApi.translate(trimmed, {
        from: this.source,
        to: target,
        forceTo: true,
        forceBatch: false,
        autoCorrect: false,
      });

      // manually mantain the format
      return `${initialSpaces}${res.text}${finalSpaces}`;
    } catch (e) {
      throw new Error(`Error translating "${input}" to ${target}: ${e}`);
    }
  }
}
