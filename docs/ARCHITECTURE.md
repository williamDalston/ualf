# Architecture

## Overview
Frontend (Next.js) talks to Backend (FastAPI) via REST. Backend is stateless; persistence and cache are optional and can be added behind feature flags. Observability defaults to JSON logs and request_id propagation.

## Request Flow
User -> web (Next.js) -> api (FastAPI) -> services -> llm/providers | store | cache

## Error Strategy
- Deterministic error codes (ERR-XXXX)
- User-facing messages safe and generic
- Logs carry diagnostics keyed by request_id

## Health Model
- Liveness: process is up
- Readiness: dependencies available; configurable strictness

