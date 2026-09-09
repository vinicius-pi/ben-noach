# Source audit — Genesis 1:1–6

Scope: independent verification of the classical source chain used by the RC1 pilot. This file does **not** certify Noahide halakhic guidance. It checks whether the textual/editorial claims attributed to Tanakh, Rashi and Siftei Chakhamim are supported by the selected sources.

Audited branch base: PR #2 head `e32bfa40441d3954633876b7350540eb6bf9a67f`.

## Source/version baseline

### Tanakh

Selected display text:

- Hebrew: `Tanach with Ta'amei Hamikra` — Public Domain according to the audited Sefaria metadata recorded by the repository.
- English: `The Holy Scriptures: A New Translation (JPS 1917)` — Public Domain.

### Rashi

Selected source/translation:

- `Pentateuch with Rashi's commentary by M. Rosenbaum and A.M. Silbermann, 1929–1934`.
- Sefaria About metadata currently labels the selected source and translation Public Domain.

Verification example:

- https://www.sefaria.org/Rashi_on_Genesis.6.11.2?lang=bi&with=About

### Siftei Chakhamim

Selected source/translation:

- `Sifsei Chachomim Chumash, Metsudah Publications, 2009`.
- Sefaria About metadata currently labels both current source and translation `CC-BY`.

Verification:

- https://www.sefaria.org/Siftei_Chakhamim%2C_Genesis.1.26.3?lang=bi&with=About

The repository should continue enforcing attribution at build time.

---

# Genesis 1:1

## Canonical verse

JPS 1917:

> In the beginning God created the heaven and the earth.

The current project introduction is longer than necessary. The phrase `a world that already belongs to God` is not neutral verse description; it anticipates the first Rashi's argument. Move/delete it from `understanding-the-verse`.

### Recommended editorial role

Verse introduction should do only two things:

1. identify that Torah opens with creation rather than commandment;
2. prepare the reader for Rashi's structural/grammatical questions.

## Rashi 1:1:1 — why Torah begins here

Verified source:

- https://www.sefaria.org/Genesis.1.1?lang2=bi&with=Rashi
- https://www.sefaria.org/Rashi_on_Genesis.1.1-31

Rashi explicitly says:

- Torah could have begun at Exodus 12:2;
- that is the first commandment given to Israel;
- Genesis is placed first in connection with Psalm 111:6;
- the creation account answers the nations' claim against Israel's possession of the land.

### Current project claim

`Rashi is answering why the Torah begins with creation rather than with Israel’s first commandment.`

**Verdict: SUPPORTED.**

## Siftei Chakhamim 1:1 — opening question

The repository includes Siftei material clarifying the commandment/narrative problem and the `What is the reason...` phrase.

The current project statement that Siftei sharpens the structural problem is broadly supported.

The project's more specific sentence that Torah is called Torah/`instruction` because of mitzvot should remain only if the exact local Siftei segment cited contains that point. The content validator should not allow a broad source ID to substitute for a different segment.

## Rashi 1:1:1 — land argument / applicability

The source undeniably concerns Israel and the inheritance of the nations.

The current separate `NOAHIDE_GUIDANCE` paragraph is not needed as normative guidance.

### Recommended replacement

Classify as `APPLICABILITY_CONTEXT` and keep it short, e.g.:

> Rashi's first comment explains why Israel's Torah opens with Creation and connects that opening to Israel's claim to the land. This is Israel-covenant context, not a command addressed to the nations.

No additional moral conclusion is required.

## Rashi 1:1:2 — derash and peshat

Verified source:

- https://www.sefaria.org/Rashi_on_Genesis.1.1.2?with=Bereshit+Rabbah
- https://www.sefaria.org/Genesis.1.1?lang=en&ven=english%7CThe_Holy_Scriptures%3A_A_New_Translation_%28JPS_1917%29&with=Rashi

Rashi:

- reports the derash around `reshit` / Torah / Israel;
- then explicitly gives the peshat reading;
- treats `bereshit` as construct-like in the peshat reading;
- argues the verse is not teaching a simple chronological order of creation, citing the already-present waters.

### Current project claims

`Rashi treats בראשית as grammatically construct...`

**Verdict: SUPPORTED.**

`Rashi distinguishes derash ... from peshat...`

**Verdict: SUPPORTED.**

`This is how Jewish reading works: midrash and peshat can sit on the same lemma without one erasing the other.`

**Verdict: DELETE AS GENERALIZATION.**

The actual Rashi sequence already demonstrates the point.

## Rashi 1:1:3 — justice and mercy

Verified source:

- https://www.sefaria.org/Rashi_on_Genesis.1.1.3?lang=bi&with=Lexicon
- https://www.sefaria.org/Rashi_on_Genesis.1.1.3?with=Bereshit+Rabbah

Rashi explicitly connects:

- `Elohim` with strict justice;
- the world's inability to endure strict justice alone;
- mercy joined to justice;
- the double Divine Name in Genesis 2:4.

### Current core claim

`Elohim signals the attribute of justice; Genesis 2:4’s double Name shows mercy joined to justice.`

**Verdict: SUPPORTED.**

The added line `This is emunah... It is not a ritual instruction` is editorial classification, not source elucidation, and should be removed unless a concrete applicability problem requires it.

---

# Genesis 1:2

Verified Rashi:

- https://www.sefaria.org/Rashi_on_Genesis.1.2
- https://www.sefaria.org/Rashi_on_Genesis.1.2.5?with=all

Rashi explicitly comments on:

- `tohu va-vohu`;
- the rare/foreign lexical glosses;
- `face of the deep` as waters on the earth;
- `spirit of God hovering` as the Throne of Glory hovering by divine breath/command, compared with a dove over its nest.

### Current core claim

`Rashi identifies the hovering spirit with the Throne of Glory, compared to a dove.`

