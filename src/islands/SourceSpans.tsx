import type { SourceSpan } from "../lib/types";
import { sanitizeSpans } from "../lib/sanitize";

export function SourceSpans({ spans, dir }: { spans: SourceSpan[]; dir?: "rtl" | "ltr" }) {
  return (
    <span dir={dir} lang={dir === "rtl" ? "he" : undefined}>
      {sanitizeSpans(spans).map((span, index) => {
        if (span.kind === "lemma") {
          return (
            <strong className="lemma" key={index}>
              {span.text}
            </strong>
          );
        }
        if (span.kind === "emphasis") {
          return <em key={index}>{span.text}</em>;
        }
        return <span key={index}>{span.text}</span>;
      })}
    </span>
  );
}
