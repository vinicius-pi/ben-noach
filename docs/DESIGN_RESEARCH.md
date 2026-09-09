# Design research — modern guided Tanakh reader

## Design thesis

The product is a **premium editorial reader**, not a religious portal and not a SaaS dashboard.

Its central design problem is to preserve the intellectual architecture of Jewish commentary while giving a first-time reader a calm, obvious path through it.

The synthesis is:

**Mikraot Gedolot depth + Koren editorial discipline + modern immersive-reader ergonomics + progressive disclosure + scholarly provenance.**

## Historical architecture

### Mikraot Gedolot

Core idea to preserve:

- canonical text remains central;
- commentary is visibly commentary;
- multiple authorized voices can coexist;
- the page expresses relationships between text and interpretation.

Digital transformation:

- keep the depth;
- reveal voices progressively;
- preserve identity of each commentator;
- let the user move from a single guided explanation into the wider source graph.

Historical note: later printed editions repeatedly changed layout and commentator selection according to editorial purpose. The intellectual model is inherited; the exact printed page is not sacred UI.

### Rashi and supercommentaries

Rashi is a natural bridge between first reading and Chazal. Centuries of supercommentaries exist partly because readers need help understanding the problem Rashi is addressing and how his compact words work.

The product should support the following explanatory sequence when useful:

1. passage;
2. Rashi verbatim / licensed translation;
3. **the question Rashi is answering**;
4. beginner elucidation;
5. source behind Rashi (Midrash/Talmud/etc.);
6. supercommentary where it materially clarifies the point;
7. Noahide relevance where reviewed;
8. complete source/provenance path.

Modern Orthodox editorial precedent: ArtScroll's Schottenstein Elucidated Rashi uses introductions, contemporary elucidation grounded in Rashi supercommentaries, “what is bothering Rashi?” framing, and deeper notes. This validates the pedagogy, while its text/layout remains copyrighted and must not be copied.

Reference:
https://www.artscroll.com/Books/9781422642733.html

### Koren / Steinsaltz

Principles to absorb:

- typography is the primary visual system;
- Hebrew deserves careful optical treatment;
- whitespace conveys reverence and hierarchy;
- explanatory material removes barriers without visually overpowering the text;
- maps/background/reference material appear when they serve comprehension.

References:
https://korenpub.com/pages/about-us
https://korenpub.com/products/steinsaltz-tanakh

## Modern product benchmarks

### Quran.com — reading vs study as separate cognitive states

The current Quran.com codebase implements a dedicated Study Mode with its own state, containers, verse navigation, and study tabs rather than treating commentary as permanent clutter. Its 2026 product work also introduced translation-focused reading for users who cannot read Arabic.

Reference implementation:
https://github.com/quran/quran.com-frontend-next

Product lesson:

- reading and studying should be different interface states;
- a verse is the natural pivot into study;
- deep tools can exist without contaminating the default reading experience.

For Ben Noach, use three depths:

**READ → UNDERSTAND → SOURCES**.

### Readest — immersive long-form reading

Readest is a current open-source, Next.js-based reader built around immersive reading, tunable typography, multiple devices, annotations, search, and parallel reading. Its stated design principle is that what matters is the time inside the book and the software should stay out of the way.

References:
https://github.com/readest/readest
https://readest.com/blog/introducing-readest
https://readest.com/docs

Product lesson:

- the default state should optimize reading measure, type, line-height, gesture behavior, progress, and focus;
- controls should recede when not needed;
- typography and parallel-reading patterns are worth studying at code level;
- use as inspiration, not as a codebase dependency unless license implications are deliberately accepted (Readest is AGPL-3.0).

### Sefaria — source graph and canonical refs

Sefaria is the deep library and canonical-ref infrastructure, not the desired beginner UX.

Its frontend has a mature multi-panel reader with text, connections, language/layout settings, highlighting, search, and source networks. The codebase demonstrates both the power and complexity cost of exposing a full Jewish library.

References:
https://github.com/Sefaria/Sefaria-Project
https://developers.sefaria.org/

Product lesson:

