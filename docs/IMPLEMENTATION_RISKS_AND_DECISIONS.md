# Implementation risks and preemptive decisions

This file records failure modes an autonomous build agent can miss even with a strong design brief.

## 1. Applicability must be modeled, not inferred by the reader

The target user should not need advanced halakhic/textual literacy to distinguish universal material, Noahide material, Israel-covenant context and Jewish-practice-specific detail.

Product decision:

- applicability/scope is first-class structured data;
- use the taxonomy in `docs/PRODUCT_NORTH_STAR.md`;
- a passage can carry multiple scope tags;
- source wording remains intact;
- default guided paths prioritize material relevant to the target reader;
- Israel-specific material appears as context when needed to understand the source rather than being silently removed or treated as the reader's obligation.

## 2. Christian-background users bring familiarity and hidden reference assumptions

A reader may know a passage well while using another book order, naming convention, translation tradition or verse-numbering scheme.

Product decision:

- canonical IDs are independent of display-language book names;
- build reference aliases/normalization;
- support `Genesis`, `Bereshit`, `Gênesis` and analogous names;
- plan for numbering divergences where they exist;
- share URLs resolve project-canonical refs and expose source/version identity.

## 3. Preserve Divine Names inside source text

Different Jewish translations render the Tetragrammaton differently. Project prose may follow its own editorial convention.

Product decision:

- preserve the selected translation/source exactly;
- never algorithmically replace Divine Names inside quoted source material;
- maintain a separate editorial style guide for project-authored prose.

## 4. Hebrew normalization can silently corrupt source identity

Unicode normalization, cantillation, niqqud and punctuation can change byte-level content while appearing visually similar.

Product decision:

- define one deterministic ingestion normalization policy;
- preserve provider/raw provenance where practical;
- hash release payloads;
- regression-test niqqud/te'amim;
- never let a display transform silently rewrite stored canonical source data.

## 5. Rashi alignment is segment-level, not merely verse-level

One verse can contain multiple Rashi comments with separate `dibbur hamatchil` units.

Product decision:

- model commentary segments independently;
- preserve work + canonical ref + segment identity + `dibbur hamatchil` when available;
- let elucidation target a concrete commentary segment;
- never flatten all Rashi on a verse into anonymous prose.

## 6. Source graphs can explode recursively

Rashi can point to Midrash; a supercommentary explains Rashi; that work itself may have commentary.

Product decision:

- model explicit relationship types;
- fetch/display bounded public depth;
- cache normalized local source nodes where rights permit;
- reveal further depth deliberately;
- hand off to Sefaria rather than recreating the entire library.

## 7. External-provider availability cannot be a reader dependency

A beautiful product that goes blank when Sefaria is unavailable is not a durable edition.

Product decision:

- released passages render from a local approved corpus;
- provider adapters are used for ingestion/research/enrichment/deep links;
- provider-offline E2E is a release gate;
- manifests freeze exact release versions/hashes.

## 8. Provider versions can change without the project changing

An upstream API may alter metadata, translations, markup or version selection.

Product decision:

- never request “default translation” as a release identity;
- request/store explicit version identifiers;
- update tooling compares upstream state with local release metadata;
- source change requires an explicit project corpus update and new checksum.

## 9. Avoid a mixed overlay stack

Combining multiple Dialog/Drawer/Popover systems creates focus, portal, z-index, scroll-lock and mobile keyboard bugs.

Product decision:

- choose one primary accessible primitive family;
- Base UI `@base-ui/react` is the preferred current candidate because Drawer and Dialog share one foundation and the package is MIT;
- test nested Select/Popover/focus behavior inside the study Drawer before convergence;
- do not install an additional overlay library merely for convenience.

## 10. Component generators are not a design system

Generated components can accelerate behavior implementation but often impose generic visual grammar.

Product decision:

- primitives are behavior infrastructure;
- Ben Noach owns typography, spacing, source hierarchy, reader composition, states and motion;
- no automatic `card + badge + tabs + pill button` vocabulary;
- run the three-direction design experiment before convergence.

## 11. Static CSP/security must be designed with the actual Astro build

Security headers often get pasted from framework examples without testing the generated deployment.

Product decision:

- v1 is Astro static output;
- use current Astro CSP/security facilities where appropriate;
- inspect emitted HTML/assets;
- test headers/policy on the actual static host;
- keep allowed origins minimal because fonts/content are local;
- do not sacrifice static portability for an unnecessary dynamic nonce architecture.

## 12. PWA/offline caching changes the rights question

Caching a translation locally is distribution.

Product decision:

- service worker may cache application shell/assets;
- text enters offline cache only when manifest says `offlineAllowed: true`;
- provider/research responses are never indiscriminately cached;
- corpus cache version is tied to release manifest hashes.

## 13. Review mode must not manufacture authority

A development `?review=1` view can display review metadata but cannot create privileged status.

Product decision:

- review visualization is separate from authenticated mutation;
- v1 may remain repository-backed;
- reviewed state requires reviewer identity + revision/hash + timestamp according to governance;
- changing reviewed content invalidates prior reviewed state unless the review record explicitly covers the new hash.

## 14. AI-generated prose tends to homogenize source voices

An LLM can make Rashi, Rambam, Midrash and project prose sound like one contemporary narrator.

Product decision:

- source voices retain labeled source blocks;
- project prose elucidates rather than ventriloquizes;
- claim-level evidence refs support interpretive bridges;
- generated drafts are editorial input, not automatic publication;
- source text is never “cleaned up” into model prose.

## 15. Source licensing is a build concern

The easiest failure is to ingest whichever translation/provider result is convenient.

Product decision:

- `docs/CORPUS_V1.md` controls v1 source choices;
- manifest validators block production bundling with unknown rights;
- source count never outranks rights certainty;
- commercial editions are methodological references, not corpus assets.

