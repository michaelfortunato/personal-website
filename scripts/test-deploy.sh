#!/bin/bash
set -eo pipefail

cd "$(git rev-parse --git-path ../)"
echo "Testing ONLY .github/workflows/deploy-dev.yaml ..."
act --workflows "$(git rev-parse --git-path ../.github/workflows/deploy-dev.yaml)" \
	--secret-file "$(git rev-parse --git-path ../.env.local)"
