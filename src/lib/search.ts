import { BOOKS, GLOSSARY, GUIDED_PATHS, VERSES } from "./corpus";
import { parseCanonicalRef } from "./refs";
import type { Locale } from "./types";

export type SearchHit = {
  id: string;
  href: string;
  title: string;
  kind: "ref" | "book" | "glossary" | "path";
};

export function searchLocal(query: string, locale: Locale): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  const parsed = parseCanonicalRef(q);
  if (parsed) {
    const verse = parsed.verse
      ? VERSES.find(
          (item) =>
            item.canonicalRef.bookId === parsed.bookId &&
            item.canonicalRef.chapter === parsed.chapter &&
            item.canonicalRef.verse === parsed.verse,
        )
      : undefined;
    if (verse) {
      hits.push({
        id: verse.id,
        href: `/${locale}/read/${verse.canonicalRef.bookId}/${verse.canonicalRef.chapter}/#v${verse.canonicalRef.verse}`,
        title: verse.canonicalRef.display[locale],
        kind: "ref",
      });
    } else {
      const book = BOOKS.find((item) => item.id === parsed.bookId);
      if (book) {
        hits.push({
          id: `${book.id}-${parsed.chapter}`,
          href: `/${locale}/read/${book.id}/${parsed.chapter}/`,
          title: `${locale === "pt" ? book.titles.pt : book.titles.en} ${parsed.chapter}`,
          kind: "book",
        });
      }
    }
  }
  const lower = q.toLowerCase();
  for (const book of BOOKS) {
    const hay = [
      book.titles.en,
      book.titles.pt,
      book.titles.he,
      book.titles.transliteration,
      ...book.aliases,
    ]
      .join(" ")
      .toLowerCase();
    if (hay.includes(lower)) {
      hits.push({
        id: book.id,
        href: `/${locale}/library/#${book.division}`,
        title: `${locale === "pt" ? book.titles.pt : book.titles.en} · ${book.titles.he}`,
        kind: "book",
      });
    }
  }
  for (const entry of GLOSSARY) {
    const hay =
      `${entry.term.en} ${entry.term.pt} ${entry.term.he ?? ""} ${entry.short.en}`.toLowerCase();
    if (hay.includes(lower)) {
      hits.push({
        id: entry.id,
        href: `/${locale}/about/#glossary`,
        title: locale === "pt" ? entry.term.pt : entry.term.en,
        kind: "glossary",
      });
    }
  }
  for (const path of GUIDED_PATHS) {
    const hay = `${path.title.en} ${path.title.pt} ${path.summary.en}`.toLowerCase();
    if (hay.includes(lower)) {
      hits.push({
        id: path.id,
        href: `/${locale}/paths/${path.id}/`,
        title: locale === "pt" ? path.title.pt : path.title.en,
        kind: "path",
      });
    }
  }
  const seen = new Set<string>();
  return hits
    .filter((hit) => {
      if (seen.has(hit.id)) return false;
      seen.add(hit.id);
      return true;
    })
    .slice(0, 8);
}
