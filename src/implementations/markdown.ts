import type { Translator } from "../translators/trait.ts";
import { FileTranslator } from "./trait.ts";

// @deno-types="npm:@types/mdast@3.0.15"
import type { Parent, Root } from "npm:mdast@3.0.0";
import { remark } from "npm:remark@14.0.2";
import rfdc from "npm:rfdc@1.4.1";

const clone = rfdc({ proto: true });

export class MarkdownTranslator<
  Source extends string,
  Target extends string,
  Impl_Translator extends Translator<Source, Target>,
> extends FileTranslator<Impl_Translator> {
  private markdown: Root;

  constructor(markdown: string, translator: Impl_Translator) {
    super(translator);
    this.markdown = remark().parse(markdown);
  }

  override amount(): number {
    return 0;
  }

  private static create_translation_tasks(
    mut_ast: Parent,
    target: string,
    translator: Translator<string, string>,
    mut_tasks: Array<() => Promise<void>>,
  ) {
    for (const child of mut_ast.children) {
      // avoid tranlate code block for now
      if (child.type === "code") {
        continue;
      }

      if (child.type == "text") {
        mut_tasks.push(async () => {
          child.value = await translator.translate_to(target, child.value);
        });
        continue;
      }

      if ("children" in child) {
        MarkdownTranslator.create_translation_tasks(
          child,
          target,
          translator,
          mut_tasks,
        );
      }
    }
  }

  async translate_to(target: Target): Promise<string> {
    this.printInitialInfoAsNeeded();
    const mut_ast = clone(this.markdown);
    const tasks: Array<() => Promise<void>> = [];
    MarkdownTranslator.create_translation_tasks(
      mut_ast,
      target,
      this.translator,
      tasks,
    );
    await this.performTasks(tasks, target);
    return remark().stringify(mut_ast);
  }
}
