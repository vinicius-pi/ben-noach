#!/bin/sh
set -eu

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT INT TERM

ACTIONLINT_VERSION="1.7.12"
ACTIONLINT_SHA256="8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8"
ACTIONLINT_ARCHIVE="actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"
ACTIONLINT_URL="https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${ACTIONLINT_ARCHIVE}"

curl --fail --silent --show-error --location "$ACTIONLINT_URL" --output "$work/$ACTIONLINT_ARCHIVE"
printf '%s  %s\n' "$ACTIONLINT_SHA256" "$work/$ACTIONLINT_ARCHIVE" | sha256sum --check --status
tar -xzf "$work/$ACTIONLINT_ARCHIVE" -C "$work" actionlint
"$work/actionlint"

ZIZMOR_VERSION="1.30.1"
ZIZMOR_SHA256="e65324f4430c2717591937edcec90ccbefaf14c174f8ec9415e03ca875b46e1a"
ZIZMOR_ARCHIVE="zizmor-x86_64-unknown-linux-gnu.tar.gz"
ZIZMOR_URL="https://github.com/zizmorcore/zizmor/releases/download/v${ZIZMOR_VERSION}/${ZIZMOR_ARCHIVE}"

curl --fail --silent --show-error --location "$ZIZMOR_URL" --output "$work/$ZIZMOR_ARCHIVE"
printf '%s  %s\n' "$ZIZMOR_SHA256" "$work/$ZIZMOR_ARCHIVE" | sha256sum --check --status
tar -xzf "$work/$ZIZMOR_ARCHIVE" -C "$work" zizmor
"$work/zizmor" --collect=workflows --min-severity=low .
