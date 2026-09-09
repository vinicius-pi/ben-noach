import { useMemo, useState } from "react";
import { t, withBase } from "../lib/i18n";
import { searchLocal } from "../lib/search";
import type { Locale } from "../lib/types";

export default function SearchBox({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const hits = useMemo(() => searchLocal(q, locale), [q, locale]);

  return (
    <form role="search" className="site-search" onSubmit={(event) => event.preventDefault()}>
      <label className="visually-hidden" htmlFor="q">
        {t(locale, "search")}
      </label>
      <input
        id="q"
        className="site-search-input"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={t(locale, "searchPlaceholder")}
        autoComplete="off"
      />
      {q && (
        <ul className="site-search-results">
          {hits.length === 0 && <li>{t(locale, "searchNoResults")}</li>}
          {hits.map((hit) => (
            <li key={hit.id}>
              <a href={withBase(hit.href)}>{hit.title}</a>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
