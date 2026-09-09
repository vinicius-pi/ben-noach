import { loc } from "../lib/corpus";
import { glossaryForMaterial } from "../lib/glossary";
import { t } from "../lib/i18n";
import { ADDRESS_LABELS, SCOPE_LABELS } from "../lib/scope";
import type {
  CommentarySegment,
  Elucidation,
  GlossaryEntry,
  Locale,
  ReaderPayload,
  SourceLink,
  StudyMode,
  Verse,
} from "../lib/types";
import { SourceSpans } from "./SourceSpans";

const APPLICABILITY_SCOPE_TAGS = new Set([
  "NOAHIDE_CORE",
  "NATIONS_PROPHECY",
  "ISRAEL_COVENANT_CONTEXT",
  "JEWISH_PRACTICE_SPECIFIC",
  "REVIEW_REQUIRED",
]);

function versionOf(payload: ReaderPayload, id: string) {
  return payload.versions.find((item) => item.id === id);
}

function shouldShowApplicability(verse: Verse): boolean {
  return verse.scopeTags.some((tag) => APPLICABILITY_SCOPE_TAGS.has(tag));
}

function Section({
  title,
  layer,
  children,
}: {
  title: string;
  layer?: "source" | "editorial" | "guidance";
  children: React.ReactNode;
}) {
  return (
    <section className={`study-section ${layer ? `${layer}-block` : ""}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function StudyContent({
  payload,
  verse,
  mode,
}: {
  payload: ReaderPayload;
  verse: Verse;
  mode: StudyMode;
}) {
  const locale = payload.locale;
  const rashi = payload.segments.filter(
    (segment) => segment.targetVerseId === verse.id && segment.workId === "rashi-on-genesis",
  );
  const siftei = payload.segments.filter(
    (segment) =>
      segment.targetVerseId === verse.id && segment.workId === "siftei-chakhamim-on-genesis",
  );
  const eluc = payload.elucidations.filter((item) => item.verseId === verse.id);
  const bySlot = (slot: Elucidation["slot"], segmentId?: string) =>
    eluc.find((item) => item.slot === slot && (!segmentId || item.targetSegmentId === segmentId));
  const links = payload.links.filter(
    (link) =>
      link.from === verse.id ||
      link.to === verse.id ||
      rashi.some((segment) => segment.id === link.from || segment.id === link.to),
  );

  return (
    <div className="study-body">
      <p className="kicker">
        {verse.canonicalRef.display[locale]} · {verse.canonicalRef.display.he}
      </p>
      <p className="verse-he hebrew study-quote-he" lang="he" dir="rtl">
        {verse.hebrew.text}
      </p>
      <p className="latin" lang="en" dir="ltr">
        {verse.translation.text}
      </p>

      {mode !== "read" && (
        <>
          <UnderstandBlock
            locale={locale}
            verse={verse}
            rashi={rashi}
            eluc={eluc}
            bySlot={bySlot}
            payload={payload}
          />
          {mode === "sources" && (
            <SourcesBlock
              locale={locale}
              verse={verse}
              rashi={rashi}
              siftei={siftei}
              links={links}
              payload={payload}
            />
          )}
        </>
      )}
    </div>
  );
}

function UnderstandBlock({
  locale,
  verse,
  rashi,
  eluc,
  bySlot,
  payload,
}: {
  locale: Locale;
  verse: Verse;
  rashi: CommentarySegment[];
  eluc: Elucidation[];
  bySlot: (slot: Elucidation["slot"], segmentId?: string) => Elucidation | undefined;
  payload: ReaderPayload;
}) {
  const verseEluc = bySlot("understanding-the-verse");
  const applicability = bySlot("for-bnei-noach");
  const showApplicability = shouldShowApplicability(verse);

  return (
    <>
      {verseEluc && (
        <Section title={t(locale, "understandingVerse")} layer="editorial">
          <p className="latin">{loc(verseEluc.text, locale)}</p>
          {verseEluc.classicalFeature && <p className="meta-line">{verseEluc.classicalFeature}</p>}
        </Section>
      )}

      {rashi.length === 0 ? (
        <Section title={t(locale, "rashi")} layer="source">
          <p>{t(locale, "noRashi")}</p>
        </Section>
      ) : (
        rashi.map((segment) => (
          <RashiUnit
            key={segment.id}
            locale={locale}
            segment={segment}
            why={bySlot("why-rashi", segment.id) ?? undefined}
            understand={bySlot("understanding-rashi", segment.id) ?? undefined}
            payload={payload}
          />
        ))
      )}

      {showApplicability && (
        <Section title={t(locale, "whoAddressed")}>
          <p>
            <strong>{ADDRESS_LABELS[verse.address][locale]}.</strong>{" "}
            {loc(verse.addressNote, locale)}
          </p>
          <p className="meta-line">
            {verse.scopeTags.map((tag) => SCOPE_LABELS[tag][locale]).join(" · ")}
          </p>
        </Section>
      )}

      {eluc.length > 0 && (
        <Terms locale={locale} entries={glossaryForMaterial(payload.glossary, eluc)} />
      )}

      {applicability && showApplicability && (
        <Section title={t(locale, "forBneiNoach")} layer="guidance">
          <p className="latin">{loc(applicability.text, locale)}</p>
          {applicability.type === "RABBINIC_GUIDANCE" && applicability.reviewNote && (
            <p className="meta-line">{applicability.reviewNote}</p>
          )}
        </Section>
      )}
    </>
  );
}

function RashiUnit({
  locale,
  segment,
  why,
  understand,
  payload,
}: {
  locale: Locale;
  segment: CommentarySegment;
  why?: Elucidation | undefined;
  understand?: Elucidation | undefined;
  payload: ReaderPayload;
}) {
  const version = payload.versions.find((item) => item.id === segment.english.versionId);
  return (
    <>
      <Section
        title={`${t(locale, "rashi")} · ${segment.dibburHamatchil || segment.segment}`}
        layer="source"
      >
        <p className="hebrew" lang="he" dir="rtl">
          <SourceSpans spans={segment.hebrew.spans} dir="rtl" />
        </p>
        <p className="latin study-quote-en" lang="en" dir="ltr">
          <SourceSpans spans={segment.english.spans} />
        </p>
        {version && (
          <p className="meta-line">
            {version.versionTitle} · {version.licenseLabel}
          </p>
        )}
      </Section>
      {why && (
        <Section title={t(locale, "whyRashi")} layer="editorial">
          <p className="latin">{loc(why.text, locale)}</p>
        </Section>
      )}
      {understand && (
        <Section title={t(locale, "understandingRashi")} layer="editorial">
          <p className="latin">{loc(understand.text, locale)}</p>
        </Section>
      )}
    </>
  );
}

function Terms({ locale, entries }: { locale: Locale; entries: GlossaryEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <Section title={t(locale, "terms")}>
      <dl>
        {entries.map((entry) => (
          <div key={entry.id} className="glossary-item">
            <dt className="kicker">{loc(entry.term, locale)}</dt>
            <dd>{loc(entry.short, locale)}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function SourcesBlock({
  locale,
  verse,
  rashi,
  siftei,
  links,
  payload,
}: {
  locale: Locale;
  verse: Verse;
  rashi: CommentarySegment[];
  siftei: CommentarySegment[];
  links: SourceLink[];
  payload: ReaderPayload;
}) {
  const heVersion = versionOf(payload, verse.hebrew.versionId);
  const enVersion = versionOf(payload, verse.translation.versionId);
  const ladder = [
    verse.canonicalRef.display[locale],
    rashi[0] ? "Rashi" : null,
    siftei[0] ? "Siftei Chakhamim" : null,
    t(locale, "editorialLayer"),
  ].filter(Boolean);

  return (
    <>
      <Section title={t(locale, "whereFrom")} layer="source">
        <p>{ladder.join(" → ")}</p>
        <ul>
          {links
            .filter((link) => link.relationship === "RASHI_SOURCE")
            .map((link) => (
              <li key={link.id}>
                {link.localTextAvailable ? (
                  link.to
                ) : (
                  <a href={link.externalUrl} rel="noopener noreferrer">
                    {link.to}
                  </a>
                )}
              </li>
            ))}
        </ul>
      </Section>

      {siftei.map((segment) => {
        const version = versionOf(payload, segment.english.versionId);
        return (
          <Section
            key={segment.id}
            title={`Siftei Chakhamim · ${segment.dibburHamatchil}`}
            layer="source"
          >
            {segment.hebrew.plain && (
              <p className="hebrew" lang="he" dir="rtl">
                <SourceSpans spans={segment.hebrew.spans} dir="rtl" />
              </p>
            )}
            <p className="latin study-quote-en" lang="en" dir="ltr">
              <SourceSpans spans={segment.english.spans} />
            </p>
            {version && (
              <p className="meta-line">
                {t(locale, "attribution")}: {version.attribution}
              </p>
            )}
          </Section>
        );
      })}

      <Section title={t(locale, "provenance")}>
        <ul className="meta-line">
          <li>
            {t(locale, "version")}: {heVersion?.versionTitle} · {heVersion?.licenseLabel}
          </li>
          <li>
            {t(locale, "version")}: {enVersion?.versionTitle} · {enVersion?.licenseLabel}
          </li>
          <li>
            {t(locale, "checksum")}: {verse.payloadChecksumSha256.slice(0, 16)}…
          </li>
        </ul>
        <p className="continue-link">
          <a href={verse.sefariaUrl} rel="noopener noreferrer">
            {t(locale, "continueSefaria")}
          </a>
        </p>
      </Section>
    </>
  );
}
