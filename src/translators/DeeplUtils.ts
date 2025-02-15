import type { LanguageCode } from "npm:deepl-node@1.16.0";

const DeeplSupportedTargetLanguages = [
  "ar",
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "es",
  "et",
  "fi",
  "fr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "nb",
  "nl",
  "pl",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "tr",
  "uk",
  "zh",
  "en",
  "pt",
  "en-GB",
  "en-US",
  "pt-BR",
  "pt-PT",
] as const;

type OwnList = (typeof DeeplSupportedTargetLanguages)[number];
type areAllDeeplTargetLanguagesOnTheList = [LanguageCode] extends
  [OwnList] ? [OwnList] extends [LanguageCode] ? true
  : false
  : false;

const _assert: areAllDeeplTargetLanguagesOnTheList = true;

export function isSupported(code: string): boolean {
  return DeeplSupportedTargetLanguages.some((lang) =>
    lang.toLowerCase() === code.toLowerCase()
  );
}
