import { useEffect, useState } from "react";
import { t, withBase } from "../lib/i18n";
import { readLocalState } from "../lib/storage";
import type { Locale } from "../lib/types";

export default function ContinueReading({ locale }: { locale: Locale }) {
  const [href, setHref] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const state = readLocalState();
    if (state.lastHref) {
      setHref(state.lastHref);
      setLabel(state.lastLabel ?? t(locale, "continueReading"));
    }
  }, [locale]);

  if (!href) {
    return (
      <a className="btn btn-solid" href={withBase(`/${locale}/read/genesis/1/`)}>
        {t(locale, "beginReading")}
      </a>
    );
  }

  return (
    <>
      <a className="btn btn-solid" href={href}>
        {t(locale, "continueReading")}
      </a>
      <a className="btn" href={withBase(`/${locale}/read/genesis/1/`)}>
        {label ? `${t(locale, "beginReading")}` : t(locale, "beginReading")}
      </a>
    </>
  );
}
