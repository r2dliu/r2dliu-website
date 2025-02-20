# api

This project uses [uv](https://github.com/astral-sh/uv) to manage dependencies and [Ruff](https://github.com/astral-sh/ruff) for linting. Install uv via brew and then install ruff via uv. Requires postgres, which should also be installed via brew and have its executables added to path. May have to run `createdb` if you run into issues with something like `FATAL:  database "r2dliu" does not exist`

Run `init-db.sh` in the `scripts` folder to setup initial database

Site is hosted by gcloud

Install google cloud sdk

Update with gcloud app deploy

Need to manually create requirements.txt unfortunately from the pyproject.toml

`uv pip compile pyproject.toml -o requirements.txt`
