# api

This project uses [uv](https://github.com/astral-sh/uv) to manage dependencies and [Ruff](https://github.com/astral-sh/ruff) for linting. Install uv via brew and then install ruff via uv. Requires postgres, which should also be installed via brew and have its executables added to path. May have to run `createdb` if you run into issues with something like `FATAL:  database "r2dliu" does not exist`

Run `init-db.sh` in the `scripts` folder to setup initial database

Site is hosted by gcloud

Install google cloud sdk

Update with gcloud app deploy

Need to manually create requirements.txt unfortunately from the pyproject.toml

`uv pip compile pyproject.toml -o requirements.txt`

## Chinese flashcards (`r2dliu/chinese`)

Anki-style flashcards at `/chinese` on the site, with configurable "failure"
tasks (draw strokes, explore related vocab, type pinyin) that must be finished
after pressing Again. GraphQL lives in `r2dliu/chinese/schema.py` and is merged
into the root schema.

Load the reference data (characters, strokes, vocab, frequencies) once per
database, after `migrate`. Re-running updates rows in place and keeps learners'
cards:

```
../scripts/fetch-chinese-data.sh   # downloads datasets into api/data/chinese
python manage.py load_chinese_data # ~1 min; 9.6k characters, 112k strokes, 41k words
```

Sources: stroke data from Make Me a Hanzi (via `hanzi-writer-data`), definitions
from CC-CEDICT, frequency order from SUBTLEX-CH (spoken) falling back to Jun Da
(written), HSK levels from `chinese-lexicon`.

Learners are anonymous for now: the browser generates an id and sends it as the
`X-Learner-Id` header.
