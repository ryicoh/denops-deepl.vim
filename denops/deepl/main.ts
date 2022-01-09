import { Denops } from "./deps.ts";

type TranslationResult = {
  detectedSourceLanguage: string;
  text: string;
};

const endpoint = "https://api-free.deepl.com/v2/translate";
export async function translate(
  authKey: string,
  targetLang: string,
  texts: string[],
): Promise<TranslationResult[]> {
  const body = new URLSearchParams();
  body.set("auth_key", authKey);
  body.set("target_lang", targetLang);
  texts.forEach((text) => {
    body.set("text", text);
  });

  const response = await fetch(endpoint, {
    method: "POST",
    body,
  });

  const data = await response.json();

  return data["translations"].map((trans: any) => ({
    detectedSourceLanguage: trans["detected_source_language"],
    text: trans["text"],
  }));
}

export async function main(denops: Denops): Promise<void> {
  await denops.cmd(
    `command! -nargs=1 TranslateOnCursor call denops#notify("${denops.name}", "translateOnCursor", [<q-args>])`,
  );

  denops.dispatcher = {
    async translateOnCursor(...args: unknown[]): Promise<void> {
      const authKey = await denops.eval("g:deepl#auth_key") as string;
      try {
        const results = await translate(authKey, args[0] as string, ["Hello"]);
        await denops.cmd(`echo "${results[0].text}"`)
      } catch (err) {
        console.log(err);
      } finally {
        // clear(denops);
      }
    },
  };
}
