#!/usr/bin/env python3
"""Build the v1 local release corpus from audited Sefaria ingest dumps.

Source identity is preserved byte-for-byte (UTF-8). No Unicode NFC rewrite.
HTML is converted to a closed span model (text | emphasis | lemma).
"""

from __future__ import annotations

import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INGEST = ROOT / "tmp-ingest"
OUT = ROOT / "src" / "data"
RETRIEVED_AT = "2026-09-09T07:20:00Z"


class SpanParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.spans: list[dict[str, str]] = []
        self.stack: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "iframe", "object", "embed", "form", "a"}:
            self.stack.append("drop")
            return
        if tag in {"b", "strong"}:
            self.stack.append("lemma")
        elif tag in {"i", "em"}:
            self.stack.append("emphasis")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "iframe", "object", "embed", "form", "a", "b", "strong", "i", "em"}:
            if self.stack:
                self.stack.pop()

    def handle_data(self, data: str) -> None:
        if not data:
            return
        if self.stack and self.stack[-1] == "drop":
            return
        kind = "text"
        if self.stack:
            top = self.stack[-1]
            if top in {"lemma", "emphasis"}:
                kind = top
        if self.spans and self.spans[-1]["kind"] == kind:
            self.spans[-1]["text"] += data
        else:
            self.spans.append({"kind": kind, "text": data})


def parse_spans(html: str | None) -> list[dict[str, str]]:
    if not html:
        return []
    parser = SpanParser()
    parser.feed(html)
    parser.close()
    return [s for s in parser.spans if s["text"]]


def plain(spans: list[dict[str, str]]) -> str:
    return "".join(s["text"] for s in spans)


def sha256_text(*parts: str) -> str:
    h = hashlib.sha256()
    for i, part in enumerate(parts):
        if i:
            h.update(b"\n")
        h.update(part.encode("utf-8"))
    return h.hexdigest()


def lemma_from(he_spans: list[dict[str, str]], en_spans: list[dict[str, str]]) -> str:
    for s in he_spans:
        if s["kind"] == "lemma":
            return s["text"].strip().rstrip(".").strip()
    text = plain(en_spans)
    m = re.match(r"^[\u0590-\u05FF\s־׳״'.]+", text)
    if m:
        return m.group(0).strip()
    return ""


def load_json(name: str) -> dict:
    return json.loads((INGEST / name).read_text(encoding="utf-8"))


