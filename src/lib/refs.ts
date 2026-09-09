const BOOK_ALIASES: Record<string, string> = {
  genesis: "genesis",
  bereshit: "genesis",
  bereshith: "genesis",
  gênesis: "genesis",
  gn: "genesis",
  gen: "genesis",
  exodus: "exodus",
  shemot: "exodus",
  êxodo: "exodus",
  ex: "exodus",
  isaiah: "isaiah",
  yeshayahu: "isaiah",
  isaías: "isaiah",
  isa: "isaiah",
  psalms: "psalms",
  tehillim: "psalms",
  salmos: "psalms",
  ps: "psalms",
};

export type ParsedRef = {
  bookId: string;
  chapter: number;
  verse?: number;
};

export function normalizeBookAlias(input: string): string | null {
  const key = input.normalize("NFKC").trim().toLowerCase().replace(/['’]/g, "");
  return BOOK_ALIASES[key] ?? null;
}

const REF_RE = /^([A-Za-zÀ-ÿ'’]+)(?:\s+|[.])(\d+)(?:[:.](\d+))?$/u;

export function parseCanonicalRef(input: string): ParsedRef | null {
  const trimmed = input.trim();
  const match = REF_RE.exec(trimmed);
  if (!match) return null;
  const bookId = normalizeBookAlias(match[1] ?? "");
  const chapter = Number(match[2]);
  if (!bookId || !Number.isInteger(chapter) || chapter < 1) return null;
  if (match[3]) {
    const verse = Number(match[3]);
    if (!Number.isInteger(verse) || verse < 1) return null;
    return { bookId, chapter, verse };
  }
  return { bookId, chapter };
}

export function verseId(bookId: string, chapter: number, verse: number): string {
  return `${bookId}-${chapter}-${verse}`;
}

export function isAllowedExternalHost(url: string, allowed: readonly string[]): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return allowed.includes(parsed.hostname);
  } catch {
    return false;
  }
}