## 16. Software dependency licenses can drift

An otherwise useful package can later introduce transfer/friction through a license change or dependency expansion.

Product decision:

- follow `docs/OPEN_SOURCE_STACK.md` license allowlist;
- pin/rescan resolved dependencies;
- treat copyleft/source-available/proprietary runtime additions as explicit architecture decisions;
- prefer native browser/CSS capabilities when a dependency adds little value.

## 17. Comparative material must not displace constructive reading

A reader coming from Christianity may have strong inherited prooftext assumptions, but the product's highest value is reconstructive Jewish reading.

Product decision:

- base Tanakh/Hebrew/context/classical reading comes first;
- later comparative modules are optional and subordinate;
- `Read around it` and textual context precede polemical claims;
- no engagement design built around outrage at another religion.

## 18. “For Bnei Noach” must not become a mandatory template field

Automated content generation tends to invent a takeaway for every verse.

Product decision:

- Noahide-specific note is optional/nullable;
- applicability metadata may be enough;
- absence is better than manufactured relevance;
- normative/application claims require their appropriate review state.

## 19. Beginner elucidation must answer a real textual problem

A beautiful reader can still become shallow if every verse gets generic inspirational prose.

Product decision:

Each explanatory block should exist for a concrete reason, such as:

- language/grammar;
- literary context;
- Rashi's question;
- classical source;
- historical term;
- address/covenantal context;
- reviewed applicability.

Do not fill whitespace with devotional filler.

## 20. Search should start narrower than the corpus universe

Full Jewish-library search is a separate major product.

Product decision:

v1 search prioritizes:

- canonical refs;
- localized book aliases;
- project glossary;
- guided paths/topics;
- released project content.

Use Sefaria for deep corpus search until product evidence justifies owning more.

## 21. Portuguese rights uncertainty must not turn into a hidden shortcut

The user experience needs Portuguese, but inspected Sefaria Portuguese Genesis versions included unknown/blank rights metadata.

Product decision:

- PT interface/routing/elucidation architecture is first-class;
- unknown-rights source translation is blocked from production;
- do not auto-generate a scripture translation and label it source text;
- actively seek an approved Jewish Portuguese translation or explicit permission;
- graceful source-language fallback is preferable to legal/provenance ambiguity.

## 22. SEO/share previews can accidentally promote draft commentary

Search engines may index a development elucidation or review state as if canonical.

Product decision:

- draft/review routes are `noindex`;
- only release-eligible passages enter sitemap;
- metadata distinguishes source quotation from project description;
- never put approval claims in preview metadata unless that exact revision/status is true.

## 23. Do not turn analytics into a sensitive study-profile database

Study routes can expose religious background or belief transition.

Product decision:

- no religion/background field is required for v1;
- no ad tracking;
- no third-party analytics dependency by default;
- progress/bookmarks local-first;
- future telemetry requires a separate privacy decision.

## 24. A beautiful Genesis 1:1–5 can hide an unscalable content workflow

Passage-specific JSX would produce a polished demo but a failed edition architecture.

Product decision:

- all passage-specific content lives in validated content/data;
- UI components are generic;
- document the authoring/ingestion workflow;
- add Genesis 1:6 exclusively through that workflow before final PR;
- if UI code changes are needed merely to add the verse, repair architecture first.

## 25. Framework patch level is a hard pre-build gate

Research documents age.

Product decision:

- verify current patched Astro 7.x and compatible maintained Node LTS at execution time;
- inspect current advisories rather than pinning to remembered versions;
- Dependabot and vulnerability scanning keep update pressure visible;
- framework/security upgrades must preserve static portability and visual regression baselines.

## 26. Static deployment must remain genuinely portable

A static framework can still accumulate provider-specific assumptions.

Product decision:

- `pnpm build` emits self-contained `dist/`;
- generic static-server smoke test is mandatory;
- GitHub Pages is the first free deployment, not a runtime dependency;
- no Vercel/Cloudflare-only APIs in the core;
- custom-domain instructions are host-agnostic.

## 27. Local progress can create hydration/layout bugs

Continue-reading state is client-local while the page itself is static.

Product decision:

- render stable neutral server/static defaults;
- hydrate only the tiny control/progress island;
- never let local storage determine sacred-text content/version;
- test first visit, returning visit, storage unavailable and cleared storage.

## 28. Hebrew word tools can silently mismatch editions

OSHB morphology/BDB are valuable but may not correspond byte-for-byte to the display edition.

Product decision:

- align by explicit canonical/word IDs where possible;
- keep display edition identity intact;
- surface lexical/morphological data as enrichment from its own source/version;
- do not merge texts invisibly;
- optional word inspector ships only after alignment tests pass.

## 29. Content hashes and review hashes must use one canonical serialization

If review status is tied to hashes, formatting/order differences can invalidate or falsely preserve review state.

Product decision:

- define canonical serialization for reviewable content objects;
- hash only documented semantic fields;
- store algorithm/version;
- test deterministic output across clean builds.

## 30. Free/open source must remain an operational property

A repo can claim open source while quietly requiring paid infrastructure to function.

Product decision:

The release gate demonstrates:

- clean build without paid credentials;
- local/open QA commands;
- generic static hosting;
- no required runtime AI;
- no proprietary fonts/UI kit;
- no hosted database/auth/search;
- approved source licenses;
- provider-offline core reading.

## Implementation meta-rule

When the agent faces a choice between another feature and strengthening this journey:

**passage → Rashi → understanding → source → applicability/context → Sefaria**, 

strengthen the journey.

When the core journey is already exceptional, add only features that make authentic reading, provenance, long-form study or target-reader comprehension materially better.