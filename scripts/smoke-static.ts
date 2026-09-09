import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

if (!existsSync("dist")) {
  console.error("smoke-static: dist/ missing — run pnpm build first");
  process.exit(1);
}

const port = process.env.SMOKE_PORT ?? "8765";
const root = join(tmpdir(), `ben-noach-smoke-${port}`);
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });
symlinkSync(resolve("dist"), join(root, "ben-noach"));

const server = spawn(
  "python3",
  ["-m", "http.server", port, "--directory", root, "--bind", "127.0.0.1"],
  { stdio: "inherit" },
);

function stop(code: number): never {
  server.kill("SIGTERM");
  rmSync(root, { recursive: true, force: true });
  process.exit(code);
}

process.on("exit", () => {
  server.kill("SIGTERM");
  rmSync(root, { recursive: true, force: true });
});

async function waitFor(url: string, attempts = 40): Promise<string> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch {
      /* server still booting */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`no response from ${url}`);
}

try {
  const home = await waitFor(`http://127.0.0.1:${port}/ben-noach/en/`);
  if (!home.includes("Ben Noach")) {
    console.error("generic static host: home missing product name");
    stop(1);
  }
  if (!home.includes("/ben-noach/_astro/")) {
    console.error("generic static host: home missing prefixed assets");
    stop(1);
  }
  if (
    !home.includes('hreflang="en"') ||
    !home.includes("https://viniciusdaniel-law.github.io/ben-noach/en/")
  ) {
    console.error("generic static host: home missing absolute hreflang");
    stop(1);
  }
  if (/hreflang="[^"]+" href="\//.test(home)) {
    console.error("generic static host: relative hreflang href");
    stop(1);
  }
  const reader = await waitFor(`http://127.0.0.1:${port}/ben-noach/en/read/genesis/1/`);
  if (!reader.includes("בראשית")) {
    console.error("generic static host: reader missing Hebrew title");
    stop(1);
  }
  if (!reader.includes('class="verse"') || !reader.includes("verse-select")) {
    console.error("generic static host: reader missing verse document markup");
    stop(1);
  }
  if (reader.includes("<button") && /<button[^>]*class="verse"/.test(reader)) {
    console.error("generic static host: verse is a button");
    stop(1);
  }
  const cssHref = reader.match(/href="(\/ben-noach\/_astro\/[^"]+\.css)"/)?.[1];
  if (!cssHref) {
    console.error("generic static host: reader missing CSS");
    stop(1);
  } else {
    const css = await waitFor(`http://127.0.0.1:${port}${cssHref}`);
    if (!css.includes("Frank Ruhl Libre Variable")) {
      console.error("generic static host: CSS missing Hebrew font family");
      stop(1);
    }
  }
  console.log("generic static-host smoke ok");
  stop(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stop(1);
}
