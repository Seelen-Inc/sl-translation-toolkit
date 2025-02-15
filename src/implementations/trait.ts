import type { UnspecifiedTranslator } from "../translators/trait.ts";
import { invokeWithGaps } from "../utils/mod.ts";

export abstract class FileTranslator<T extends UnspecifiedTranslator> {
  // gap is important to avoid Too many requests error
  gap: number = 200;
  // amount of translations performed
  performed: number = 0;
  translator: T;

  constructor(translator: T) {
    this.translator = translator;
  }

  /** Total amount of translations to be performed, this could be lines, properties, etc */
  abstract amount(): number;

  protected printInitialInfoAsNeeded() {
    if (this.performed > 0) {
      return;
    }
    console.info(
      `Starting translation from '${this.translator.source}' (total: ${this.amount()})`,
    );
  }

  /**
   * @param tasks task to perform
   * @param target is only used to be printed on console
   */
  protected async performTasks(
    tasks: Array<() => Promise<void>>,
    target: string,
  ) {
    console.info(
      `  - translating ${tasks.length} texts to '${target}' with a gap of ${this.gap}ms (${
        this.translator.name(target)
      })`,
    );

    const promises = await invokeWithGaps(tasks, this.gap);
    await Promise.all(promises);
    this.performed += tasks.length;
  }
}
