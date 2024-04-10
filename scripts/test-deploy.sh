#!/bin/bash
set -eo pipefail

act --workflows "$(git rev-parse --git-path ../.github/workflows)" \
	--secret-file "$(git rev-parse --git-path ../.env.local)"
