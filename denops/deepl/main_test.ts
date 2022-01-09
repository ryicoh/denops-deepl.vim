import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { translate } from "./main.ts";

const authKey = Deno.env.get("DEEPL_AUTH_KEY");
if (!authKey) {
  throw new Error("`DEEPL_AUTH_KEY` is empty!!");
}

Deno.test("translate", async () => {
  assertEquals(
    await translate(authKey, "JA", ["Hello"]),
    [
      {
        detectedSourceLanguage: "EN",
        text: "こんにちは",
      },
    ],
  );
});
