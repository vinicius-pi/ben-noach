import type { AppearanceState } from "./types";

const KEY = "ben-noach:v1";

export type LocalState = {
  lastHref?: string;
  lastLabel?: string;
  saved: string[];
  appearance: AppearanceState;
};

const DEFAULT_STATE: LocalState = {
  saved: [],
  appearance: {
    textScale: "m",
    showHebrew: true,
    showTranslation: true,
  },
};

export function readLocalState(): LocalState {
  if (typeof localStorage === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      appearance: { ...DEFAULT_STATE.appearance, ...parsed.appearance },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeLocalState(next: LocalState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}
