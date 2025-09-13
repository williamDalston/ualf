#!/usr/bin/env bash
set -euo pipefail
curl -sf http://127.0.0.1:8000/analytics/summary >/dev/null
