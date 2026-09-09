import { PROVIDERS, VERSES } from "../src/lib/corpus";
import { isAllowedExternalHost } from "../src/lib/refs";

const allowed = PROVIDERS.flatMap((provider) => provider.allowedHosts);

for (const verse of VERSES) {
  if (!isAllowedExternalHost(verse.sefariaUrl, allowed)) {
    console.error(`unsafe Sefaria url on ${verse.id}`);
    process.exit(1);
  }
}

if (PROVIDERS.some((provider) => provider.runtimeRequired)) {
  console.error("a provider is marked runtimeRequired; v1 forbids this");
  process.exit(1);
}

console.log("providers ok");
