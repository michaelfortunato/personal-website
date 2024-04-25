#!/bin/zsh

# Get to repo root dir
cd "$(git rev-parse --git-path ../)"

DATA_DIR=".db"
HOST="localhost"
PORT=5432

pg_ctl start -D "$DATA_DIR" --options "-h $HOST -p $PORT"