- reuse canonical refs and APIs;
- deep-link back to full sources;
- avoid reproducing the whole Sefaria information architecture;
- our layer chooses a comprehensible route through the graph.

### ALHATORAH / Rashi HaMefoar — closest intellectual competitor

ALHATORAH demonstrates rich Rashi, supercommentary, Midrash, manuscript and parallel-pane study. It is a power tool, not the novice product being built here.

Reference:
https://rashi.alhatorah.org/

Its terms restrict automated access and reuse. Treat it as a benchmark and potential future collaborator/link target, not a data source.

Terms:
https://moreh.alhatorah.org/Terms_of_Use

### Scaife Viewer / Perseus — scholarly provenance

Scaife is an open-source reading environment for classical texts with edition-specific references and a component/widget architecture.

References:
https://github.com/scaife-viewer/scaife-viewer
https://github.com/scaife-viewer/scaife-skeleton
https://github.com/scaife-viewer/scaife-widgets

Product lesson:

- preserve edition-level metadata under the simple reader UI;
- support stable passage identifiers;
- separate layout primitives from text/source data;
- make provenance inspectable rather than permanently visible.

### Open Commentaries — commentary tied to concrete editions

Open Commentaries explicitly models editions, translations, and commentaries as different version types and requires commentary to reference concrete source editions.

Reference:
https://github.com/Open-Commentaries/open-commentaries

Product lesson:

- a commentary should not float above an abstract “Genesis 1:1” if it actually depends on a particular textual/translation version;
- store exact source relationships;
- resolve annotations as granularly as the source allows.

### 929 — low-friction Tanakh entry

929 demonstrates that Tanakh can be made approachable by offering manageable units, brief context, and easy entry rather than requiring curriculum mastery.

Reference:
https://www.929.org.il/pages/aboutEN.html

Product lesson:

- guided pathways and daily/short reading units can come later without changing the core reader.

## UX literature

### Progressive disclosure

The application has expert-level depth but a beginner default. Progressive disclosure is therefore structural rather than decorative: common/essential information appears first; specialized material becomes available when requested.

Reference:
https://www.nngroup.com/articles/progressive-disclosure/

### Digital scholarly editions

Modern scholarship on digital scholarly editions warns against recreating the printed page as many simultaneous rectangular panes. Digital editions should separate presentation, infrastructure/standards, and usability/visualization.

Implication:

- build a native digital reading experience;
- keep scholarly infrastructure underneath it;
- never equate “serious” with permanent apparatus density.

## Core interaction model

### READ

Goal: uninterrupted encounter with Tanakh.

Desktop:

- centered reading measure approximately 680–760px;
- generous vertical rhythm;
- Hebrew first-class, with correct RTL and full niqqud/te'amim rendering;
- translation visually subordinate but comfortably readable;
- chapter/verse controls recede during scroll;
- verse hover/focus target is subtle and discoverable;
- reading progress is quiet.

Mobile:

- one column;
- Hebrew and translation stack naturally;
- verse target has a comfortable touch area without turning the verse into a card;
- reader chrome collapses during reading.

### UNDERSTAND

Goal: answer the questions a newcomer does not yet know how to ask.

Desktop:

- selected verse remains anchored in reading context;
- a 380–430px study rail opens from the logical side without collapsing the reading measure into an unusable column;
- sections are typographic, not a stack of cards.

Typical hierarchy:

- Understanding the verse
- Rashi
- What question is Rashi answering?
- Understanding Rashi
- Where this comes from
- Terms
- For Bnei Noach
- Sources & provenance
- Continue in Sefaria

Mobile:

- use an accessible modal bottom sheet / drawer pattern;
- support a compact “peek” state and an expanded reading state;
- preserve background context;
- focus trap, escape/dismiss behavior, reduced motion and screen-reader semantics must be correct.

### SOURCES

Goal: allow deliberate depth.

Possible material:

- Rashi original / translations;
- Siftei Chakhamim;
- Mizrachi;
- Gur Aryeh;
- relevant Midrash/Talmud;
- alternative classical interpretations;
- source graph;
- version/license metadata;
- direct Sefaria links.

