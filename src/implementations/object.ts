import { Translator } from "../translators/trait.ts";
import { deepIterateTexts, invokeWithGaps, totalTexts } from "../utils/mod.ts";
import { FileTranslator } from "./trait.ts";
import rfdc from "npm:rfdc";

const cloneDeep = rfdc();

export class ObjectTranslator<
  Source extends string,
  Target extends string,
  T extends Translator<Source, Target>,
> extends FileTranslator<T> {
  private obj: object;
  private translator: T;

  constructor(object: object, translator: T) {
    super();
    this.obj = object;
    this.translator = translator;
  }

  amount(): number {
    return totalTexts(this.obj);
  }

  async translate_to(target: Target): Promise<object> {
    console.info(`  translating to ${target}`);
    const tasks: Array<() => Promise<void>> = [];

    const newObj = cloneDeep(this.obj);
    deepIterateTexts(newObj, (key, value, obj) => {
      tasks.push(async () => {
        obj[key] = await this.translator.translate_to(target, value);
      });
    });

    const promises = await invokeWithGaps(tasks, 200);
    await Promise.all(promises);
    return newObj;
  }

  async translate(targets: Target[]): Promise<Record<Target, object>> {
    console.info(
      `Starting translation from ${this.translator.source} using ${this.translator.name} (total: ${this.amount()})`,
    );
    const result = {} as Record<Target, object>;
    for (const target of targets) {
      result[target] = await this.translate_to(target);
    }
    return result;
  }
}
