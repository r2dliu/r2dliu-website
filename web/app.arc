@app
r2dliu

@aws
runtime nodejs18.x
memory 512
timeout 30
# concurrency 1
# profile default
# region us-west-1
# timeout 30

@http
/*
  method any
  src server

@plugins
plugin-remix
  src plugin-remix.js

@static