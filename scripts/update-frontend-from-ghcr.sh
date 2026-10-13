#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/var/www/novanestholding.com"
cd "$PROJECT_DIR"

# Only deploy code from main and don't overwrite locally modified tracked files.
if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "[skip] Current branch is not main."
  exit 1
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "[skip] Local tracked changes present. Commit or stash them first; refusing auto-update."
  exit 1
fi

# Pull GitHub source (Compose configuration, templates, etc.) without losing local changes.
git fetch origin main
git merge --ff-only origin/main
COMMIT="$(git rev-parse HEAD)"

# Download the latest published build. No local npm/docker build happens here.
docker compose pull frontend

# A push can reach Git before its image has finished building. Avoid deploying a
# stale :latest image by verifying that the published image matches this commit.
IMAGE="$(docker compose config --format json | python3 -c 'import json,sys; print(json.load(sys.stdin)["services"]["frontend"]["image"])')"
IMAGE_COMMIT="$(docker image inspect --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' "$IMAGE")"
if [[ "$IMAGE_COMMIT" != "$COMMIT" ]]; then
  echo "[wait] Git main=$COMMIT but available Docker image revision=$IMAGE_COMMIT"
  echo "[wait] GitHub Actions may still be publishing. Will retry at the next timer run."
  exit 0
fi

docker compose up -d --no-deps --no-build frontend
printf '[ok] Frontend is running Git commit %s\n' "$COMMIT"
