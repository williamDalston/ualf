SHELL := /bin/bash
PORT_WEB ?= 3001

api.dev:
	. .venv/bin/activate && uvicorn ualf_api.main:app --app-dir apps/api --reload --port 8000

web.dev:
	cd apps/web && pnpm dev -p $(PORT_WEB)

api.install:
	python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r apps/api/requirements.txt

web.install:
	cd apps/web && pnpm install && pnpm approve-builds

check:
	./ops/checks/healthcheck.sh || true
	./ops/checks/smoke.sh || true

api.health:
	curl -sf http://127.0.0.1:8000/health/live && echo && curl -sf http://127.0.0.1:8000/health/ready && echo

api.logs:
	tail -n 200 -f apps/api/uvicorn.log || true

web.check:
	cd apps/web && pnpm -s lint || true

smoke:
	./ops/checks/smoke.sh

docker.build:
	cd infra && docker compose build

docker.up:
	cd infra && docker compose up -d

docker.logs:
	cd infra && docker compose logs -f --tail=200

docker.down:
	cd infra && docker compose down

docker.ps:
	cd infra && docker compose ps

docker.health:
	curl -sf http://localhost:3001/health && echo