**Verdict: SUPPORTED.**

### Current filler

`The verse is atmosphere and grammar, not ethics.`

**Verdict: DELETE.**

It does not help establish the text, Rashi's problem or a source relationship.

`a typical supercommentary move: isolate the extra word that generated Rashi's image.`

**Verdict: REWRITE/DELETE.**

If Siftei asks specifically what the word adds, state his question directly. Do not convert one example into an unsourced theory of supercommentary method in the passage prose.

---

# Genesis 1:3

Canonical verse:

> And God said: 'Let there be light.' And there was light.

The selected Rosenbaum/Silbermann Rashi collection contains no Rashi segment at Genesis 1:3.

Sefaria navigation jumps from the Genesis 1:2 comments to Genesis 1:4:

- https://www.sefaria.org/Rashi_on_Genesis.1.3-4

### Current claim

`Rashi has no comment on Genesis 1:3 in the selected edition.`

**Verdict: SUPPORTED.**

### Current filler

`That absence is information. Not every verse is a problem for Rashi. The reader can stay with the verse.`

**Verdict: REDUCE.**

A clean reader needs at most:

> No Rashi comment appears here in the selected edition.

Do not manufacture an essay out of absence.

---

# Genesis 1:4

Verified Rashi:

- https://www.sefaria.org/Rashi_on_Genesis.1.4?lang=bi&with=Navigation
- https://www.sefaria.org/Rashi_on_Genesis.1.4.1?lang=bi&with=Chagigah

Rashi gives two readings:

1. aggadah — the light is withheld from the wicked and reserved for the righteous in the future;
2. peshat — light and darkness should not function in confusion; each is assigned a domain.

Rashi explicitly links the aggadic material to Chagigah 12a and the peshat to Genesis Rabbah 3:6 in the selected edition.

### Current core claim

`Rashi gives an aggadic reservation of the light and a peshat division of domains.`

**Verdict: SUPPORTED.**

### Current `why-rashi`

The mixing/separation problem is supportable through the Rashi/Siftei chain.

The phrase `or as if God reconsidered` is not needed for the cited claim and should be removed unless an exact classical source is added.

### Current filler

`Again Rashi refuses to collapse midrash into peshat.`

**Verdict: DELETE.**

The two labeled readings already show the distinction.

---

# Genesis 1:5

Verified Rashi:

- https://www.sefaria.org/Rashi_on_Genesis.1.5?lang=bi

Rashi explicitly asks why the verse says `one` rather than `first`, given the ordinal pattern of later days, and answers that God was then the Only One in His world because angels were not created until the second day, citing Genesis Rabbah 3:8.

### Current claims

`The verse says “one day” rather than “first day.”`

**Verdict: SUPPORTED.**

`Rashi comments because אחד breaks the ordinal pattern of the chapter.`

**Verdict: SUPPORTED.**

`“One day” alludes to God as the Only One before the angels’ creation on day two.`

**Verdict: SUPPORTED.**

### Current filler

`The naming is an act of order.`

**Verdict: NOT NEEDED HERE.**

`The verse's grammar becomes emunah... without turning the day-count into a human commandment.`

**Verdict: DELETE AS CLASSIFICATION FILLER.**

The Rashi source already delivers the theological content.

### `For Bnei Noach` block

Current separate guidance is redundant with the Rashi/elucidation and is not a named rabbinic ruling.

**Recommendation: remove the separate block in v0.1.**

---

# Genesis 1:6

Verified Rashi:

- https://www.sefaria.org/Rashi_on_Genesis.1.6
- https://www.sefaria.org/sheets/148550

Verified Siftei:

- https://www.sefaria.org/Siftei_Chakhamim%2C_Genesis.1.6.1

Rashi/Siftei support:

- the question why `let there be a firmament` sounds like creation now when heaven has already appeared;
- Rashi's answer that day-one heavens were fluid and solidified on day two;
- Job 26:11 as proof-text;
- the firmament placed in the middle of the waters with equal distance above and below;
- upper waters suspended by the King's command.

### Current core claims

`Rashi comments because “let there be a firmament” seems to recast a heaven already created.`

**Verdict: SUPPORTED.**

`Rashi reads the firmament as a solidification of day-one heavens, centered in the waters.`

**Verdict: SUPPORTED.**

### Current filler

`The verse is a command of cosmic order, not a human statute.`

**Verdict: DELETE.**

No reasonable reader needs a legal-applicability warning on this verse.

---

# Cross-cutting conclusions

## 1. The classical corpus is much stronger than the modern prose

The source ingest is not the problem. The Rashi/Siftei material checked here generally matches the cited classical source chain.

The main editorial risk is the model adding a final sentence that classifies, moralizes or explains the significance of material already made clear by the source.

## 2. Use source-proximate English

Preferred editorial cadence:

- `Rashi asks...`
- `Rashi reads...`
- `Siftei Chakhamim explains the difficulty as...`
- `The Hebrew form here...`
- `The cited midrash...`

Avoid habitual conclusions such as:

- `This is how Jewish reading works...`
- `This is emunah...`
- `It is not X; it is Y...`
- `For a Ben Noach...` when no genuine applicability boundary is present.

## 3. Applicability must be exceptional, not mandatory

The Noahide-specific advantage of the product is not a `For Bnei Noach` paragraph under every passage.

It is that the system surfaces covenantal/applicability boundaries **when the reader would otherwise misread them**.

Genesis 1:1 Rashi is a good example: the land argument genuinely needs Israel-covenant context.

Genesis 1:6 does not.

## 4. English-only v0.1 improves auditability

The source stack is currently strongest in Hebrew + verified English. Public Portuguese activation should wait for a concrete approved scripture translation/version and a separate review of project-written Portuguese prose.
