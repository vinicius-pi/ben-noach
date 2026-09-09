import books from "../data/books.json";
import passages from "../data/passages.json";
import verses from "../data/verses.json";
import textVersions from "../data/text-versions.json";
import commentaryWorks from "../data/commentary-works.json";
import commentarySegments from "../data/commentary-segments.json";
import elucidations from "../data/elucidations.json";
import sourceLinks from "../data/source-links.json";
import glossary from "../data/glossary.json";
import guidedPaths from "../data/guided-paths.json";
import reviewRecords from "../data/review-records.json";
import providers from "../data/providers.json";
import licenses from "../data/licenses.json";
import sourceManifest from "../data/source-manifest.json";
import type {
  Book,
  CommentarySegment,
  CommentaryWork,
  Elucidation,
  GlossaryEntry,
  GuidedPath,
  Locale,
  Passage,
  ReaderPayload,
  ReviewRecord,
  SourceLink,
  SourceManifestEntry,
  TextVersion,
  Verse,
} from "./types";

export const BOOKS = books as Book[];
export const PASSAGES = passages as Passage[];
export const VERSES = verses as Verse[];
export const TEXT_VERSIONS = textVersions as TextVersion[];
export const COMMENTARY_WORKS = commentaryWorks as CommentaryWork[];
export const COMMENTARY_SEGMENTS = commentarySegments as CommentarySegment[];
export const ELUCIDATIONS = elucidations as Elucidation[];
export const SOURCE_LINKS = sourceLinks as SourceLink[];
export const GLOSSARY = glossary as GlossaryEntry[];
export const GUIDED_PATHS = guidedPaths as GuidedPath[];
export const REVIEW_RECORDS = reviewRecords as ReviewRecord[];
export const PROVIDERS = providers as {
  id: string;
  allowedHosts: string[];
  runtimeRequired: boolean;
}[];
export const LICENSES = licenses as { id: string; spdx?: string | null }[];
export const SOURCE_MANIFEST = sourceManifest as SourceManifestEntry[];

export function getBook(id: string): Book | undefined {
  return BOOKS.find((book) => book.id === id);
}

export function getPassage(bookId: string, chapter: number): Passage | undefined {
  return PASSAGES.find((passage) => passage.bookId === bookId && passage.chapter === chapter);
}

export function versesForPassage(passage: Passage): Verse[] {
  return passage.verseIds
    .map((id) => VERSES.find((verse) => verse.id === id))
    .filter((verse): verse is Verse => Boolean(verse));
}

export function segmentsForVerse(verseId: string, workId?: string): CommentarySegment[] {
  return COMMENTARY_SEGMENTS.filter(
    (segment) => segment.targetVerseId === verseId && (!workId || segment.workId === workId),
  ).sort((a, b) => a.segment - b.segment);
}

export function elucidationsForVerse(verseId: string): Elucidation[] {
  return ELUCIDATIONS.filter((item) => item.verseId === verseId);
}

export function linksFrom(id: string): SourceLink[] {
  return SOURCE_LINKS.filter((link) => link.from === id || link.to === id);
}

export function buildReaderPayload(
  locale: Locale,
  bookId: string,
  chapter: number,
): ReaderPayload | null {
  const book = getBook(bookId);
  const passage = getPassage(bookId, chapter);
  if (!book || !passage) return null;
  const verses = versesForPassage(passage);
  const verseIds = new Set(verses.map((verse) => verse.id));
  return {
    locale,
    passage,
    book,
    verses,
    segments: COMMENTARY_SEGMENTS.filter((segment) => verseIds.has(segment.targetVerseId)),
    elucidations: ELUCIDATIONS.filter((item) => verseIds.has(item.verseId)),
    links: SOURCE_LINKS.filter(
      (link) =>
        verseIds.has(link.from) ||
        verseIds.has(link.to) ||
        link.from.startsWith("rashi-") ||
        link.from.startsWith("siftei-"),
    ),
    glossary: GLOSSARY,
    versions: TEXT_VERSIONS,
    works: COMMENTARY_WORKS,
  };
}

export function loc<T extends { en: string; pt: string }>(value: T, locale: Locale): string {
  return locale === "pt" ? value.pt : value.en;
}
