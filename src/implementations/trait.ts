import type { UnspecifiedTranslator } from "../translators/trait.ts";

export abstract class FileTranslator<T extends UnspecifiedTranslator> {
  translated: number = 0;

  /** Total amount of translations to be performed, this could be lines, properties, etc */
  abstract amount(): number;
}
