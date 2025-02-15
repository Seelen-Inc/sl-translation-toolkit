import denoJson from "../deno.json" with { type: "json" };

const newVersion = Deno.args[0];
if (!newVersion) {
  console.error(
    "Error: No version specified. Usage: deno task update-version <new-version>",
  );
  Deno.exit(1);
}

denoJson.version = newVersion;
await Deno.writeTextFile("deno.json", JSON.stringify(denoJson, null, 2) + '\n');

console.log(`Version updated to ${newVersion}`);

// add to git
await new Deno.Command("git", {
  args: ["add", "deno.json"],
  stderr: "inherit",
  stdout: "inherit",
}).output();

await new Deno.Command("git", {
  args: ["commit", "-m", `chore(release): v${newVersion}`],
  stderr: "inherit",
  stdout: "inherit",
}).output();

await new Deno.Command("git", {
  args: ["tag", "-s", `v${newVersion}`, "-m", `v${newVersion}`],
  stderr: "inherit",
  stdout: "inherit",
}).output();