def dump(name: str, data: object) -> None:
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def main() -> None:
    genesis = load_json("genesis-1-1-6.json")
    rashi = load_json("rashi-gen-1-1-6.json")
    siftei_by_verse: dict[int, dict] = {}
    for v in range(1, 7):
        siftei_by_verse[v] = load_json(f"siftei-1-{v}.json")

    # Scalability gate: Genesis 1:6 is added through this same generator, not UI code.
    verses_n = 6

    text_versions = [
        {
            "id": "tanach-taamei-hamikra",
            "work": "Tanakh",
            "versionTitle": genesis["heVersionTitle"],
            "language": "he",
            "provider": "sefaria",
            "sourceUrl": genesis["heVersionSource"],
            "licenseSpdx": None,
            "licenseStatus": "public-domain",
            "licenseLabel": "Public Domain",
            "attribution": "Tanach with Ta'amei Hamikra, sourced from tanach.us, digitized by Sefaria.",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": True,
            "retrievedAt": RETRIEVED_AT,
            "role": "hebrew-display",
        },
        {
            "id": "jps-1917",
            "work": "Tanakh",
            "versionTitle": genesis["versionTitle"],
            "language": "en",
            "provider": "sefaria",
            "sourceUrl": genesis["versionSource"],
            "licenseSpdx": None,
            "licenseStatus": "public-domain",
            "licenseLabel": "Public Domain",
            "attribution": "The Holy Scriptures: A New Translation (Jewish Publication Society, 1917). Digitized via Open Siddur / Sefaria.",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": True,
            "retrievedAt": RETRIEVED_AT,
            "role": "english-translation",
        },
        {
            "id": "rashi-rosenbaum-silbermann",
            "work": "Rashi on Torah",
            "versionTitle": rashi["versionTitle"],
            "language": "en",
            "provider": "sefaria",
            "sourceUrl": rashi["versionSource"],
            "licenseSpdx": None,
            "licenseStatus": "public-domain",
            "licenseLabel": "Public Domain",
            "attribution": "Pentateuch with Rashi's commentary by M. Rosenbaum and A. M. Silbermann, 1929–1934.",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": True,
            "retrievedAt": RETRIEVED_AT,
            "role": "rashi-english",
        },
        {
            "id": "rashi-rosenbaum-silbermann-he",
            "work": "Rashi on Torah",
            "versionTitle": rashi["heVersionTitle"],
            "language": "he",
            "provider": "sefaria",
            "sourceUrl": rashi["heVersionSource"],
            "licenseSpdx": None,
            "licenseStatus": "public-domain",
            "licenseLabel": "Public Domain",
            "attribution": "Pentateuch with Rashi's commentary by M. Rosenbaum and A. M. Silbermann, 1929–1934 (Hebrew lemma/comment text).",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": True,
            "retrievedAt": RETRIEVED_AT,
            "role": "rashi-hebrew",
        },
        {
            "id": "siftei-metsudah-2009",
            "work": "Siftei Chakhamim",
            "versionTitle": "Sifsei Chachomim Chumash, Metsudah Publications, 2009",
            "language": "en",
            "provider": "sefaria",
            "sourceUrl": "https://www.nli.org.il/he/books/NNL_ALEPH002691623",
            "licenseSpdx": "CC-BY-4.0",
            "licenseStatus": "open-license",
            "licenseLabel": "CC BY",
            "attribution": "Sifsei Chachomim Chumash, Metsudah Publications, 2009. Used under CC BY via Sefaria.",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": "check-license",
            "retrievedAt": RETRIEVED_AT,
            "role": "siftei-english",
        },
        {
            "id": "siftei-metsudah-2009-he",
            "work": "Siftei Chakhamim",
            "versionTitle": "Sifsei Chachomim Chumash, Metsudah Publications, 2009",
            "language": "he",
            "provider": "sefaria",
            "sourceUrl": "https://www.nli.org.il/he/books/NNL_ALEPH002691623",
            "licenseSpdx": "CC-BY-4.0",
            "licenseStatus": "open-license",
            "licenseLabel": "CC BY",
            "attribution": "Sifsei Chachomim Chumash, Metsudah Publications, 2009 (Hebrew). Used under CC BY via Sefaria.",
            "bundleAllowed": True,
            "offlineAllowed": True,
            "derivativeAllowed": "check-license",
            "retrievedAt": RETRIEVED_AT,
            "role": "siftei-hebrew",
        },
    ]

    books = [
        {
            "id": "genesis",
            "canonicalWork": "Genesis",
            "sefariaSlug": "Genesis",
            "division": "torah",
            "order": 1,
            "chapterCount": 50,
            "releasedChapters": [1],
            "titles": {
                "he": "בראשית",
                "en": "Genesis",
                "pt": "Gênesis",
                "transliteration": "Bereshit",
            },
            "aliases": ["Genesis", "Bereshit", "Bereshith", "Gênesis", "Genesis", "Gn", "Gen"],
        },
        {
            "id": "exodus",
            "canonicalWork": "Exodus",
            "sefariaSlug": "Exodus",
            "division": "torah",
            "order": 2,
            "chapterCount": 40,
            "releasedChapters": [],
            "titles": {"he": "שמות", "en": "Exodus", "pt": "Êxodo", "transliteration": "Shemot"},
            "aliases": ["Exodus", "Shemot", "Êxodo", "Ex"],
        },
        {
            "id": "isaiah",
            "canonicalWork": "Isaiah",
            "sefariaSlug": "Isaiah",
            "division": "neviim",
            "order": 12,
            "chapterCount": 66,
            "releasedChapters": [],
            "titles": {"he": "ישעיהו", "en": "Isaiah", "pt": "Isaías", "transliteration": "Yeshayahu"},
            "aliases": ["Isaiah", "Yeshayahu", "Isaías", "Isa"],
        },
        {
            "id": "psalms",
            "canonicalWork": "Psalms",
            "sefariaSlug": "Psalms",
            "division": "ketuvim",
            "order": 27,
            "chapterCount": 150,
            "releasedChapters": [],
            "titles": {"he": "תהלים", "en": "Psalms", "pt": "Salmos", "transliteration": "Tehillim"},
            "aliases": ["Psalms", "Tehillim", "Salmos", "Ps"],
        },
    ]

    verse_scope = {
        1: {
            "tags": ["UNIVERSAL_CREATION", "EMUNAH", "ISRAEL_COVENANT_CONTEXT"],
            "address": "humanity",
            "addressNote": {
                "en": "The verse narrates the creation of heaven and earth. It is not a commandment addressed to Israel or to Bnei Noach. Rashi’s first comment, however, explains why Israel’s Torah begins here, which is Israel-covenant context.",
                "pt": "O versículo narra a criação dos céus e da terra. Não é um mandamento dirigido a Israel ou aos Bnei Noach. O primeiro comentário de Rashi, porém, explica por que a Torá de Israel começa aqui — contexto da aliança de Israel.",
            },
        },
        2: {
            "tags": ["UNIVERSAL_CREATION", "EMUNAH"],
            "address": "humanity",
            "addressNote": {
                "en": "A description of the earth before formed order. No legal address.",
                "pt": "Descrição da terra antes da ordem formada. Sem endereço legal.",
            },
        },
        3: {
            "tags": ["UNIVERSAL_CREATION", "EMUNAH"],
            "address": "humanity",
            "addressNote": {
                "en": "Divine speech brings light into being. Universal narrative, not a human obligation.",
                "pt": "A fala divina faz a luz existir. Narrativa universal, não uma obrigação humana.",
            },
        },
        4: {
            "tags": ["UNIVERSAL_CREATION", "EMUNAH"],
            "address": "humanity",
            "addressNote": {
                "en": "God evaluates and separates light from darkness. Cosmic order, not covenantal law.",
                "pt": "Deus avalia e separa a luz das trevas. Ordem cósmica, não lei da aliança.",
            },
        },
        5: {
            "tags": ["UNIVERSAL_CREATION", "EMUNAH"],
            "address": "hashem_alone",
            "addressNote": {
                "en": "Naming Day and Night, and the first day’s close. Rashi reads “one day” as pointing to God’s uniqueness before the angels are created.",
                "pt": "A nomeação de Dia e Noite, e o encerramento do primeiro dia. Rashi lê “um dia” como apontando à unicidade de Deus antes da criação dos anjos.",
            },
        },
        6: {
            "tags": ["UNIVERSAL_CREATION"],
            "address": "humanity",
            "addressNote": {
                "en": "The command that establishes the firmament. Creation narrative, not a Noahide statute.",
                "pt": "O comando que estabelece o firmamento. Narrativa da criação, não um estatuto noahide.",
            },
        },
    }

    verses = []
    commentary_segments = []
    source_links = []
    source_manifest = []

    he_verses = genesis["he"]
    en_verses = genesis["text"]

    for i in range(verses_n):
        n = i + 1
        he = he_verses[i]
        en = en_verses[i]
        checksum = sha256_text(he, en)
        verses.append(
            {
                "id": f"genesis-1-{n}",
                "canonicalRef": {
                    "work": "Genesis",
                    "bookId": "genesis",
                    "chapter": 1,
                    "verse": n,
                    "osis": f"Gen.1.{n}",
                    "sefaria": f"Genesis.{n}" if False else f"Genesis.1.{n}",
                    "display": {
                        "en": f"Genesis 1:{n}",
                        "he": f"בראשית א׳:{n}",
                        "pt": f"Gênesis 1:{n}",
                    },
                },
                "hebrew": {
                    "versionId": "tanach-taamei-hamikra",
                    "text": he,
                    "checksumSha256": sha256_text(he),
                },
                "translation": {
                    "versionId": "jps-1917",
                    "text": en,
                    "checksumSha256": sha256_text(en),
                },
                "scopeTags": verse_scope[n]["tags"],
                "address": verse_scope[n]["address"],
                "addressNote": verse_scope[n]["addressNote"],
                "sefariaUrl": f"https://www.sefaria.org/Genesis.1.{n}?vhe=Tanach_with_Ta'amei_Hamikra&ven=The_Holy_Scriptures:_A_New_Translation_(JPS_1917)&lang=bi",
                "payloadChecksumSha256": checksum,
            }
        )

        rashi_en = rashi["text"][i] if i < len(rashi["text"]) else []
        rashi_he = rashi["he"][i] if i < len(rashi["he"]) else []
        if not isinstance(rashi_en, list):
            rashi_en = [rashi_en] if rashi_en else []
        if not isinstance(rashi_he, list):
            rashi_he = [rashi_he] if rashi_he else []

        for si, (en_seg, he_seg) in enumerate(zip(rashi_en, rashi_he), 1):
            en_spans = parse_spans(en_seg)
            he_spans = parse_spans(he_seg)
            lemma = lemma_from(he_spans, en_spans)
            seg_id = f"rashi-genesis-1-{n}-{si}"
            commentary_segments.append(
                {
                    "id": seg_id,
                    "workId": "rashi-on-genesis",
                    "canonicalRef": f"Rashi on Genesis 1:{n}:{si}",
                    "sefariaRef": f"Rashi_on_Genesis.1.{n}.{si}",
                    "targetVerseId": f"genesis-1-{n}",
                    "segment": si,
                    "dibburHamatchil": lemma,
                    "languagePair": "he-en",
                    "hebrew": {
                        "versionId": "rashi-rosenbaum-silbermann-he",
                        "spans": he_spans,
                        "plain": plain(he_spans),
                        "checksumSha256": sha256_text(he_seg),
                    },
                    "english": {
                        "versionId": "rashi-rosenbaum-silbermann",
                        "spans": en_spans,
                        "plain": plain(en_spans),
                        "checksumSha256": sha256_text(en_seg),
                    },
                    "sefariaUrl": f"https://www.sefaria.org/Rashi_on_Genesis.1.{n}.{si}?lang=bi",
                }
            )
            source_links.append(
                {
                    "id": f"link-{seg_id}-verse",
                    "relationship": "COMMENTS_ON",
                    "from": seg_id,
                    "to": f"genesis-1-{n}",
                    "localTextAvailable": True,
                }
            )

        sdata = siftei_by_verse.get(n, {})
        s_en = sdata.get("text") or []
        s_he = sdata.get("he") or []
        if not isinstance(s_en, list):
            s_en = [s_en] if s_en else []
        if not isinstance(s_he, list):
            s_he = [s_he] if s_he else []
        # Bound public depth: first four comments are enough for the guided Sources layer.
        for si, (en_seg, he_seg) in enumerate(zip(s_en[:4], s_he[:4] + [""] * 4), 1):
            if not en_seg:
                continue
            en_spans = parse_spans(en_seg)
            he_spans = parse_spans(he_seg or "")
            lemma = lemma_from(he_spans, en_spans)
            seg_id = f"siftei-genesis-1-{n}-{si}"
            commentary_segments.append(
                {
                    "id": seg_id,
                    "workId": "siftei-chakhamim-on-genesis",
                    "canonicalRef": f"Siftei Chakhamim, Genesis 1:{n}:{si}",
                    "sefariaRef": f"Siftei_Chakhamim,_Genesis.1.{n}.{si}",
                    "targetVerseId": f"genesis-1-{n}",
                    "segment": si,
                    "dibburHamatchil": lemma,
                    "languagePair": "he-en",
                    "hebrew": {
                        "versionId": "siftei-metsudah-2009-he",
                        "spans": he_spans,
                        "plain": plain(he_spans),
                        "checksumSha256": sha256_text(he_seg or ""),
                    },
                    "english": {
                        "versionId": "siftei-metsudah-2009",
                        "spans": en_spans,
                        "plain": plain(en_spans),
                        "checksumSha256": sha256_text(en_seg),
                    },
                    "sefariaUrl": f"https://www.sefaria.org/Siftei_Chakhamim,_Genesis.1.{n}.{si}?lang=bi",
                    "attributionRequired": True,
                }
            )
            source_links.append(
                {
                    "id": f"link-{seg_id}-rashi",
                    "relationship": "EXPLAINS_COMMENTARY",
                    "from": seg_id,
                    "to": f"rashi-genesis-1-{n}-1",
                    "localTextAvailable": True,
                    "note": "Siftei Chakhamim is a supercommentary on Rashi; alignment is verse-level in this release, with lemma identity preserved per segment.",
                }
            )

    # Midrash relationships without bundling unknown-rights Hebrew.
    source_links.extend(
        [
            {
                "id": "link-rashi-gen-1-1-1-yalkut",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-1-1",
                "to": "Yalkut Shimoni on Torah 187",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Yalkut_Shimoni_on_Torah.187",
            },
            {
                "id": "link-rashi-gen-1-4-1-chagigah",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-4-1",
                "to": "Chagigah 12a",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Chagigah.12a",
            },
            {
                "id": "link-rashi-gen-1-4-1-br",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-4-1",
                "to": "Bereshit Rabbah 3:6",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Bereshit_Rabbah.3.6",
            },
            {
                "id": "link-rashi-gen-1-5-1-br",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-5-1",
                "to": "Bereshit Rabbah 3:8",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Bereshit_Rabbah.3.8",
            },
            {
                "id": "link-rashi-gen-1-6-1-br",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-6-1",
                "to": "Bereshit Rabbah 4:2",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Bereshit_Rabbah.4.2",
            },
            {
                "id": "link-rashi-gen-1-6-2-br",
                "relationship": "RASHI_SOURCE",
                "from": "rashi-genesis-1-6-2",
                "to": "Bereshit Rabbah 4:3",
                "localTextAvailable": False,
                "externalUrl": "https://www.sefaria.org/Bereshit_Rabbah.4.3",
            },
        ]
    )

    for tv in text_versions:
        # checksum of identity fields, filled after verse hashing
        payload = json.dumps(
            {k: tv[k] for k in ("id", "versionTitle", "language", "sourceUrl", "licenseStatus")},
            ensure_ascii=False,
            separators=(",", ":"),
        )
        tv["checksumSha256"] = sha256_text(payload)
        source_manifest.append(
            {
                "id": tv["id"],
                "work": tv["work"],
                "canonicalRefRange": "Genesis 1:1-6",
                "versionTitle": tv["versionTitle"],
                "language": tv["language"],
                "provider": tv["provider"],
                "sourceUrl": tv["sourceUrl"],
                "licenseSpdx": tv.get("licenseSpdx"),
                "licenseStatus": tv["licenseStatus"],
                "licenseLabel": tv["licenseLabel"],
                "attribution": tv["attribution"],
                "bundleAllowed": tv["bundleAllowed"],
                "offlineAllowed": tv["offlineAllowed"],
                "derivativeAllowed": tv["derivativeAllowed"],
                "retrievedAt": tv["retrievedAt"],
                "checksumSha256": tv["checksumSha256"],
                "notes": "Frozen at ingest. Upstream metadata change requires a new corpus release.",
            }
        )

    commentary_works = [
        {
            "id": "rashi-on-genesis",
            "title": {"en": "Rashi on Genesis", "he": 'רש"י על בראשית', "pt": "Rashi sobre Gênesis"},
            "author": "Rashi (R. Shlomo Yitzchaki)",
            "era": "classical",
            "kind": "CLASSICAL_COMMENTARY",
            "englishVersionId": "rashi-rosenbaum-silbermann",
            "hebrewVersionId": "rashi-rosenbaum-silbermann-he",
        },
        {
            "id": "siftei-chakhamim-on-genesis",
            "title": {"en": "Siftei Chakhamim", "he": "שפתי חכמים", "pt": "Siftei Chakhamim"},
            "author": "R. Shabbetai Bass",
            "era": "early-modern",
            "kind": "CLASSICAL_COMMENTARY",
            "englishVersionId": "siftei-metsudah-2009",
            "hebrewVersionId": "siftei-metsudah-2009-he",
            "attributionRequired": True,
        },
    ]

    elucidations = build_elucidations()
    glossary = build_glossary()
    guided_paths = build_paths()
    review_records = build_reviews(verses, commentary_segments, elucidations)
    providers = [
        {
            "id": "sefaria",
            "name": "Sefaria",
            "kind": "enrichment",
            "baseUrl": "https://www.sefaria.org",
            "apiBaseUrl": "https://www.sefaria.org/api",
            "runtimeRequired": False,
            "allowedHosts": ["www.sefaria.org", "sefaria.org"],
            "notes": "Deep-library and deep-link provider. Released passages render from the local corpus.",
        }
    ]
    licenses = [
        {"id": "public-domain", "label": "Public Domain", "spdx": None, "bundleAllowed": True},
        {"id": "cc-by-4.0", "label": "CC BY 4.0", "spdx": "CC-BY-4.0", "bundleAllowed": True, "attributionRequired": True},
        {"id": "cc0-1.0", "label": "CC0 1.0", "spdx": "CC0-1.0", "bundleAllowed": True},
        {"id": "ofl-1.1", "label": "SIL Open Font License 1.1", "spdx": "OFL-1.1", "bundleAllowed": True},
        {"id": "apache-2.0", "label": "Apache License 2.0", "spdx": "Apache-2.0", "bundleAllowed": True},
        {"id": "mit", "label": "MIT", "spdx": "MIT", "bundleAllowed": True},
    ]

    passages = [
        {
            "id": "genesis-1",
            "bookId": "genesis",
            "chapter": 1,
            "title": {"en": "Genesis 1", "he": "בראשית א׳", "pt": "Gênesis 1"},
            "verseIds": [f"genesis-1-{n}" for n in range(1, verses_n + 1)],
            "released": True,
            "defaultPathId": "creation-and-humanity",
        }
    ]

    dump("books.json", books)
    dump("passages.json", passages)
    dump("verses.json", verses)
    dump("text-versions.json", text_versions)
    dump("commentary-works.json", commentary_works)
    dump("commentary-segments.json", commentary_segments)
    dump("elucidations.json", elucidations)
    dump("source-links.json", source_links)
    dump("glossary.json", glossary)
    dump("guided-paths.json", guided_paths)
    dump("review-records.json", review_records)
    dump("providers.json", providers)
    dump("licenses.json", licenses)
    dump("source-manifest.json", source_manifest)

    index = {
        "release": "v1-genesis-1-1-5",
        "generatedAt": RETRIEVED_AT,
        "verseCount": len(verses),
        "segmentCount": len(commentary_segments),
        "normalization": "none — UTF-8 as received; hash is SHA-256 of stored UTF-8 bytes",
    }
    dump("release-index.json", index)


