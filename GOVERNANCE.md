# Governance

## Purpose

Ben Noach is designed so technical stewardship, source editing, translation, editorial elucidation and rabbinic review can be held by different people without collapsing their authority into one role.

The repository may later be transferred to a rabbinic, educational or nonprofit steward without redesigning the content model or licensing structure.

## Roles

### Technical maintainer

Responsible for:

- software architecture;
- security;
- CI/CD;
- accessibility;
- performance;
- deployment;
- source-ingestion tooling;
- repository hygiene.

Technical maintainership does not confer authority to mark religious/editorial content as rabbinically reviewed.

### Source editor

Responsible for:

- canonical refs;
- source/version identity;
- exact quotations;
- provenance;
- rights/license metadata;
- commentary/source relationships;
- evidence refs;
- source checksums.

### Editorial elucidation editor

Responsible for project-authored beginner explanations.

Editorial elucidation should make difficult source material intelligible without impersonating the historical commentator.

### Translator

Responsible for a concrete translation/version or original project translation when such a project is explicitly undertaken.

Translation identity is never inferred from interface locale.

### Rabbinic reviewer

Responsible only for the scope actually reviewed, such as:

- Noahide applicability;
- normative guidance;
- study-scope classification;
- disputed/alternative positions;
- specific editorial theological/halakhic claims.

A reviewer may review a passage/block without becoming responsible for software, visual design, unrelated passages or third-party source accuracy outside the recorded scope.

## Review records

A review record should include:

- reviewer identity;
- review scope;
- content object ID;
- canonical content hash/revision;
- decision/status;
- date/time;
- optional note/source basis.

Approved/reviewed status belongs to the exact recorded revision.

Changing review-relevant text invalidates the prior reviewed state unless the system can prove the change is outside the recorded review scope.

## Authority boundaries

The public UI must distinguish:

1. **source** — historical/canonical/classical text;
2. **project elucidation** — modern explanation authored for this edition;
3. **reviewed guidance/applicability** — material with explicit review metadata.

A contributor's GitHub permission level does not convert one category into another.

## Content changes

### Source text/version changes

Require:

- exact version identity;
- manifest update;
- checksum update;
- rights/provenance validation;
- regression review where visible wording changed.

### Editorial elucidation changes

Require:

- evidence refs retained/updated;
- ordinary editorial review;
- rabbinic re-review when the change affects previously reviewed religious/normative claims.

### Applicability/review-state changes

Require explicit review metadata according to the project's review policy.

## Pull requests

The final merge decision belongs to the current canonical steward.

High-impact content PRs should make visible:

- what source/version changed;
- what explanation changed;
- whether review status changes;
- whether a license/attribution changes;
- screenshots when UI meaning/hierarchy changes.

No autonomous build agent should self-merge a major product/content release.

## Transfer / donation of stewardship

The project is intentionally transferable.

A future transfer can include:

- GitHub repository/organization ownership;
- domain/DNS;
- static deployment configuration;
- project branding assets owned by the project;
- release corpus/manifests;
- documentation;
- review records;
- contributor history.

Before transfer:

1. audit secrets and deployment credentials;
2. preserve Git history;
3. preserve third-party source attribution/license metadata;
4. document current reviewers/roles;
5. rotate credentials after ownership transfer;
6. transfer domain/DNS separately where applicable;
7. ensure the new steward understands that historical review records apply to exact revisions.

The original technical builder can remain a collaborator/maintainer if invited, or leave entirely without preventing operation of the product.

## Forks

The open licenses allow forks according to their terms.

A fork may modify code/editorial content but must not imply that:

- the original project's rabbinic reviewers approved the fork's changes;
- the fork is institutionally endorsed by the original steward;
- a review badge/status survives modification without matching review metadata.

## Future institutional governance

If the project becomes materially used, prefer a GitHub organization rather than a single personal account.

Suggested teams:

- `technical-maintainers`;
- `source-editors`;
- `translation-editors`;
- `rabbinic-reviewers`;
- `release-managers`.

Repository permissions should mirror these responsibilities rather than giving every contributor broad administrative access.

## Governing principle

**The software makes authority traceable; it does not create authority.**

The project remains technically open while religious/editorial review stays attached to identifiable people, scopes and revisions.