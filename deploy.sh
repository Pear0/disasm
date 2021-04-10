#!/bin/sh
set -e

if [ ! -d "dist_pages" ]; then
    git worktree add dist_pages gh-pages
fi

rm -r dist_pages/* || echo 'no published files'

cp -r dist/* dist_pages/

cd dist_pages

git --work-tree=./ status
git --work-tree=./ add .
git --work-tree=./ commit -m "Deploy at $(date)"