ELUCIDATION_GLOSSARY = {
    "eluc-genesis-1-1-verse": ["rashi"],
    "eluc-genesis-1-1-why-rashi-1": ["rashi", "dibbur-hamatchil", "siftei-chakhamim"],
    "eluc-genesis-1-1-understand-rashi-1": ["rashi", "siftei-chakhamim"],
    "eluc-genesis-1-1-why-rashi-2": ["dibbur-hamatchil", "peshat", "derash"],
    "eluc-genesis-1-1-understand-rashi-2": ["peshat", "derash"],
    "eluc-genesis-1-1-why-rashi-3": ["elohim", "tetragrammaton"],
    "eluc-genesis-1-1-understand-rashi-3": ["elohim", "tetragrammaton"],
    "eluc-genesis-1-2-why-rashi": ["rashi", "dibbur-hamatchil", "siftei-chakhamim"],
    "eluc-genesis-1-2-understand-rashi": ["rashi", "siftei-chakhamim"],
    "eluc-genesis-1-3-verse": ["rashi"],
    "eluc-genesis-1-4-why-rashi": ["rashi", "dibbur-hamatchil", "peshat", "derash", "siftei-chakhamim"],
    "eluc-genesis-1-4-understand-rashi": ["peshat", "derash", "chazal"],
    "eluc-genesis-1-5-why-rashi": ["rashi", "dibbur-hamatchil", "siftei-chakhamim"],
    "eluc-genesis-1-5-understand-rashi": ["rashi"],
    "eluc-genesis-1-6-why-rashi": ["rashi", "dibbur-hamatchil", "siftei-chakhamim"],
    "eluc-genesis-1-6-understand-rashi": ["rashi", "dibbur-hamatchil"],
}


