# Licensing and third-party rights

Ben Noach intentionally separates **software**, **original editorial/documentation content**, and **third-party textual/assets** so the project can remain open, portable and transferable without accidentally relicensing sacred/classical source material.

## 1. Project software

Original project software, build scripts, configuration and test code are licensed under the **Apache License 2.0** unless a file explicitly states otherwise.

See `LICENSE`.

Why Apache-2.0:

- OSI-approved permissive open-source license;
- allows use, modification, redistribution and institutional transfer;
- includes an explicit patent grant;
- does not impose network/share-alike obligations on a future steward.

Third-party dependencies retain their own licenses.

## 2. Original project documentation and editorial prose

Original project documentation, original beginner elucidations, glossary prose and other original non-code editorial content are intended to be released under **Creative Commons Attribution 4.0 International (CC BY 4.0)** unless a file/content record states another license.

See `CONTENT_LICENSE.md`.

This permits a future rabbinic/nonprofit steward to adapt and redistribute project-authored material while preserving attribution.

### Review status is not a copyright license

A rabbinic/editorial review record applies only to the exact reviewed revision/content hash recorded by the project.

Reusing or modifying CC BY content does **not** transfer:

- rabbinic approval;
- reviewer identity endorsement;
- certification;
- institutional affiliation.

Modified content must not claim the same review status unless it has been reviewed again according to project governance.

## 3. Third-party sacred/classical texts and translations

Third-party texts are legally distinct from project-authored content.

The repository/project license never relicenses:

- Tanakh source editions;
- translations;
- Rashi or other classical commentaries;
- Midrash/Talmud editions/translations;
- dictionaries/lexica;
- morphology datasets;
- fonts;
- media/manuscripts.

Every bundled or cached concrete version must have machine-readable rights/provenance metadata.

Required concepts include:

- provider/source;
- exact version title/identifier;
- language;
- license/rights status;
- attribution requirements;
- bundling permission;
- offline permission;
- derivative-use rule where relevant;
- retrieval date;
- checksum.

`docs/CORPUS_V1.md` defines the audited starting corpus.

Availability through Sefaria or another library does not by itself establish redistribution permission for a particular version.

Where rights are unclear, the production product links/deep-links instead of bundling the text.

## 4. Preferred source/data rights

Prefer:

- Public Domain;
- CC0;
- CC BY 4.0 or compatible attribution licenses.

Use CC BY-SA only after explicit review of share-alike implications.

Do not bundle unknown-rights, NC-restricted or proprietary source material into the core release without explicit project-level permission/decision.

## 5. Software dependency policy

Preferred runtime/build dependency licenses include:

- Apache-2.0;
- MIT;
- BSD-2-Clause;
- BSD-3-Clause;
- ISC;
- 0BSD;
- MPL-2.0.

Fonts:

- OFL-1.1 is approved.

To minimize future transfer friction, introducing GPL/AGPL/source-available/proprietary runtime dependencies requires an explicit architecture/license decision rather than ordinary dependency installation.

This is a project portability policy, not a claim that other open-source licenses are invalid.

## 6. Fonts

Production fonts must be self-hostable and redistributable for web/app use.

Record:

- font family;
- source repository;
- exact version/commit where practical;
- license;
- bundled files/subsets.

Do not redistribute commercial font files from Koren, ArtScroll or other publishers.

## 7. Design/editorial references

Commercial or externally authored products such as ArtScroll, Koren, ALHATORAH, Sefaria, Readest, Quran.com and others may be studied as design/editorial/technical references according to applicable terms.

Their copyrighted:

- prose/translations;
- illustrations;
- branding;
- proprietary fonts;
- layouts/assets

are not project assets unless separately licensed.

The product synthesizes principles, not copyrighted implementations/branding.

## 8. AI-assisted development

Use of an LLM during research, drafting or software development does not alter the rights status of an upstream source.

An LLM may not be used to:

- evade a source license;
- generate a near-copy of proprietary elucidation;
- erase attribution;
- present generated scripture translation as an existing Jewish source version.

Project-authored AI-assisted drafts still pass ordinary editorial/source/review governance before publication.

## 9. Contribution rights

Contributors should use the contribution process in `CONTRIBUTING.md`.

Code contributions are contributed under Apache-2.0.

Original documentation/editorial contributions are contributed under CC BY 4.0 unless explicitly agreed otherwise.

Third-party content contributions must include exact provenance and rights metadata; a contributor's submission does not itself establish that third-party redistribution is permitted.

## 10. Future transfer / donation

If the repository/project is transferred to a rabbinic, educational or nonprofit steward:

- Apache-2.0 code remains usable/modifiable;
- CC BY 4.0 project-authored editorial material remains usable/modifiable with attribution;
- third-party source/version rights remain unchanged;
- all manifests/attributions accompany the transfer;
- review records retain exact revision/hash meaning;
- no transfer may imply that an earlier reviewer endorsed later modified content.

This separation is intentional: it lets stewardship move without corrupting provenance or source rights.