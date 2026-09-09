import { loc } from "../lib/corpus";
import { t } from "../lib/i18n";
import { ADDRESS_LABELS, SCOPE_LABELS } from "../lib/scope";
import type {
  CommentarySegment,
  Elucidation,
  Locale,
  ReaderPayload,
  SourceLink,
  StudyMode,
  Verse,
} from "../lib/types";
import { SourceSpans } from "./SourceSpans";

function versionOf(payload: ReaderPayload, id: string) {
  return payload.versions.find((item) => item.id === id);
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
      <p
        className="verse-he hebrew"
        lang="he"
        dir="rtl"
        style={{ fontSize: "1.35rem", margin: "0.6rem 0 0.4rem" }}
      >
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
  const noahide = bySlot("for-bnei-noach");
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

      <Section title={t(locale, "whoAddressed")}>
        <p>
          <strong>{ADDRESS_LABELS[verse.address][locale]}.</strong> {loc(verse.addressNote, locale)}
        </p>
        <p className="meta-line">
          {verse.scopeTags.map((tag) => SCOPE_LABELS[tag][locale]).join(" · ")}
        </p>
      </Section>

      {eluc.some((item) => item.slot === "understanding-rashi" || item.slot === "why-rashi") && (
        <Terms locale={locale} payload={payload} />
      )}

      {noahide && (
        <Section title={t(locale, "forBneiNoach")} layer="guidance">
          <p className="latin">{loc(noahide.text, locale)}</p>
          {noahide.reviewNote && <p className="meta-line">{noahide.reviewNote}</p>}
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
        <p className="latin" lang="en" dir="ltr" style={{ marginTop: "0.7rem" }}>
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

function Terms({ locale, payload }: { locale: Locale; payload: ReaderPayload }) {
  const needed = ["rashi", "dibbur-hamatchil", "peshat", "derash", "siftei-chakhamim"];
  const entries = payload.glossary.filter((item) => needed.includes(item.id));
  return (
    <Section title={t(locale, "terms")}>
      <dl>
        {entries.map((entry) => (
          <div key={entry.id} style={{ marginBottom: "0.7rem" }}>
            <dt className="kicker">{loc(entry.term, locale)}</dt>
            <dd style={{ margin: "0.2rem 0 0" }}>{loc(entry.short, locale)}</dd>
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
            <p className="latin" lang="en" dir="ltr" style={{ marginTop: "0.6rem" }}>
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
        <p style={{ marginTop: "0.9rem" }}>
          <a href={verse.sefariaUrl} rel="noopener noreferrer">
            {t(locale, "continueSefaria")}
          </a>
        </p>
      </Section>
    </>
  );
}
