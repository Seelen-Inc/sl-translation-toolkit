import {
  GoogleTranslator,
  MarkdownTranslator,
  ObjectTranslator,
} from "./src/lib.ts";

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
// Deno.writeTextFileSync("./es.json", JSON.stringify(myFullTranslation));
console.log(myFullTranslation);

// ===========================================

const markdown = Deno.readTextFileSync("./mocks/en.md");
const markdownTranslator = new MarkdownTranslator(markdown, translator);

const translatedMarkdown = await markdownTranslator.translate_to("es");
// Deno.writeTextFileSync("./es.md", translatedMarkdown);
console.log(translatedMarkdown);
