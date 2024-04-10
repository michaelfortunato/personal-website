#!/bin/bash
set -e
echo "Setting gitconfig core.hookspath to our hooks..."
git config core.hookspath "$(git rev-parse --git-path ../scripts/.githooks)"
echo "Success."
echo "Checking that .env.local exists ..."
test -f "$(git rev-parse --git-path ../.env.local)"
echo "Success."

echo "Development environemnt setup. You can now use helper scripts/ in here when you want."
