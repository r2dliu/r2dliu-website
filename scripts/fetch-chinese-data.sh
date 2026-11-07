#!/usr/bin/env bash
# Downloads the raw datasets used by `manage.py load_chinese_data` into
# api/data/chinese. They're published as npm packages; we only read their
# data files, nothing from them is executed.
#
#   hanzi-writer-data  stroke paths/medians (Make Me a Hanzi, Arphic license)
#   cedict-json        CC-CEDICT dictionary (CC BY-SA 4.0)
#   chinese-lexicon    SUBTLEX-CH word/char frequencies, HSK levels, pinyin freq
#   hanzi              Jun Da's character frequency list
#   tatoeba-sentence-pairs-in-mandarin-chinese-english
#                      Tatoeba Chinese/English sentence pairs (CC BY 2.0 FR)
#
# Plus two Chinese-Chinese dictionaries (MIT) from GitHub:
#   chinese-xinhua     pwxcoo/chinese-xinhua: 新华字典 characters and 词典
#   mapull             mapull/chinese-dictionary: modern word definitions
set -euo pipefail

DATA_DIR="$(cd "$(dirname "$0")/.." && pwd)/api/data/chinese"
PACKAGES=(hanzi-writer-data@2.0.1 cedict-json@1.3.20251213 chinese-lexicon@1.0.43 hanzi@3.2.0
  tatoeba-sentence-pairs-in-mandarin-chinese-english@0.20260520.0)

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
# A pinned package lands in a folder named for the package; keep the
# sentence data under a short name.
[ -d tatoeba-cmn-eng ] || mv tatoeba-sentence-pairs-in-mandarin-chinese-english tatoeba-cmn-eng

fetch() {  # fetch <dir> <url>
  [ -f "$1/$(basename "$2")" ] && return
  mkdir -p "$1"
  echo "Fetching $2"
  curl -fsSL -o "$1/$(basename "$2")" "$2"
}
GH=https://raw.githubusercontent.com
fetch chinese-xinhua $GH/pwxcoo/chinese-xinhua/master/data/word.json
fetch chinese-xinhua $GH/pwxcoo/chinese-xinhua/master/data/ci.json
fetch mapull $GH/mapull/chinese-dictionary/main/word/word.json
fetch mapull $GH/mapull/chinese-dictionary/main/character/char_detail.json

echo "Data is in $DATA_DIR"
echo "Next: cd api && python manage.py load_chinese_data"
