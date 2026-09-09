import type { SourceSpan } from "./types";

const ALLOWED_KIND = new Set(["text", "emphasis", "lemma"]);

export function sanitizeSpans(spans: SourceSpan[]): SourceSpan[] {
  return spans
    .filter((span) => ALLOWED_KIND.has(span.kind) && typeof span.text === "string")
    .map((span) => ({ kind: span.kind, text: span.text.split("\0").join("") }));
}
