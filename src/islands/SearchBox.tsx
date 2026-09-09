import { useMemo, useState } from "react";
import { t, withBase } from "../lib/i18n";
import { searchLocal } from "../lib/search";
import type { Locale } from "../lib/types";

export default function SearchBox({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const hits = useMemo(() => searchLocal(q, locale), [q, locale]);

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      style={{ position: "relative" }}
    >
      <label className="visually-hidden" htmlFor="q">
        {t(locale, "search")}
      </label>
      <input
        id="q"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={t(locale, "searchPlaceholder")}
        autoComplete="off"
        style={{
          background: "transparent",
          border: "1px solid var(--line)",
          minHeight: "2.5rem",
          minWidth: "16rem",
          padding: "0.35rem 0.7rem",
          width: "100%",
        }}
      />
      {q && (
        <ul
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            listStyle: "none",
            margin: "0.3rem 0 0",
            padding: "0.4rem 0.6rem",
            position: "absolute",
            width: "100%",
            zIndex: 5,
          }}
        >
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
