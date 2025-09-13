# Troubleshooting

## Port In Use
Find and kill: `lsof -i :3000` then `kill -9 PID`. Use `PORT_WEB=3001 make web.dev` to change.

## Missing Python Module
Ensure venv active: `. .venv/bin/activate` then `pip install -r apps/api/requirements.txt`.

## CORS
Set `CORS_ORIGINS` env, comma-separated.