The deeper view may become denser because the user explicitly requested depth.

## Home as a cover

The homepage should behave like a contemporary book cover plus library entrance.

Above the fold:

- small geometric Magen David as publishing mark;
- wordmark/project name;
- one precise sentence;
- Begin / Continue Reading;
- restrained indication of Tanakh structure.

Below:

- Torah / Nevi'im / Ketuvim;
- a small number of guided paths;
- project/about/provenance information.

The homepage's quality should be judged by composition, not by number of sections.

## Visual identity

### Palette

Starting tokens, subject to optical testing:

```css
--paper: #FCFDFE;
--surface: #FFFFFF;
--ink: #132033;
--ink-muted: #687386;
--navy: #102B4E;
--blue: #2467B2;
--blue-soft: #EDF4FB;
--line: #E6EBF1;
--source-line: #D4DEE9;
```

Blue is an accent and structural signal, not a full-page fill.

### Geometry

- restrained radii, generally 6–10px where a container genuinely needs one;
- near-zero decorative shadow;
- one-pixel rules and whitespace carry hierarchy;
- thin, precise custom Magen David SVG;
- motion around 150–250ms for small state changes, with reduced-motion support.

### Typography

Build `/design/type-proof` before final type selection.

Test the same passages with full niqqud and te'amim in multiple sizes/line heights.

Candidate Hebrew families to verify for license and rendering quality:

- Frank Ruhl Libre
- Noto Serif Hebrew
- Keter YG
- Keter Aram Tsova
- Taamey David

Use no more than two primary families in final public UI unless a specific scholarly/source need justifies another.

The proof should include:

- Genesis 1:1
- Deuteronomy 6:4–5
- Isaiah 52:13–53:3
- Psalm 119 sample

Check:

- niqqud collisions;
- te'amim positioning;
- glyph differentiation;
- line height;
- long-form fatigue;
- mobile rendering;
- mixed Hebrew/LTR punctuation.

Open Hebrew font research:
https://github.com/aharonium/fonts

Frank Ruhl Libre:
https://github.com/fontef/frankruhllibre

## Accessible component strategy

Use native elements first. For complex composite controls, prefer accessible headless primitives.

Radix Primitives follows WAI-ARIA patterns and supplies tested focus/keyboard behavior, including RTL support:
https://www.radix-ui.com/primitives/docs/overview/accessibility

Use such primitives as behavior infrastructure. The final appearance should be custom to this editorial system rather than default-library styling.

## Anti-slop visual protocol

The build agent must produce multiple visual hypotheses before convergence.

Required experiment set:

- Direction A — **Editorial Modernism**: most book-like, strongest whitespace/typography.
- Direction B — **Quiet Scholarly**: slightly more visible source/provenance affordance.
- Direction C — **Immersive Reader**: strongest mobile/gesture and disappearing-chrome emphasis.

All three use identical real Genesis 1:1–5 fixture data.

Capture at minimum:

- 390x844 mobile
- 768x1024 tablet
- 1440x1000 desktop

For each direction capture:

- home
- reader idle
- verse selected
- Understand open
- Sources open
- dark/low-light mode only if implemented
- enlarged text accessibility state

Choose based on a written comparison across:

- reading calm;
- Hebrew quality;
- hierarchy;
- discoverability;
- novice comprehension;
- visual distinctiveness;
- information density;
- mobile ergonomics;
- accessibility;
- implementation complexity.

## Design acceptance criteria

A design direction is acceptable when:

- the Tanakh is the first thing the eye reads;
- the UI remains recognizable with most containers/background fills removed;
- Hebrew diacritics render cleanly;
- a novice can open and close explanation without instruction;
- source vs editorial vs rabbinic layers are distinguishable without alarming badges everywhere;
- keyboard and touch interactions are equally coherent;
- the layout still feels intentional at 200% text zoom;
- visual regressions are screenshot-tested;
- no component exists only because a generic component library offered it;
- the final reader looks plausibly publishable by a serious editorial design studio.
