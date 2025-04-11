import type { Translator } from "../translators/trait.ts";
import { FileTranslator } from "./trait.ts";

export class ObjectTranslator<
  T extends object,
  Source extends string,
  Target extends string,
  Impl_Translator extends Translator<Source, Target>,
> extends FileTranslator<Impl_Translator> {
  private obj: T;

  constructor(object: T, translator: Impl_Translator) {
    super(translator);
    this.obj = object;
  }

  amount(): number {
    return totalTexts(this.obj);
  }

  private static create_translation_tasks(
    // deno-lint-ignore no-explicit-any
    sourceObj: any,
    target: string,
    // deno-lint-ignore no-explicit-any
    mut_obj: any,
    translator: Translator<string, string>,
    mut_tasks: Array<() => Promise<void>>,
  ) {
    for (const [key, value] of Object.entries(sourceObj)) {
      if (!value || key.startsWith("_") || key.startsWith("$")) {
        continue;
      }

      switch (typeof value) {
        case "string": {
          if (!mut_obj[key]) {
            // skip existing translations
            mut_tasks.push(async () => {
              mut_obj[key] = await translator.translate_to(target, value);
            });
          }
          break;
        }
        case "object": {
          mut_obj[key] ??= Array.isArray(value) ? [] : {};
          ObjectTranslator.create_translation_tasks(
            value,
            target,
            mut_obj[key],
            translator,
            mut_tasks,
          );
          break;
        }
      }
    }
    // this will remove keys unexistent in source object
    for (const key in mut_obj) {
      if (!sourceObj[key]) {
        delete mut_obj[key];
      }
    }
  }

  /**
   * If mut_obj is provided, it will only translate the new texts
   * maintaining the existing ones without modifications
   *
   * @param target language code to translate
   * @param cached the cached/old translated object
   * @returns the translated object
   */
  async translate_to(target: Target, cached?: T): Promise<T> {
    this.printInitialInfoAsNeeded();
    // deno-lint-ignore no-explicit-any
    const translating: any = cached || (Array.isArray(this.obj) ? [] : {});
    const tasks: Array<() => Promise<void>> = [];
    ObjectTranslator.create_translation_tasks(
      this.obj,
      target,
      translating,
      this.translator,
      tasks,
    );
    await this.performTasks(tasks, target);
    return translating;
  }
}

function totalTexts(v: unknown): number {
  if (!v || typeof v !== "object") {
    return 0;
  }
  let count = 0;
  for (const value of Object.values(v)) {
    switch (typeof value) {
      case "string":
        count++;
        break;
      case "object":
        count += totalTexts(value);
        break;
    }
  }
  return count;
}
