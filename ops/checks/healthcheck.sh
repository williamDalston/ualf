#!/usr/bin/env bash
set -euo pipefail
curl -sf http://127.0.0.1:8000/health/live >/dev/null
curl -sf http://127.0.0.1:8000/health/ready >/dev/null
