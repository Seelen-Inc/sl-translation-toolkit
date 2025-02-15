# Seelen Translation Toolkit

This project contains tools used to facilitate the translation of all the Seelen
projects.

In the example we use Deno, but you can use any other package manager.

```ts
import {
  GoogleTranslator,
  MarkdownTranslator,
  ObjectTranslator,
} from "@seelen/translation-toolkit";

const translator = new GoogleTranslator({ source: "en" });
const translated = await translator.translate_to("es", "Hello world!");
console.log(translated);

// ===========================================

// you also can translate YAML (js-yaml), TOML (toml), XML and any format that can be parsed as an JS Object
const mySourceObject = JSON.parse(Deno.readTextFileSync("./mocks/en.json"));
const myCachedTranslation = JSON.parse(
  Deno.readTextFileSync("./mocks/cached_es.json"),
);

const fileTranslator = new ObjectTranslator(mySourceObject, translator);
const myFullTranslation = await fileTranslator.translate_to(
  "es",
  myCachedTranslation,
);
Deno.writeTextFileSync("./es.json", JSON.stringify(myFullTranslation));

// ===========================================

const markdown = Deno.readTextFileSync("./mocks/en.md");
const markdownTranslator = new MarkdownTranslator(markdown, translator);

const translatedMarkdown = await markdownTranslator.translate_to("es");
Deno.writeTextFileSync("./es.md", translatedMarkdown);
```

**This library is available in**:

- [NPM](https://www.npmjs.com/package/@seelen/translation-toolkit)
- [JSR](https://jsr.io/@seelen/translation-toolkit)
- [Github](https://github.com/Seelen-Inc/sl-translation-toolkit)
