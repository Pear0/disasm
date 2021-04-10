#!/bin/sh
set -e

if [ ! -d "dist_pages" ]; then
    git worktree add dist_pages gh-pages
fi

rm -r dist_pages/*

cp -r dist/* dist_pages/

cd dist_pages

git status
