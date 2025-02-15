import { DeeplTranslator, SupportedSourceLangCodesByDeepl } from "./Deepl.ts";
import { GoogleTranslator, SupportedSourceLangCodesByGoogle } from "./Google.ts";
import { Translator } from "./trait.ts";

/**
 * Will select the best translator based on the source and target language
 */
export class AutoTranslator extends Translator<string, string> {
  name = "Auto";
  private deepl: DeeplTranslator;
  private google: GoogleTranslator;

  constructor({ source, deeplApiKey }: { deeplApiKey: string; source: string }) {
    super({ source });
    this.deepl = new DeeplTranslator({ source: source as SupportedSourceLangCodesByDeepl, apiKey: deeplApiKey });
    this.google =  new GoogleTranslator({ source: source as SupportedSourceLangCodesByGoogle });
  }

  override translate_to(to: string, input: string): Promise<string> {
    if (DeeplTranslator.isSupported(to)) {
      return this.deepl.translate_to(to, input);
    }
    if (GoogleTranslator.isSupported(to)) {
      return this.google.translate_to(to, input);
    }
    throw new Error(`Unsupported target language: ${to}`);
  }
}