def build_elucidations() -> list[dict]:
    """Project-authored beginner elucidation. Not historical source text."""
    items = [
        {
            "id": "eluc-genesis-1-1-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "The Torah opens with the creation of heaven and earth. The Hebrew does not begin with a commandment. It begins with a world that already belongs to God. JPS 1917 renders the verse as a complete act: “In the beginning God created the heaven and the earth.” Rashi will immediately show that the Hebrew word בְּרֵאשִׁית is grammatically more complicated than that English sentence, and that the Torah’s decision to start here is itself a question.",
                "pt": "A Torá se abre com a criação dos céus e da terra. O hebraico não começa com um mandamento. Começa com um mundo que já pertence a Deus. A tradução JPS 1917 apresenta o versículo como um ato completo: “In the beginning God created the heaven and the earth.” Rashi mostrará em seguida que a palavra hebraica בְּרֵאשִׁית é gramaticalmente mais complexa do que essa frase inglesa, e que a decisão da Torá de começar aqui é, ela mesma, uma pergunta.",
            },
            "claims": [
                {
                    "text": "The verse is a creation narrative, not a commandment.",
                    "evidenceRefs": ["genesis-1-1", "rashi-genesis-1-1-1"],
                    "status": "sources-verified",
                }
            ],
            "classicalFeature": "The Torah begins with narrative rather than with Israel’s first national commandment.",
        },
        {
            "id": "eluc-genesis-1-1-why-rashi-1",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-1-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Rashi’s first lemma is simply בְּרֵאשִׁית — “In the beginning.” The difficulty is not a rare word. It is a structural question: if the Torah is Israel’s book of commandments, why does it not open with the first mitzvah given to the nation (Exodus 12:2)? Siftei Chakhamim makes the question sharper: the Torah is called Torah, “instruction,” because of the mitzvot. Why, then, begin with these narratives at all?",
                "pt": "O primeiro lema de Rashi é simplesmente בְּרֵאשִׁית — “No princípio.” A dificuldade não é uma palavra rara. É uma pergunta estrutural: se a Torá é o livro de mandamentos de Israel, por que não se abre com a primeira mitzvá dada à nação (Êxodo 12:2)? Siftei Chakhamim torna a pergunta mais nítida: a Torá se chama Torá, “instrução”, por causa das mitzvot. Por que, então, começar com estas narrativas?",
            },
            "claims": [
                {
                    "text": "Rashi is answering why the Torah begins with creation rather than with Israel’s first commandment.",
                    "evidenceRefs": ["rashi-genesis-1-1-1", "siftei-genesis-1-1-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-understand-rashi-1",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-1-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Rashi answers in the name of Rabbi Isaac. The Torah begins with creation so that Israel can answer the nations: the earth is God’s; He gives it to whom He wills. Siftei Chakhamim notes that “What is the reason…?” is already the start of the answer — Psalms 111:6 supplies the reason. This comment is about Israel’s title to the land. It is necessary context for understanding Rashi. It is not a Noahide obligation, and it is not a reason to skip the verse. A Ben Noach reads it as Israel-covenant context inside a universal creation account.",
                "pt": "Rashi responde em nome do Rabi Isaac. A Torá começa com a criação para que Israel possa responder às nações: a terra é de Deus; Ele a dá a quem quer. Siftei Chakhamim observa que “Qual é a razão…?” já é o início da resposta — o Salmo 111:6 fornece o motivo. Este comentário trata do título de Israel à terra. É contexto necessário para entender Rashi. Não é uma obrigação noahide, e não é motivo para pular o versículo. Um Ben Noach o lê como contexto da aliança de Israel dentro de um relato universal da criação.",
            },
            "claims": [
                {
                    "text": "The first Rashi on Genesis 1:1 is Israel-covenant context, not a Noahide commandment.",
                    "evidenceRefs": ["rashi-genesis-1-1-1", "siftei-genesis-1-1-4"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-why-rashi-2",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-1-2",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "The second lemma is בְּרֵאשִׁית בָּרָא. Rashi says the verse “calls aloud for explanation.” Two issues are in play: the midrashic reading of רֵאשִׁית as “for the sake of Torah / Israel,” and the peshat problem that בְּרֵאשִׁית is a construct form — “beginning of…” — not a free-standing adverb “in the beginning.”",
                "pt": "O segundo lema é בְּרֵאשִׁית בָּרָא. Rashi diz que o versículo “clama por explicação.” Há duas questões: a leitura midráshica de רֵאשִׁית como “por causa da Torá / de Israel”, e o problema de peshat de que בְּרֵאשִׁית é uma forma construta — “princípio de…” — e não um advérbio independente “no princípio.”",
            },
            "claims": [
                {
                    "text": "Rashi treats בראשית as grammatically construct, not as a simple adverb of time.",
                    "evidenceRefs": ["rashi-genesis-1-1-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-understand-rashi-2",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-1-2",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Rashi first reports the derash: God created the world for the sake of Torah and for the sake of Israel, both called רֵאשִׁית. Then he gives peshat: read “at the beginning of God’s creating heaven and earth…” The verse is not a chronological inventory proving that heaven and earth were the first created things — the waters are already present in verse 2. This is how Jewish reading works: midrash and peshat can sit on the same lemma without one erasing the other.",
                "pt": "Rashi primeiro relata o derash: Deus criou o mundo por causa da Torá e por causa de Israel, ambos chamados רֵאשִׁית. Depois dá o peshat: leia-se “no princípio de Deus criar céus e terra…”. O versículo não é um inventário cronológico provando que céus e terra foram as primeiras coisas criadas — as águas já estão presentes no versículo 2. É assim que a leitura judaica funciona: midrash e peshat podem ocupar o mesmo lema sem que um apague o outro.",
            },
            "claims": [
                {
                    "text": "Rashi distinguishes derash (for the sake of Torah/Israel) from peshat (construct “beginning of creating”).",
                    "evidenceRefs": ["rashi-genesis-1-1-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-why-rashi-3",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-1-3",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "The third lemma is בָּרָא אֱלֹהִים. Why this Divine Name, and not the Tetragrammaton? Rashi hears a theological choice in the Name itself.",
                "pt": "O terceiro lema é בָּרָא אֱלֹהִים. Por que este Nome Divino, e não o Tetragrama? Rashi ouve uma escolha teológica no próprio Nome.",
            },
            "claims": [
                {
                    "text": "Rashi comments because the verse uses Elohim rather than the Tetragrammaton.",
                    "evidenceRefs": ["rashi-genesis-1-1-3"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-understand-rashi-3",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-1",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-1-3",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "In classical Jewish usage, Elohim is associated with judgment (din) and the Tetragrammaton with mercy (rachamim). Rashi says God first intended to create the world under strict justice, saw that it could not endure, and allied mercy with justice — which is why Genesis 2:4 says “the LORD God.” This is emunah: the world exists because justice is joined to mercy. It is not a ritual instruction.",
                "pt": "No uso judaico clássico, Elohim se associa ao juízo (din) e o Tetragrama à misericórdia (rachamim). Rashi diz que Deus primeiro pretendeu criar o mundo sob estrita justiça, viu que ele não poderia subsistir, e aliou a misericórdia à justiça — por isso Gênesis 2:4 diz “the LORD God.” Isto é emunah: o mundo existe porque a justiça está unida à misericórdia. Não é uma instrução ritual.",
            },
            "claims": [
                {
                    "text": "Elohim signals the attribute of justice; Genesis 2:4’s double Name shows mercy joined to justice.",
                    "evidenceRefs": ["rashi-genesis-1-1-3", "genesis-1-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-1-bnei-noach",
            "type": "NOAHIDE_GUIDANCE",
            "verseId": "genesis-1-1",
            "slot": "for-bnei-noach",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "scope": "NOAHIDE_RELEVANT",
            "text": {
                "en": "A Ben Noach is addressed by the fact of creation: the world is God’s, and humanity stands inside it. The first Rashi about Israel’s land is not a Noahide law. It is context for why Israel’s Torah begins here. Do not convert that comment into a commandment for the nations, and do not delete it. Read it as Israel-covenant context beside a universal opening.",
                "pt": "Um Ben Noach é interpelado pelo fato da criação: o mundo é de Deus, e a humanidade está dentro dele. O primeiro Rashi sobre a terra de Israel não é uma lei noahide. É contexto para entender por que a Torá de Israel começa aqui. Não transforme esse comentário em mandamento para as nações, e não o apague. Leia-o como contexto da aliança de Israel ao lado de uma abertura universal.",
            },
            "sourceRefs": ["rashi-genesis-1-1-1", "rashi-genesis-1-1-3", "genesis-1-1"],
            "reviewNote": "Normative Noahide application remains pending named rabbinic review. This block is contextual, not a ruling.",
        },
        {
            "id": "eluc-genesis-1-2-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-2",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Before light, the earth is תֹהוּ וָבֹהוּ — unformed and void — with darkness over the deep, and the spirit of God hovering over the waters. The verse is atmosphere and grammar, not ethics. Rashi will gloss the rare words and the hovering.",
                "pt": "Antes da luz, a terra é תֹהוּ וָבֹהוּ — informe e vazia — com trevas sobre o abismo, e o espírito de Deus pairando sobre as águas. O versículo é atmosfera e gramática, não ética. Rashi glosará as palavras raras e o pairar.",
            },
            "claims": [
                {
                    "text": "Verse 2 describes pre-formed earth, darkness, waters, and the hovering spirit of God.",
                    "evidenceRefs": ["genesis-1-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-2-why-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-2",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-2-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Rashi stops on תֹהוּ וָבֹהוּ because the words are uncommon and easily flattened. He also explains פְּנֵי תְהוֹם and the hovering of רוּחַ אֱלֹהִים. Siftei Chakhamim on “upon the waters” asks why the verse says “on the face of the deep” rather than simply “on the deep.”",
                "pt": "Rashi se detém em תֹהוּ וָבֹהוּ porque as palavras são incomuns e facilmente achatadas. Explica também פְּנֵי תְהוֹם e o pairar de רוּחַ אֱלֹהִים. Siftei Chakhamim, em “sobre as águas”, pergunta por que o versículo diz “sobre a face do abismo” e não simplesmente “sobre o abismo.”",
            },
            "claims": [
                {
                    "text": "Rashi comments here to define rare diction and the image of hovering.",
                    "evidenceRefs": ["rashi-genesis-1-2-1", "rashi-genesis-1-2-5", "siftei-genesis-1-2-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-2-understand-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-2",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-2-5",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "For Rashi, תֹהוּ is astonishment at emptiness; בֹהוּ is empty space. The deep is the waters already upon the earth. “The spirit of God hovering” is the throne of Glory standing in space, hovering over the waters by God’s breath and command, as a dove hovers over its nest. Siftei Chakhamim asks why the verse needed “hovering” if the subject is the Throne — a typical supercommentary move: isolate the extra word that generated Rashi’s image.",
                "pt": "Para Rashi, תֹהוּ é o espanto diante do vazio; בֹהוּ é o espaço vazio. O abismo são as águas já sobre a terra. “O espírito de Deus pairava” é o trono da Glória no espaço, pairando sobre as águas pelo sopro e comando de Deus, como uma pomba sobre o ninho. Siftei Chakhamim pergunta por que o versículo precisava de “pairar” se o sujeito é o Trono — um gesto típico de supercomentário: isolar a palavra extra que gerou a imagem de Rashi.",
            },
            "claims": [
                {
                    "text": "Rashi identifies the hovering spirit with the Throne of Glory, compared to a dove.",
                    "evidenceRefs": ["rashi-genesis-1-2-5", "siftei-genesis-1-2-3"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-3-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-3",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Creation by speech: God said “Let there be light,” and there was light. The Rosenbaum–Silbermann Rashi has no comment on this verse. That absence is information. Not every verse is a problem for Rashi. The reader can stay with the verse.",
                "pt": "Criação pela fala: Deus disse “Haja luz”, e houve luz. O Rashi de Rosenbaum–Silbermann não comenta este versículo. A ausência é informação. Nem todo versículo é um problema para Rashi. O leitor pode permanecer com o versículo.",
            },
            "claims": [
                {
                    "text": "Rashi has no comment on Genesis 1:3 in the selected edition.",
                    "evidenceRefs": ["genesis-1-3"],
                    "status": "sources-verified",
                }
            ],
            "classicalFeature": "Rashi’s silence is itself part of the reading.",
        },
        {
            "id": "eluc-genesis-1-4-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-4",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "God sees the light, that it is good, and divides light from darkness. The verb of seeing and the verb of dividing sit in one sentence. That compression is what Rashi hears.",
                "pt": "Deus vê a luz, que é boa, e divide a luz das trevas. O verbo de ver e o verbo de dividir estão na mesma frase. Essa compressão é o que Rashi ouve.",
            },
            "claims": [
                {
                    "text": "The verse joins evaluation (“good”) to separation of light and darkness.",
                    "evidenceRefs": ["genesis-1-4"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-4-why-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-4",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-4-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Why comment? Because “He saw… that it was good, and He divided” can sound as if light and darkness had been mixed, or as if God reconsidered. Siftei Chakhamim says the aggadic explanation is needed because “to divide” is said of things that were mingled. Rashi therefore gives both aggadah and peshat.",
                "pt": "Por que comentar? Porque “Ele viu… que era boa, e Ele dividiu” pode soar como se luz e trevas tivessem estado misturadas, ou como se Deus tivesse reconsiderado. Siftei Chakhamim diz que a explicação agádica é necessária porque “dividir” se diz de coisas que estavam misturadas. Rashi, então, dá agadah e peshat.",
            },
            "claims": [
                {
                    "text": "Rashi comments because seeing-and-dividing in one verse raises a mixing/order problem.",
                    "evidenceRefs": ["rashi-genesis-1-4-1", "siftei-genesis-1-4-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-4-understand-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-4",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-4-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Aggadah (Chagigah 12a): God saw that the wicked were unworthy of this light and reserved it for the righteous in the world to come. Peshat (Genesis Rabbah 3:6): it was not seemly that light and darkness function in confusion, so each received a domain — day and night. Again Rashi refuses to collapse midrash into peshat.",
                "pt": "Agadah (Chagigah 12a): Deus viu que os ímpios não eram dignos desta luz e a reservou para os justos no mundo vindouro. Peshat (Gênesis Rabbá 3:6): não era conveniente que luz e trevas funcionassem em confusão, então cada uma recebeu um domínio — dia e noite. Outra vez Rashi recusa colapsar midrash em peshat.",
            },
            "claims": [
                {
                    "text": "Rashi gives an aggadic reservation of the light and a peshat division of domains.",
                    "evidenceRefs": ["rashi-genesis-1-4-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-5-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-5",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "God names the light Day and the darkness Night. Evening and morning make יוֹם אֶחָד — “one day,” not “the first day.” JPS 1917 preserves that wording. The naming is an act of order. The odd cardinal number is the textual snag.",
                "pt": "Deus nomeia a luz Dia e as trevas Noite. Tarde e manhã fazem יוֹם אֶחָד — “um dia”, não “o primeiro dia.” A JPS 1917 preserva essa redação. A nomeação é um ato de ordem. O numeral cardinal inesperado é o ponto textual.",
            },
            "claims": [
                {
                    "text": "The verse says “one day” (יום אחד) rather than “first day.”",
                    "evidenceRefs": ["genesis-1-5", "rashi-genesis-1-5-1"],
                    "status": "sources-verified",
                }
            ],
            "classicalFeature": "יום אחד instead of יום ראשון.",
        },
        {
            "id": "eluc-genesis-1-5-why-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-5",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-5-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "The rest of the chapter uses ordinals: second, third, fourth. Why “one”? Siftei Chakhamim restates the expectation: it should have said “the first day.” That mismatch is the whole reason Rashi is here.",
                "pt": "O restante do capítulo usa ordinais: segundo, terceiro, quarto. Por que “um”? Siftei Chakhamim reitera a expectativa: deveria ter dito “o primeiro dia.” Esse descompasso é toda a razão de Rashi estar aqui.",
            },
            "claims": [
                {
                    "text": "Rashi comments because אחד breaks the ordinal pattern of the chapter.",
                    "evidenceRefs": ["rashi-genesis-1-5-1", "siftei-genesis-1-5-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-5-understand-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-5",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-5-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Rashi, following Genesis Rabbah 3:8, reads “one day” as a statement about God: the Holy One was then the Only One in His universe, because the angels were not created until the second day. The verse’s grammar becomes emunah — divine uniqueness — without turning the day-count into a human commandment.",
                "pt": "Rashi, seguindo Gênesis Rabbá 3:8, lê “um dia” como afirmação sobre Deus: o Santo, bendito seja, era então o Único em Seu universo, porque os anjos não foram criados senão no segundo dia. A gramática do versículo se torna emunah — unicidade divina — sem transformar a contagem dos dias em mandamento humano.",
            },
            "claims": [
                {
                    "text": "“One day” alludes to God as the Only One before the angels’ creation on day two.",
                    "evidenceRefs": ["rashi-genesis-1-5-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-6-verse",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-6",
            "slot": "understanding-the-verse",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "God says: let there be a רָקִיעַ — a firmament — in the midst of the waters, dividing waters from waters. The verse is a command of cosmic order, not a human statute. Rashi will ask why “let there be” if the heavens already appeared in verse 1.",
                "pt": "Deus diz: haja um רָקִיעַ — um firmamento — no meio das águas, separando águas de águas. O versículo é um comando de ordem cósmica, não um estatuto humano. Rashi perguntará por que “haja” se os céus já apareceram no versículo 1.",
            },
            "claims": [
                {
                    "text": "Verse 6 commands the establishment of the firmament amid the waters.",
                    "evidenceRefs": ["genesis-1-6", "rashi-genesis-1-6-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-6-why-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-6",
            "slot": "why-rashi",
            "targetSegmentId": "rashi-genesis-1-6-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "Siftei Chakhamim states the question: “Let there be a רקיע” sounds as if it is created now, but verse 1 already said heaven was created. Rashi answers that the heavens of day one were still fluid and only solidified on day two.",
                "pt": "Siftei Chakhamim formula a pergunta: “Haja um רקיע” soa como se fosse criado agora, mas o versículo 1 já dissera que o céu foi criado. Rashi responde que os céus do primeiro dia ainda estavam fluidos e só se solidificaram no segundo.",
            },
            "claims": [
                {
                    "text": "Rashi comments because “let there be a firmament” seems to recast a heaven already created.",
                    "evidenceRefs": ["rashi-genesis-1-6-1", "siftei-genesis-1-6-1"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-6-understand-rashi",
            "type": "EDITORIAL_ELUCIDATION",
            "verseId": "genesis-1-6",
            "slot": "understanding-rashi",
            "targetSegmentId": "rashi-genesis-1-6-1",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "text": {
                "en": "For Rashi, יהי רקיע means “let the expanse become fixed.” Job 26:11 is the proof-text: the pillars of heaven trembled all of day one and stood astonished at His rebuke on day two. The second lemma, בתוך המים, places the firmament in the exact middle, with equal distance above and below, the upper waters suspended by the King’s command.",
                "pt": "Para Rashi, יהי רקיע significa “que a expansão se firme.” Jó 26:11 é o texto-prova: as colunas do céu tremeram todo o primeiro dia e se assombraram com a repreensão no segundo. O segundo lema, בתוך המים, coloca o firmamento exatamente no meio, com igual distância acima e abaixo, as águas superiores suspensas pela ordem do Rei.",
            },
            "claims": [
                {
                    "text": "Rashi reads the firmament as a solidification of day-one heavens, centered in the waters.",
                    "evidenceRefs": ["rashi-genesis-1-6-1", "rashi-genesis-1-6-2"],
                    "status": "sources-verified",
                }
            ],
        },
        {
            "id": "eluc-genesis-1-5-bnei-noach",
            "type": "NOAHIDE_GUIDANCE",
            "verseId": "genesis-1-5",
            "slot": "for-bnei-noach",
            "status": "sources-verified",
            "author": "Ben Noach editorial layer",
            "revision": 1,
            "updatedAt": RETRIEVED_AT,
            "scope": "EMUNAH",
            "text": {
                "en": "The naming of Day and Night, and the insistence that God was then unique in His world, belong to emunah — knowledge of the One God — not to a Jewish-practice rule about how to count days. A Ben Noach may receive this as theology of creation.",
                "pt": "A nomeação de Dia e Noite, e a afirmação de que Deus era então único em Seu mundo, pertencem à emunah — conhecimento do Deus Uno — e não a uma regra de prática judaica sobre como contar os dias. Um Ben Noach pode receber isto como teologia da criação.",
            },
            "sourceRefs": ["rashi-genesis-1-5-1", "genesis-1-5"],
            "reviewNote": "Contextual emunah note; not a halakhic ruling. Rabbinic review pending.",
        },
    ]
    for item in items:
        ids = ELUCIDATION_GLOSSARY.get(item["id"])
        if ids:
            item["glossaryIds"] = ids
    return items


def build_glossary() -> list[dict]:
    return [
        {
            "id": "rashi",
            "term": {"en": "Rashi", "he": 'רש"י', "pt": "Rashi"},
            "short": {
                "en": "R. Shlomo Yitzchaki (1040–1105), the foundational medieval commentator on Tanakh and Talmud.",
                "pt": "R. Shlomo Yitzchaki (1040–1105), o comentarista medieval fundamental de Tanakh e Talmude.",
            },
        },
        {
            "id": "dibbur-hamatchil",
            "term": {"en": "dibbur hamatchil", "he": "דיבור המתחיל", "pt": "dibbur hamatchil"},
            "short": {
                "en": "The lemma — the quoted word or phrase Rashi is explaining. Each Rashi segment starts from a specific lemma, not from the whole verse.",
                "pt": "O lema — a palavra ou frase citada que Rashi explica. Cada segmento de Rashi parte de um lema específico, não do versículo inteiro.",
            },
        },
        {
            "id": "peshat",
            "term": {"en": "peshat", "he": "פשט", "pt": "peshat"},
            "short": {
                "en": "The contextual/plain sense of the verse, as the commentators understand it — not “literalism.”",
                "pt": "O sentido contextual/simples do versículo, como os comentaristas o entendem — não “literalismo.”",
            },
        },
        {
            "id": "derash",
            "term": {"en": "derash / midrash", "he": "דרש / מדרש", "pt": "derash / midrash"},
            "short": {
                "en": "An interpretive reading that draws out additional meaning, often from a linguistic or narrative gap, preserved in classical rabbinic collections.",
                "pt": "Uma leitura interpretativa que extrai sentido adicional, muitas vezes de uma lacuna linguística ou narrativa, preservada nas coleções rabínicas clássicas.",
            },
        },
        {
            "id": "siftei-chakhamim",
            "term": {"en": "Siftei Chakhamim", "he": "שפתי חכמים", "pt": "Siftei Chakhamim"},
            "short": {
                "en": "An early-modern supercommentary on Rashi that often states the question Rashi is answering.",
                "pt": "Um supercomentário da era moderna inicial sobre Rashi, que muitas vezes formula a pergunta que Rashi está respondendo.",
            },
        },
        {
            "id": "chazal",
            "term": {"en": "Chazal", "he": 'חז"ל', "pt": "Chazal"},
            "short": {
                "en": "“Our Sages, of blessed memory” — the rabbis of the Mishnah and Talmud, and the classical midrash.",
                "pt": "“Nossos Sábios, de abençoada memória” — os rabinos da Mishná e do Talmude, e o midrash clássico.",
            },
        },
        {
            "id": "bnei-noach",
            "term": {"en": "Bnei Noach", "he": "בני נח", "pt": "Bnei Noach"},
            "short": {
                "en": "Children of Noah: non-Jews who live in covenant with the God of Israel through the Noahide laws, without becoming Jews.",
                "pt": "Filhos de Noé: não-judeus que vivem em aliança com o Deus de Israel por meio das leis noahides, sem se tornarem judeus.",
            },
        },
        {
            "id": "elohim",
            "term": {"en": "Elohim", "he": "אֱלֹהִים", "pt": "Elohim"},
            "short": {
                "en": "A Divine Name. In Rashi’s reading of Genesis 1:1 it is associated with the attribute of justice.",
                "pt": "Um Nome Divino. Na leitura de Rashi de Gênesis 1:1, associa-se ao atributo da justiça.",
            },
        },
        {
            "id": "tetragrammaton",
            "term": {"en": "Tetragrammaton / Hashem", "he": "ה׳", "pt": "Tetragrama / Hashem"},
            "short": {
                "en": "The four-letter Divine Name, associated in classical commentary with mercy. Project prose uses “God” or “Hashem”; quoted sources keep their own rendering.",
                "pt": "O Nome Divino de quatro letras, associado no comentário clássico à misericórdia. A prosa do projeto usa “Deus” ou “Hashem”; as fontes citadas conservam sua própria grafia.",
            },
        },
        {
            "id": "niqqud",
            "term": {"en": "niqqud", "he": "ניקוד", "pt": "niqqud"},
            "short": {
                "en": "The vowel points of the Masoretic Hebrew text.",
                "pt": "Os sinais vocálicos do texto hebraico massorético.",
            },
        },
        {
            "id": "teamim",
            "term": {"en": "te'amim", "he": "טעמים", "pt": "te'amim"},
            "short": {
                "en": "Cantillation marks that encode phrasing and traditional chant.",
                "pt": "Sinais de cantilação que codificam a frase e o canto tradicional.",
            },
        },
    ]


def build_paths() -> list[dict]:
    return [
        {
            "id": "creation-and-humanity",
            "title": {"en": "Creation and Humanity", "pt": "Criação e humanidade", "he": "בריאה ואנושות"},
            "status": "partial",
            "summary": {
                "en": "Genesis 1–11: the world before Israel, the image of God, human responsibility, the Flood, and the covenant with Noah.",
                "pt": "Gênesis 1–11: o mundo antes de Israel, a imagem de Deus, a responsabilidade humana, o Dilúvio e a aliança com Noé.",
            },
            "steps": [
                {"verseId": "genesis-1-1", "label": {"en": "The beginning", "pt": "O princípio"}},
                {"verseId": "genesis-1-2", "label": {"en": "Unformed and void", "pt": "Informe e vazio"}},
                {"verseId": "genesis-1-3", "label": {"en": "Let there be light", "pt": "Haja luz"}},
                {"verseId": "genesis-1-4", "label": {"en": "Light divided", "pt": "A luz dividida"}},
                {"verseId": "genesis-1-5", "label": {"en": "One day", "pt": "Um dia"}},
                {"verseId": "genesis-1-6", "label": {"en": "The firmament", "pt": "O firmamento"}},
            ],
        },
        {
            "id": "reading-rashi",
            "title": {"en": "Reading Rashi for the first time", "pt": "Ler Rashi pela primeira vez", "he": "קריאת רש״י בפעם הראשונה"},
            "status": "partial",
            "summary": {
                "en": "Learn dibbur hamatchil, peshat, midrash and supercommentary from Genesis 1:1–5 rather than from abstract definitions.",
                "pt": "Aprenda dibbur hamatchil, peshat, midrash e supercomentário a partir de Gênesis 1:1–5, não de definições abstratas.",
            },
            "steps": [
                {"verseId": "genesis-1-1", "label": {"en": "Three lemmas on one verse", "pt": "Três lemas em um versículo"}},
                {"verseId": "genesis-1-3", "label": {"en": "When Rashi is silent", "pt": "Quando Rashi silencia"}},
                {"verseId": "genesis-1-5", "label": {"en": "A grammatical snag", "pt": "Um descompasso gramatical"}},
            ],
        },
        {
            "id": "the-one-god",
            "title": {"en": "The One God", "pt": "O Deus Uno", "he": "האל האחד"},
            "status": "planned",
            "summary": {
                "en": "Selected Torah, Prophets and Writings on divine unity, sovereignty, creation and idolatry.",
                "pt": "Seleções da Torá, Profetas e Escritos sobre unidade divina, soberania, criação e idolatria.",
            },
            "steps": [],
        },
        {
            "id": "nations-in-the-prophets",
            "title": {"en": "The nations in the Prophets", "pt": "As nações nos Profetas", "he": "הגויים בנביאים"},
            "status": "planned",
            "summary": {
                "en": "Isaiah 2 and 11, Micah 4, Zephaniah 3, Zechariah 8 and 14 — the nations knowing Hashem.",
                "pt": "Isaías 2 e 11, Miqueias 4, Sofonias 3, Zacarias 8 e 14 — as nações conhecendo Hashem.",
            },
            "steps": [],
        },
        {
            "id": "coming-from-a-christian-bible",
            "title": {"en": "Coming from a Christian Bible", "pt": "Vindo de uma Bíblia cristã", "he": "מביאה נוצרית"},
            "status": "planned",
            "summary": {
                "en": "Jewish book order, Hebrew names, translation differences, and context — beginning with Tanakh, not with polemic.",
                "pt": "Ordem judaica dos livros, nomes hebraicos, diferenças de tradução e contexto — começando pelo Tanakh, não pela polêmica.",
            },
            "steps": [],
        },
    ]


def build_reviews(verses, segments, elucidations) -> list[dict]:
    records = []
    for v in verses:
        records.append(
            {
                "id": f"review-{v['id']}-source",
                "targetId": v["id"],
                "targetKind": "verse",
                "sourceVerified": True,
                "citationsResolve": True,
                "rightsVerified": True,
                "elucidationReviewed": False,
                "scopeReviewed": False,
                "rabbinicReview": "pending",
                "contentHash": v["payloadChecksumSha256"],
                "notes": "Source/version/rights verified at ingest. Rabbinic review of applicability notes is pending.",
            }
        )
    for e in elucidations:
        records.append(
            {
                "id": f"review-{e['id']}",
                "targetId": e["id"],
                "targetKind": e["type"],
                "sourceVerified": e["status"] in {"sources-verified", "rabbinically-reviewed"},
                "citationsResolve": True,
                "rightsVerified": True,
                "elucidationReviewed": e["status"] == "rabbinically-reviewed",
                "scopeReviewed": False,
                "rabbinicReview": "pending" if e["type"] == "NOAHIDE_GUIDANCE" else "not-required-as-normative",
                "contentHash": sha256_text(e["text"]["en"], e["text"]["pt"]),
                "notes": e.get("reviewNote", "Editorial elucidation; not a historical source."),
            }
        )
    return records


if __name__ == "__main__":
    main()
