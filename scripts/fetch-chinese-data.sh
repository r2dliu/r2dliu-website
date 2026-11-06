#!/usr/bin/env bash
# Downloads the raw datasets used by `manage.py load_chinese_data` into
# api/data/chinese. They're published as npm packages; we only read their
# data files, nothing from them is executed.
#
#   hanzi-writer-data  stroke paths/medians (Make Me a Hanzi, Arphic license)
#   cedict-json        CC-CEDICT dictionary (CC BY-SA 4.0)
#   chinese-lexicon    SUBTLEX-CH word/char frequencies, HSK levels, pinyin freq
#   hanzi              Jun Da's character frequency list
set -euo pipefail

DATA_DIR="$(cd "$(dirname "$0")/.." && pwd)/api/data/chinese"
PACKAGES=(hanzi-writer-data@2.0.1 cedict-json@1.3.20251213 chinese-lexicon@1.0.43 hanzi@3.2.0)

mkdir -p "$DATA_DIR"
cd "$DATA_DIR"
for pkg in "${PACKAGES[@]}"; do
  name="${pkg%@*}"
  if [ -d "$name" ]; then
    echo "$name already downloaded"
    continue
  fi
  echo "Fetching $pkg"
  tarball="$(npm pack "$pkg" --silent --ignore-scripts)"
  mkdir "$name"
  tar xzf "$tarball" -C "$name" --strip-components=1
  rm "$tarball"
done
echo "Data is in $DATA_DIR"
echo "Next: cd api && python manage.py load_chinese_data"
