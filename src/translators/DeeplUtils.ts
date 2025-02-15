import type { TargetLanguageCode } from "npm:deepl-node@1.16.0";

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
  "en-GB",
  "en-US",
  "pt-BR",
  "pt-PT",
] as const;

type OwnList = (typeof DeeplSupportedTargetLanguages)[number];
type areAllDeeplTargetLanguagesOnTheList = [TargetLanguageCode] extends
  [OwnList] ? [OwnList] extends [TargetLanguageCode] ? true
  : false
  : false;

const _assert: areAllDeeplTargetLanguagesOnTheList = true;

const BackwardMapping: Record<string, TargetLanguageCode> = {
  en: "en-US",
  pt: "pt-BR",
};

export function isSupported(code: string): boolean {
  const mappedCode = BackwardMapping[code].toLowerCase() ?? code.toLowerCase();
  return DeeplSupportedTargetLanguages.some(
    (lang) => lang.toLowerCase() === mappedCode, // Deepl API accept case-insensitive language codes.
  );
}
