# Runbook

## Symptoms -> Actions
Frontend 500: Check browser console, `make web.logs`, then `make web.check`.
Backend 5xx: `make api.logs`, hit `/health/*`, check last deploy diff.

## Standard Checks
1. `make check`
2. `make api.health`
3. `make smoke`

## Rollback
- Revert to previous git tag and redeploy.

