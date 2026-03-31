#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="rustyseo-linux-builder"
CONTAINER_NAME="rustyseo-linux-build"
OUTPUT_DIR="${ROOT_DIR}/dist-linux"

mkdir -p "${OUTPUT_DIR}"

docker build -f "${ROOT_DIR}/Dockerfile.linux-build" -t "${IMAGE_NAME}" "${ROOT_DIR}"

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
docker create --name "${CONTAINER_NAME}" "${IMAGE_NAME}" >/dev/null

docker cp "${CONTAINER_NAME}:/workspace/src-tauri/target/release/bundle" "${OUTPUT_DIR}/bundle"
docker rm -f "${CONTAINER_NAME}" >/dev/null

echo "Linux bundles copied to ${OUTPUT_DIR}/bundle"
