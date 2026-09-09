# Security Policy

## Supported code

Security work targets the canonical `main` branch and the active production build branch.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue before a fix is available.

For now, report security concerns directly to the repository owner through GitHub. If the project gains additional maintainers or a dedicated security contact, this file will be updated before public launch.

Useful reports include:

- affected route/component;
- reproduction steps;
- expected vs. observed behavior;
- impact;
- browser/runtime where relevant;
- suggested mitigation if known.

## High-priority classes

This project treats the following as high priority:

- cross-site scripting through source/commentary markup;
- source/provenance tampering;
- false review/rabbinic-approval state;
- leaked credentials or environment values;
- unauthorized reviewer/editor mutations;
- open proxy/SSRF behavior through source integrations;
- unsafe redirects or external-link injection;
- vulnerable framework/dependency versions;
- supply-chain compromise;
- content-license/attribution integrity failures that could force emergency removal of text.

## Disclosure philosophy

The goal is fast correction, transparent changelogs where appropriate, and preservation of both application security and textual integrity.
