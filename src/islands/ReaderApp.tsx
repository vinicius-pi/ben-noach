import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { t, withBase } from "../lib/i18n";
import { readLocalState, writeLocalState } from "../lib/storage";
import type { AppearanceState, Locale, ReaderPayload, StudyMode, Verse } from "../lib/types";
import { StudyContent } from "./StudyContent";

type Props = {
  payload: ReaderPayload;
};

export default function ReaderApp({ payload }: Props) {
  const { locale, verses, book, passage } = payload;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyMode>("read");
  const [appearance, setAppearance] = useState<AppearanceState>({
    textScale: "m",
    showHebrew: true,
    showTranslation: true,
  });
  const [saved, setSaved] = useState<string[]>([]);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [desktop, setDesktop] = useState(true);

  const selected = verses.find((verse) => verse.id === selectedId) ?? null;
  const open = Boolean(selected) && mode !== "read";
  const studyPanelId = "study-panel";

  useEffect(() => {
    const state = readLocalState();
    setAppearance(state.appearance);
    setSaved(state.saved);
    document.documentElement.dataset.text = state.appearance.textScale;
    writeLocalState({
      ...state,
      lastHref: withBase(`/${locale}/read/${book.id}/${passage.chapter}/`),
      lastLabel: `${locale === "pt" ? book.titles.pt : book.titles.en} ${passage.chapter}`,
    });
  }, [book.id, book.titles.en, book.titles.pt, locale, passage.chapter]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.text = appearance.textScale;
    writeLocalState({
      ...readLocalState(),
      appearance,
      saved,
    });
  }, [appearance, saved]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 961px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setChromeHidden(y > 80 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const focusVerseControl = useCallback((verse: Verse) => {
    document.getElementById(`verse-select-${verse.canonicalRef.verse}`)?.focus();
  }, []);

  const selectVerse = useCallback((verse: Verse, nextMode: StudyMode = "understand") => {
    setSelectedId(verse.id);
    setMode(nextMode);
    document.getElementById(`v${verse.canonicalRef.verse}`)?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    history.replaceState(null, "", `#v${verse.canonicalRef.verse}`);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#v", "");
    const verse = verses.find((item) => String(item.canonicalRef.verse) === hash);
    if (verse) setSelectedId(verse.id);
  }, [verses]);

  const onControlKey = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, verse: Verse, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectVerse(verse, "understand");
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const next = verses[index + 1];
        if (next) {
          setSelectedId(next.id);
          focusVerseControl(next);
        }
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = verses[index - 1];
        if (prev) {
          setSelectedId(prev.id);
          focusVerseControl(prev);
        }
      }
      if (event.key === "Escape") {
        setMode("read");
      }
    },
    [focusVerseControl, selectVerse, verses],
  );

  const onVersePointer = useCallback(
    (event: React.MouseEvent<HTMLElement>, verse: Verse) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button, input, select, textarea, label")) return;
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      selectVerse(verse);
    },
    [selectVerse],
  );

  const toolbar = useMemo(
    () => (
      <div className="reader-toolbar ui">
        <p className="kicker">
          {locale === "pt" ? book.titles.pt : book.titles.en} {passage.chapter}
        </p>
        <div className="toolbar-controls">
          <label>
            {t(locale, "enlarge")}
            <select
              aria-label={t(locale, "enlarge")}
              value={appearance.textScale}
              onChange={(event) =>
                setAppearance((current) => ({
                  ...current,
                  textScale: event.target.value as AppearanceState["textScale"],
                }))
              }
            >
              <option value="s">A</option>
              <option value="m">A+</option>
              <option value="l">A++</option>
              <option value="xl">A+++</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={appearance.showHebrew}
              onChange={(event) =>
                setAppearance((current) => ({ ...current, showHebrew: event.target.checked }))
              }
            />{" "}
            {t(locale, "hebrew")}
          </label>
          <label>
            <input
              type="checkbox"
              checked={appearance.showTranslation}
              onChange={(event) =>
                setAppearance((current) => ({ ...current, showTranslation: event.target.checked }))
              }
            />{" "}
            {t(locale, "translation")}
          </label>
        </div>
      </div>
    ),
    [appearance, book.titles.en, book.titles.pt, locale, passage.chapter],
  );

  return (
    <div
      className={`reader-shell ${open && desktop ? "is-open" : ""} ${chromeHidden ? "chrome-hide" : ""}`}
    >
      <div>
        {toolbar}
        <article className="reading" aria-label={t(locale, "read")}>
          {locale === "pt" && <p className="pt-note">{t(locale, "pendingPtSource")}</p>}
          <header className="chapter-head">
            <p className="kicker">
              {book.titles.transliteration} · {t(locale, "chapter")} {passage.chapter}
            </p>
            <h1 className="hebrew" lang="he" dir="rtl">
              {book.titles.he}
            </h1>
          </header>
          {verses.map((verse, index) => {
            const isSelected = selectedId === verse.id;
            const isExpanded = isSelected && open;
            const n = verse.canonicalRef.verse;
            return (
              <section
                key={verse.id}
                id={`v${n}`}
                className={`verse${isSelected ? " is-selected" : ""}`}
                aria-label={`${t(locale, "verse")} ${n}`}
                data-verse={n}
                onClick={(event) => onVersePointer(event, verse)}
              >
                <div className="verse-lead">
                  <button
                    type="button"
                    id={`verse-select-${n}`}
                    className="verse-select"
                    aria-expanded={isExpanded}
                    aria-controls={isExpanded ? studyPanelId : undefined}
                    aria-label={`${t(locale, "understand")} · ${t(locale, "verse")} ${n}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectVerse(verse);
                    }}
                    onKeyDown={(event) => onControlKey(event, verse, index)}
                  >
                    <span className="verse-num" aria-hidden="true">
                      {n}
                    </span>
                    <span className="verse-select-hint">{t(locale, "understand")}</span>
                  </button>
                </div>
                {appearance.showHebrew && (
                  <p className="verse-he hebrew" lang="he" dir="rtl">
                    {verse.hebrew.text}
                  </p>
                )}
                {appearance.showTranslation && (
                  <p className="verse-en latin" lang="en" dir="ltr">
                    {verse.translation.text}
                  </p>
                )}
              </section>
            );
          })}
        </article>
      </div>

      {open && selected && desktop && (
        <aside
          className="rail"
          id={studyPanelId}
          aria-label={t(locale, mode === "sources" ? "sources" : "understand")}
        >
          <StudyChrome locale={locale} mode={mode} setMode={setMode} />
          <StudyContent payload={payload} verse={selected} mode={mode} />
        </aside>
      )}

      <Drawer.Root
        open={open && !desktop}
        swipeDirection="down"
        snapPoints={[0.48, 0.92]}
        defaultSnapPoint={0.48}
        onOpenChange={(next) => {
          if (!next) setMode("read");
        }}
      >
        <Drawer.Portal>
          <Drawer.Backdrop className="drawer-backdrop" />
          <Drawer.Viewport className="drawer-viewport">
            <Drawer.Popup className="sheet">
              <Drawer.Content>
                <div className="handle" />
                <Drawer.Title className="visually-hidden">{t(locale, "understand")}</Drawer.Title>
                {selected && (
                  <div id={!desktop ? studyPanelId : undefined}>
                    <StudyChrome locale={locale} mode={mode} setMode={setMode} />
                    <StudyContent payload={payload} verse={selected} mode={mode} />
                  </div>
                )}
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

function StudyChrome({
  locale,
  mode,
  setMode,
}: {
  locale: Locale;
  mode: StudyMode;
  setMode: (mode: StudyMode) => void;
}) {
  return (
    <div className="study-chrome">
      <div className="mode-switch" role="group" aria-label={t(locale, "studyMode")}>
        {(["understand", "sources"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className="mode-switch-btn"
            aria-pressed={mode === item}
            onClick={() => setMode(item)}
          >
            {t(locale, item)}
          </button>
        ))}
      </div>
      <button type="button" className="study-close" onClick={() => setMode("read")}>
        {t(locale, "close")}
      </button>
    </div>
  );
}
