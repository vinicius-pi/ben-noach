# Implementation risks and preemptive decisions

This file records failure modes that are easy for an autonomous build agent to miss even when the design brief is good.

## 1. Do not turn “Noahide” into a new sectarian brand

Rabbi Tovia Singer's public framing of righteous gentiles emphasizes that a non-Jew need not convert to Judaism and can live a sacred path as a righteous gentile. Contemporary Noahide discourse also warns against constructing an imitation-Judaism or replacement religion.

Product decision:

- use **Ben Noach / Bnei Noach / righteous gentile** as descriptive identities;
- avoid language that presents “Noahidism” as a new church-like denomination;
- avoid progress systems that imply the user is leveling toward becoming Jewish;
- guided learning tracks are about understanding Tanakh and one's obligations, not acquiring Jewish covenantal status.

## 2. Christian-background users bring familiarity and hidden numbering assumptions

A former Christian may know a passage extremely well while using a different book order, naming convention, translation tradition, or verse-numbering convention.

Product decision:

- canonical internal IDs must be independent of display-language book names;
- build a reference alias/normalization layer;
- allow search aliases such as `Genesis`, `Bereshit`, `Gênesis`;
- plan for numbering divergences between Jewish/Christian editions where they occur rather than assuming all external references are identical;
- share URLs should resolve canonical project refs and show the displayed source/version.

## 3. Do not synthesize the Divine Name inside source text

Different Jewish translations render the Tetragrammaton differently; public editorial prose may use “Hashem,” “the LORD,” “God,” or another convention depending on language/context.

Product decision:

- preserve the selected source/translation exactly;
- do not algorithmically replace Divine Names inside quoted source material;
- choose an explicit editorial style guide for project-written prose;
- keep that style separate from source rendering.

## 4. Hebrew normalization can silently corrupt scholarly identity

Unicode normalization, diacritics, cantillation, punctuation and copied source HTML can alter byte-level text while remaining visually similar.

Product decision:

- preserve a raw/provider representation or deterministic normalized canonical representation with hashes;
- define normalization once at ingestion boundary;
- test niqqud/te'amim and mixed punctuation;
- never apply display transformations that change the stored source silently;
- source-integrity CI should detect unexpected fixture changes.

## 5. Rashi alignment is not just “commentary on verse”

Rashi comments often have a `dibbur hamatchil` and multiple comments can attach to one verse. A beginner explanation may explain one Rashi unit rather than the entire verse.

Product decision:

- model commentary segments independently;
- preserve commentator work + canonical ref + segment identity + dibbur hamatchil where available;
- let an elucidation target a specific commentary segment;
- do not flatten all Rashi on a verse into one anonymous block.

## 6. Source graphs can explode recursively

Rashi can point to Midrash; a supercommentary can explain Rashi; that source can itself have commentary. Naive recursive fetching can create huge graphs, slow pages, and confusing UX.

Product decision:

- define explicit relationship types;
- fetch/display bounded depth in the public UI;
- cache normalized source nodes;
- reveal further depth only by deliberate user action;
- deep-link to Sefaria rather than trying to reproduce the whole library.

## 7. Avoid a mixed overlay stack

Modern React starter kits often combine multiple overlapping primitive systems (for example Radix Dialog/Popover plus a separate drawer library plus another command/menu system). This can create focus, portal, z-index, scroll-lock and mobile keyboard conflicts.

Product decision:

- choose one primary accessible overlay primitive family wherever practical;
- evaluate **Base UI Drawer/Dialog** as a current option because its Drawer extends the same Dialog foundation and supports gestures/snap points/mobile keyboard behavior;
- alternatively use Radix consistently and implement the mobile study sheet deliberately;
- do not mix libraries merely because a component generator installs them by default;
- test Select/Popover inside the study sheet before committing to the primitive stack.

Current Base UI Drawer docs:
https://base-ui.com/react/components/drawer

Current Base UI releases/docs:
https://base-ui.com/

## 8. Component generators are not a design system

Shadcn-style code generation is useful for accessible scaffolding, but default generated appearance will make the product look generic.

Product decision:

- primitives may be copied/generated for behavior;
- visual tokens, typography, spacing, states, rails, reader composition and motion must be authored for Ben Noach;
- no “card + badge + tabs + rounded button” vocabulary unless the interaction genuinely requires it;
- run the three-direction anti-slop design experiment before convergence.

## 9. CSP and static rendering can conflict

Next.js nonce-based CSP strategies can force dynamic rendering because each request needs a nonce. The product benefits strongly from static/pre-rendered reading routes.

Product decision:

- choose CSP strategy alongside rendering architecture, not after it;
- prefer a static-compatible strict policy when possible;
- if nonces are truly required, isolate dynamic surfaces rather than sacrificing static delivery for the whole reader;
- document every external origin allowed by CSP.

Reference:
https://nextjs.org/docs/app/guides/content-security-policy

## 10. PWA/offline caching changes the licensing question

Caching a translation offline is effectively distributing a local copy to the user's device.

Product decision:

- PWA shell may be cacheable early;
- cache textual content offline only when the specific text/version license permits the intended distribution;
- do not let a generic service-worker strategy indiscriminately cache unknown-rights source responses;
- tie offline eligibility to the source manifest.

## 11. Review mode must not become fake authority

A development query parameter such as `?review=1` is acceptable for displaying local draft metadata; it cannot grant privileged mutation rights in production.

Product decision:

- keep public review visualization separate from authenticated mutation capability;
- if persistence is added, authorize server-side by reviewer identity/role;
- record reviewer, scope, timestamp and revision;
- a UI label cannot promote content to `rabbinically-reviewed` without valid reviewer metadata.

## 12. AI-generated prose tends to homogenize source voices

An LLM can make Rashi, Rambam, Midrash and the project editor all sound like the same contemporary narrator.

Product decision:

- primary/classical voices retain their own labeled blocks;
- project prose explains rather than ventriloquizes;
- use short editorial bridges and definitions;
- prohibit phrases such as “Rashi is basically saying…” unless the claim is explicitly supported and clearly editorial;
- evidence refs live at claim level;
- human/rabbinic review concentrates on high-impact interpretation, not merely grammar.

## 13. Source licensing must be a build concern, not a cleanup task

The easiest autonomous-build failure is to populate the application with whatever translation appears first in an API.

Product decision:

- ingestion refuses production bundling without license metadata;
- development fixtures with uncertain rights must be visibly marked and excluded from production export/build where appropriate;
- generated `source-manifest` becomes part of CI;
- commercial elucidations (ArtScroll/Koren etc.) are design/method references, not source text.

## 14. The product should not become counter-missionary media first

Singer's strongest alignment is textual confidence: return to Hebrew Scripture, context and Jewish interpretation, while keeping controversy issue-focused.

Product decision:

- first-run experience never asks the user which religion they are leaving;
- Genesis/Isaiah/Psalms are presented first as Tanakh;
- optional comparative readings come after the constructive Jewish reading;
- no engagement optimization based on humiliating another religion;
- former-Christian onboarding adapts terminology/context density, not the dignity of the user.

## 15. “For Bnei Noach” must not appear on every verse by force

A templated AI system will tend to generate a Noahide takeaway for every passage even when none is warranted.

Product decision:

- Noahide note is optional/nullable;
- absence is preferable to manufactured relevance;
- many passages need only peshat/context/Rashi;
- when a universal or Noahide implication is asserted, it needs source/review status.

## 16. Beginner explanations must not become devotional fan-fiction

The product can be beautiful, moving and spiritually serious without inventing emotional morals.

Product decision:

- every explanatory block answers a concrete comprehension problem;
- define why this explanation exists: language, context, Rashi's question, classical source, historical term, covenantal boundary, or reviewed Noahide relevance;
- decorative inspirational prose is not a substitute for commentary.

## 17. Search should start narrower than the corpus

Full Jewish-library search is an enormous product in itself.

Product decision:

Initial search prioritizes:

- book/chapter/verse refs;
- Hebrew/English/Portuguese book aliases;
- guided pathways/topics present in the project;
- project glossary.

Use Sefaria for deep corpus search until there is evidence that duplicating it improves the beginner product.

## 18. SEO/share previews can accidentally present draft theology as canonical

Search engines/social previews may index development text.

Product decision:

- draft/review routes use `noindex`;
- only release-eligible passages enter sitemap;
- metadata distinguishes source quotation from project description;
- preview cards should never say “Rabbinically approved” unless that exact scope is true.

## 19. Do not optimize analytics into a religious-profile database

A user's path from Christian-background content into Noahide study could reveal sensitive belief information.

Product decision:

- no religion-profile field for basic use;
- no third-party ad tracking;
- collect minimal aggregate interaction/performance telemetry if needed;
- do not create cross-site advertising audiences from study behavior;
- document analytics before enabling them.

## 20. A beautiful first five verses can hide an unscalable editorial workflow

The app is only valuable if Genesis 1:1–5 can become Genesis 1–11 and eventually Tanakh without manual code surgery.

Product decision:

- all passage-specific content lives in validated data/content files or a clear content layer;
- UI components remain generic;
- add a contributor/editor workflow early;
- document exactly how to add Genesis 1:6 as the scalability test;
- before final PR, add at least one new passage using only the documented workflow to prove it works.

## 21. Security patch level is a hard pre-build gate

At the September 2026 research checkpoint, Next.js 16.x is Active LTS and August 2026 security advisories require patched versions in the 16.3.3+ line. This will change.

Product decision:

- the build agent must verify the current advisory state at execution time;
- never pin to a version copied from this research document without checking;
- CI/Dependabot must keep framework/security updates visible.

## 22. The simplest credible launch has no account system

Product decision:

Initial public release can be:

- static/public reading;
- no login;
- no comments;
- no public LLM chat;
- no user-generated content;
- no payments.

This preserves speed, privacy and security while the editorial model is validated. Bookmarks/progress can begin local-first and move server-side only if the product later needs accounts.

## Implementation meta-rule

When the agent faces a choice between adding another feature and strengthening the core journey

**Genesis passage → Rashi → understanding → source → Noahide context → Sefaria**, 

strengthen the core journey.
