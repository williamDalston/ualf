# UALF

A modular AI tutoring MVP with FastAPI backend and Next.js frontend.

## Quick Start
1. Backend: `make api.dev` then visit `http://127.0.0.1:8000/health/live`
2. Frontend: `make web.dev` then visit `http://localhost:3001`
3. Full checks: `make check`

## Structure
- apps/api: FastAPI service
- apps/web: Next.js app
- ops/checks: health, smoke, lint, type, e2e entrypoints
- docs: architecture, runbook, troubleshooting, observability, error catalog

## Conventions
- Structured JSON logs with request_id
- Central error catalog with stable codes
- Health endpoints: /health/live, /health/ready
- Readiness probes validate downstream deps optionally via `READINESS_STRICT=true`

